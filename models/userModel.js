const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
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
    role:{
        type: String,
        enum:['user', 'guide', 'lead-guide' , 'admin'],
        default: 'user'
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
    passwordChangedAt : Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});
userSchema.pre('save',async function (next){
    //this keyword refer to current documents
    //  Only run this function if password was actually modifies or created
    if(!this.isModified('password')  || this.isNew) return next();
    //.hash is async function 
    // hash password with cost of 12 
    this.password =await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    this.passwordChangedAt = Date.now() - 1000;// minus one second is because ..jwt tokens are created faster than saving documentin DB
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
};
userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log(resetToken , this.passwordResetToken)
    this.passwordResetExpires = Date.now() + 10*60*1000;
    return resetToken;
}
const User = mongoose.model('User', userSchema);
module.exports = User;