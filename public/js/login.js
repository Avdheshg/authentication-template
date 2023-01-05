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
      
// ========     Overview    ===========
// const overviewFunction = async () => {
//     console.log("*** login.js => 6. Overview Function  ***");
//     try {      
//         console.log("Making a POST request in axios to /overview route");

//         const res = await axios({
//             method: 'GET',
//             url: '/overview'             
//         })

//         console.log("POST req completed to /overview route and the data is received. Now calling the overview MW ");
//         // console.log(res);

//         if (res.data.status === 'success') {
//             showAlert('success', 'Logged in successfully!');
//             window.setTimeout(() => {
//                 location.assign('/overview');      
//             }, 200);     
//         } else {
//             showAlert('failure', 'Log in to get access!');
//         }
 
//     } catch (err) {           
//         console.log(err);
//         showAlert("error", err.response.data.message);   
//     }
// }

// const overviewBtn = document.querySelector(".overview-btn");
// if (overviewBtn) {
//     console.log("*** login.js => 5. Overview Btn  ***");
//     overviewBtn.addEventListener("click", overviewFunction);
// }










