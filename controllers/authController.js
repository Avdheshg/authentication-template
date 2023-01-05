const jwt = require("jsonwebtoken");
const { promisify } = require("util");

console.log("Loading authController.js");

// ===== PROTECT MW ==========
exports.protect = async (req, res, next) => {
    console.log("*** authController.js => 1. protect MW  ***");
   
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

exports.dummy = async (req, res) => {
  console.log("====== DUMMY MW Running    ==========");
  next();
}