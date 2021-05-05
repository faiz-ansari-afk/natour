const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
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
})