
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
    photo: Number
});
   
// pre MW for checking "password" and "passwordConfirm"
userSchema.pre("save", async function(next) {
    // if the pass is not modified
    if (!this.isModified("password")) {
        return next();
    }    

    // hash the password and delete the confirm pass     
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    // call the next pass
    next();
});

// checking if entered password and the document password is correct
userSchema.methods.checkPassword = async function(inputPassword, dbPassword) {
    return await bcrypt.compare(inputPassword, dbPassword);
}
    
const User = mongoose.model('User', userSchema);

module.exports = User;





























