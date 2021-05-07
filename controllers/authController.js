const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const catchAsync = require('../utils/catchAsyncError');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

const signToken = id =>{
    return jwt.sign( {id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}
exports.signup =  catchAsync(async function(req, res, next) {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token, 
        data: {
            user: newUser
        }
    })
});

exports.login =catchAsync(async (req, res, next) => {
    const {email , password} = req.body;
    //1] check if user exists
    if(!email || !password){
        return next(new AppError('Please provide email and password' , 400))
    }
    //2]Check if user exists && password if correct
    // we have selected:false in user model to hide password from user on Get route and now we have to do select(+password) in order to check and verify password
    const user =await User.findOne({email}).select('+password');
    // chehcking user password in userModel file
    // const correct = await user.correctPassword(password, user.password);
    if(!user || !await user.correctPassword(password, user.password)){
        return next(new AppError('Incorrect email and password',401))
    }
    
    //3]Evrything ok, sent tokens to user
    const token = signToken(user._id)
    res.status(200).json({
        status:'Success',
        token
    })
});

// to show authenticated tours for loggedin user
exports.protect = catchAsync(async (req, res, next) => {
    //1] Getting token and check if its exists
    // general way of sending headers is=>   Authorization: Bearer hjgefgawoigbgqgigvoiuruir
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        //value declared within scope stays within scope
        token = req.headers.authorization.split(' ')[1];
    }   
    if(!token){
        return next(new AppError('You are not logged in. Please login to get access',401))
    }
    //2] Validate token (Super Important step) --verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET )
    // console.log(decoded)
    //3] Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user belonging to this token no loger exist'))
    }
    //4] Check if user changed password after the jwt was issued
    //instance method that will be avialbale on documents ...userModel 
    if (currentUser.changedPasswordAfterJWTToken(decoded.iat)){
        return next(new AppError('User recently changed password! Please login again',401))
    };

    // Grant access to protected route
    req.user = currentUser;//for future...
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles is an array ['admin','lead-guide']
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action',403))
        }
        next();
    }
}
