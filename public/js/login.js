console.log("== running  == ")
// import axios from "/axios";

// ------   Alerts   ------ 
// console.log("running alerts");
const hideAlert = () => {
    console.log("*** login.js => hideAlert  ***");
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
    console.log("*** login.js => showAlter  ***");
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};



// ============   LOGIN    ============ 
const loginForm = document.querySelector(".form");
if (loginForm) {
    console.log("*** login.js => 1. loginForm  ***");
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // console.log("email", email, " password", password);
        login(email, password);       
    })
}

const login = async (email, password) => {
    console.log("*** login.js => 2. Login Function  ***");
    try {
        console.log("Making a POST request in axios to /login route");

        const res = await axios({
            method: 'POST',
            url: '/login',
            data: {
                email,
                password
            }
        })

        console.log("POST req completed to /login route and the data is received. Now calling the home MW ");
        console.log(res);

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/home');      
            }, 200);    
        }    
 
    } catch (err) {           
        console.log(err);
        showAlert("error", err.response.data.message);   
    }
}

// ============   LogOut    ============ 
const logoutFunction = async () => {
    console.log("*** login.js => 3. logoutFunction  ***");  
    try {

        var res;
        try {
            res = await axios({
              method: 'GET',  
              url: '/logout'
            });    
            console.log("response from the /logout route", res);        
        } catch (err) {
            console.log("axios error", err);         
        }     
         

      if ((res.data.status = 'success')) {
        showAlert('success', 'Logged out successfully!');
        // location.reload(true);  
        window.setTimeout(() => {
            location.assign('/view/login'); 
        }, 2000);

      }           
    } catch (err) {                
      console.log(err);    
      showAlert('error', 'Error logging out! Try again.');      
    }     
};  

const logoutBtn = document.querySelector(".logout");
if (logoutBtn) {    
    console.log("*** login.js => 4. logoutBtn  ***");
    // console.log("logoutBtn present", logoutBtn);
    logoutBtn.addEventListener("click", logoutFunction);
}    
      

// ============   SIGNUP    ============ 
const signupForm = document.querySelector(".signup-form");
if (signupForm) {
    console.log("*** login.js => 5. signupForm  ***");
    signupForm.addEventListener("submit", e => {   
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;        
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("confirm-password").value;

        // console.log("email", email, " password", password);
        signupFunction(name, email, password, passwordConfirm);       
    })
}     

const signupFunction = async (name, email, password, passwordConfirm) => {
    console.log("*** login.js => 6. signup Function  ***");
    try {
        console.log("Making a POST request in axios to post /signup route");

        const res = await axios({
            method: 'POST',
            url: '/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm 
            }
        })

        console.log("POST req completed to  post /signup and the data is received. Now calling the home MW ");
        console.log(res);

        if (res.data.status === 'success') {
            showAlert('success', 'New Account created successfully!');
            window.setTimeout(() => {
                location.assign('/home');      
            }, 2000);    
        }        
        
    } catch (err) {           
        console.log(err);
        showAlert("error", err);   
    }
}
   









