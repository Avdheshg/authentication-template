const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");

console.log("Loading authController.js");

// ===================         PROTECT MW      ===============================
exports.protect = async (req, res, next) => {
    console.log("*** authController.js :: 1. protect MW  ***");
   
    try {         
  
      // check if V have headers and it starts with "Bearer", then save the token
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        // console.log("token", token);   
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
        // console.log("req.cookies", req.cookies);
      }
                                                                     
      // checking if the token exists
      if (!token) {
        console.log("No token present, Please log in to get access")
        return res.status(401).json({
          status: "fail",
          message: "Please log in to get access"      
        })        
      }
  
      const decoded = await promisify(jwt.verify)(token, "this is the secret of jwt");
      // console.log(decoded);
  
    } catch (err) {
      // next();
      console.log("protect error",err);
      // res.status(401).json({     
      //   status: "fail",
      //   message: err  
      // })
      // next();
    }
  
    next();
}


// ===================         Forgot Password      ===============================
const User = require("../models/userModel");
const sendEmail = require("../utils/email");

exports.forgotPassword = async (req, res, next) => {
  console.log("*** authController.js :: forgotPassword  ***");
  
  // find the user with the email provided
  const user = await User.findOne({email: req.body.email});
    
  // check if the user exists
  if (!user) {
    res.status(400).json({
      status: "failure",
      message: "No user exists with the given email. Please provide a valid email"
    })
  }

  // if user exists, generate the reset token and send it to the user
  const resetToken = user.createPasswordResetToken();
  await user.save();
  console.log("curr user", user);
  // await user.save({ validateBeforeSave: false});
        
  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  // console.log("resetURL", resetURL);
  
  // message 
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });
  
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
  } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.log(err);
  
      return res.status(500).json({
        status: "fail",
        message: "There was an error sending the email. Try again later!",
      });
  }
  
  // next();
}

// ===========         Password Reset      =======================
/* 
Algorithm to implement reset password function 
    1. Get the user based on the token
    2. We will set the new password only when if the token has not expired and there is a user available for this token in the database
    3. Update the changedPasswordAt property for the user
    4. Finally, log the user in ie send the jwt token to the client
*/
// const User = require("../models/userModel");
exports.resetPassword = async (req, res, next) => {
  console.log("*** authController.js :: resetPassword  ***");
  
  // 1. Get the user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});
  
  // 2. If user is present and the token is stil valid(not expired), set the password
  if (!user) {   
    return res.status(400).json({
      status: "fail",
      message: "Token is invalid or has expired"
    })
  }
      
  // if the user exists
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 3. update the changedPasswordAt property for the curr user => presave MW

  // 4. Log the user in and send the JWT
  const token = jwt.sign({id: user._id}, "this is the secret of jwt");

  res.status(200).json({
    status: "success",
    token
  })

}
















