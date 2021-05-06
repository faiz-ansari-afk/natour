const mongoose = require('mongoose');
const validator = require('validator');
var bcrypt = require('bcryptjs');
// require('mongoose-type-email');

const userSchema =  new mongoose.Schema({
    name:{
        type: String,
        required: [true , 'Please tell us your name!']
    },
    email:{
        // type: mongoose.SchemaTypes.Email,
        type: String,
        required: [true , 'Please provide your email'],
        unique : true,
        lowercase: true,
        validate :[validator.isEmail , 'Please proveide a correct email']
    },
    photo:{
        type: String
    },
    password:{
        type: String,
        required: [ true , 'Please provide your password'],
        minlength: 8,
        select :false
    },
    passwordConfirm: {
        type: String,
        required: [ true , 'Please confirm your password'],
        validate:{
            // only works on SAVE and CREATE
            validator: function(element) {
                return element === this.password
            },
            message:'Passwords do not match'
        }
    },
    passwordChangedAt : Date
});
userSchema.pre('save',async function (next){
    //this keyword refer to current documents
    //  Only run this function if password was actually modifies or created
    if(!this.isModified('password')) return next();
    //.hash is async function 
    // hash password with cost of 12 
    this.password =await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();

});
// Checking user password while login....
//instance method is avialble oon all documentsof certain collection
userSchema.methods.correctPassword = async function(candidatePassword, userPassword ) {
    // candidatePassword is password from users
    return await bcrypt.compare(candidatePassword, userPassword)
}
userSchema.methods.changedPasswordAfterJWTToken = function (JWTTimestamp){
    if(this.passwordChangedAt){
        const changeTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        // console.log(changeTimestamp, JWTTimestamp)
        return JWTTimestamp < changeTimestamp
    }
    //False means password not change
    return false
}
const User = mongoose.model('User', userSchema);
module.exports = User;