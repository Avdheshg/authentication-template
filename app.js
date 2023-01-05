const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const morgan = require('morgan')

const User = require("./models/userModel");
const authController = require("./controllers/authController");

const path = require("path");
// const indexHTML = require("") 

const app = express();   

// MIDDLEWARES
app.use(express.json());    
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser()); 
app.use(morgan("dev"));     
// pug
app.set('view engine', 'pug');    
app.set("views", path.join(__dirname, "views"));



  
// =============   DATABASE   =================
const DB = `mongodb+srv://carWorldAvdhesh:aQw9j5XOuCWLVHnE@cluster0.kzcjw.mongodb.net/cars?retryWrites=true&w=majority`
mongoose.set('strictQuery', false);
mongoose.connect(DB, {
  useNewUrlParser: true,
  // useCreateIndex: true,  
  // useFindAndModify: true,
  useUnifiedTopology: true,
})
.then( () => console.log('DB connection successful') );
   
// console.log("*** =========================================  ***");
// =========    GENERATING AND SENDING JWT   =========================
const generateJWT = (id) => {
  // console.log("*** app.js =>   ***");       
  console.log("*** app.js => generateJWT  ***");
  return jwt.sign({id: id}, "this is the secret of jwt");
}
const createSendToken = (user, statusCode, res) => {
  console.log("*** app.js => createSendToken  ***");     
  const token = generateJWT(user._id);                  

  // COOKIE         
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true             
  };

  res.cookie('jwt', token, cookieOptions);   

  user.password = undefined;    

  res.status(statusCode).json({
    status: 'success',     
    token,
    data: {
      user    
    }    
  });  
};


// ===== LOGIN  ========== 
app.get("/login", (req, res) => {    
  res.status(200).render("login");
})   
// after getting the email and password and if they R valid, then this function will generate the JWT and will send it
app.post("/login", async (req, res) => {
  console.log("*** app.js => 1. /login  ***");
  try {
    
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",   
        message: "Please provide email and password"
      })   
    }
    
    // finding the user using email
    const user = await User.findOne({email: req.body.email}).select("+password");
    // console.log("user", user);

    // checking if the user exists and if entered password and the document password is correct
    if (!user || !await user.checkPassword(req.body.password, user.password)) {
      console.log("Incorrect pass");
      return res.status(401).json({
        status: "fail",
        message: "Enter correct password"     
      })
    }
    
    // creating a JWT
    // const token = jwt.sign({id: user._id}, "this is the secret of jwt");
    const token = createSendToken(user, 200, res);

  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: "fail",
      message: err
    })
  }
})


// ===== VIEW:: LOGIN  ==========   
app.get("/view/login", (req, res) => {
  console.log("*** app.js => 2. /view/login  ***");
  res.status(200).render("login");
})


//  =====   LOGOUT    ==========
app.get("/logout", (req, res) => {
  console.log("*** app.js => 3.logout  ***");
  res.cookie("jwt", "token");
  res.status(200).json({  
    status: "success",
    message: "Logged-out",  
  })
  // res.status(200).render("login");
})           
    
app.get("/home", authController.protect, (req, res) => {       
  console.log("*** app.js => 4. /home  ***");
  // console.log(__dirname);
  res.status(200).render("home");        
})   
   
app.get("/overview", authController.protect, (req, res) => {       
  console.log("*** app.js => 5. /overview  ***");
  // console.log(__dirname);  
  res.status(200).render("overview");      
  // res.status(200).json({                 
  //   status: "success", 
  // })      
})          



// ===== SIGNUP  ==========
app.get("/signup", (req, res) => {  
  console.log("*** app.js => 6. get /signup  ***");
  res.status(200).render("signup");
})
app.post("/signup", async (req, res) => {
  console.log("*** app.js => 7. post /signup  ***");
  try {    
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm     
    })      
   
    // const token = jwt.sign({id: newUser._id}, "this is the secret of jwt");
    const token = createSendToken(newUser, 201, res);
        
  } catch (err) {
    console.log(err);                                           
    res.status(400).json({
      status: "fail",   
      message: err
    })      
  }
})
  





/* 
  Password reading is disbaled from DB

*/





















app.listen(3000, () => {
  console.log("App is listening on the port 3000");
});

































