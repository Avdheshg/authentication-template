
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    email: {
        type: String,
        required: [true, 'A user must have a email'],
        unique: true, 
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,  
        required: [true, 'Please provide a password'],
        // minlength: 5,
        select: false   // pass will not be shown to the User    
    },
    passwordConfirm: {
        type: String,
        require: [true, "Provide confirm password"],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: "Passwords are not the same!"   
        }
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    photo: Number    
});   
   
// pre MW for encrypting the password
userSchema.pre("save", async function(next) {
    console.log("*** userModel.js :: presave MW for encrypting the password  ***");
    
    // if the pass is not modified
    if (!this.isModified("password")) {
        // console.log("presave MW: password is not modified")
        return next();
    }    

    // hash the password and delete the confirm pass     
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    // call the next MW
    next();
});

// checking if entered password(while making a post request to login route) and the document password(present in DB) is correct
userSchema.methods.checkPassword = async function(inputPassword, dbPassword) {
    console.log("*** userModel.js :: checkPassword  ***");
    
    return await bcrypt.compare(inputPassword, dbPassword);
}

// ===================         Forgot Password          ===============================
const crypto = require("crypto");

/* 
This function will do 3 things:
    1. generate random token
    2. encrypt this token, and attach it to the current user or document
    3. Define a expire timer for this reset token and will also attach this timer to the current user

In the nutshell, after the execution of this function, the current user will be having encrypted token with a expire timer

*/
userSchema.methods.createPasswordResetToken = function() {
    console.log("*** userModel.js :: createPasswordResetToken  ***");
    
    // generating the random string which will be the password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // encrypting the token
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    // time at which passwordResetToken expires
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
}

// ===================         Reset Password :: For updating the passwordChangedAt property only if the password is modified
userSchema.pre("save", function(next) {
    console.log("*** userModel.js :: presave MW for updating the passwordChangedAt property  ***");
    
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})









    
const User = mongoose.model('User', userSchema);

module.exports = User;





























