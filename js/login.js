import { db } from "./firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
/*=========================================
 School Connect TN
 Login Module
 Developed by VTOOS Software Solutions
 Part - 1
=========================================*/

// =========================================
// DOM Ready
// =========================================

document.addEventListener("DOMContentLoaded", initLogin);

function initLogin(){

    initializeElements();

    bindEvents();

    loadRememberMe();

    bindRememberEvent();

}

// =========================================
// Global Variables
// =========================================

let schoolSelect;
let roleSelect;
let emisInput;
let passwordInput;
let rememberCheck;
let loginButton;
let messageBox;
let togglePasswordBtn;

// =========================================
// Initialize Elements
// =========================================

function initializeElements(){

    schoolSelect = document.getElementById("school");

    roleSelect = document.getElementById("role");

    emisInput = document.getElementById("email");

    passwordInput = document.getElementById("password");

    rememberCheck = document.getElementById("remember");

    loginButton = document.querySelector(".loginBtn");

    messageBox = document.getElementById("msg");

    togglePasswordBtn = document.getElementById("togglePassword");

}

// =========================================
// Bind Events
// =========================================

function bindEvents(){

    togglePasswordBtn.addEventListener("click", togglePassword);

    loginButton.addEventListener("click", loginUser);

}

// =========================================
// Password Show / Hide
// =========================================

function togglePassword(){

    if(passwordInput.type==="password"){

        passwordInput.type="text";

        togglePasswordBtn.innerHTML='<i class="fa-solid fa-eye-slash"></i>';

    }
    else{

        passwordInput.type="password";

        togglePasswordBtn.innerHTML='<i class="fa-solid fa-eye"></i>';

    }

}

// =========================================
// Loading Button
// =========================================

function showLoading(){

    loginButton.disabled=true;

    loginButton.innerHTML=
    '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';

}

function hideLoading(){

    loginButton.disabled=false;

    loginButton.innerHTML=
    '🚀 LOGIN TO DASHBOARD';

}

// =========================================
// Message Helper
// =========================================

function showMessage(text,type="error"){

    messageBox.innerHTML=text;

    messageBox.className=type;

}

function clearMessage(){

    messageBox.innerHTML="";

    messageBox.className="";

}
/*=========================================
 Validation Module
=========================================*/

// =========================================
// Login Validation
// =========================================

function validateLogin(){

    clearMessage();

    const school = schoolSelect.value.trim();
    const role = roleSelect.value.trim();
    const emis = emisInput.value.trim();
    const password = passwordInput.value.trim();

    // School

    if(school===""){

        showMessage("Please select your school.");

        schoolSelect.focus();

        return false;

    }

    // Role

    if(role===""){

        showMessage("Please select login role.");

        roleSelect.focus();

        return false;

    }

    // EMIS

    if(emis===""){

        showMessage("Please enter EMIS Number.");

        emisInput.focus();

        return false;

    }

    // Password

    if(password===""){

        showMessage("Please enter password.");

        passwordInput.focus();

        return false;

    }

    return true;

}

// =========================================
// EMIS Validation
// =========================================

function validateEMIS(emis){

    if(emis.length < 6){

        showMessage("Invalid EMIS Number.");

        emisInput.focus();

        return false;

    }

    return true;

}

// =========================================
// Password Validation
// =========================================

function validatePassword(password){

    if(password.length < 4){

        showMessage("Password is too short.");

        passwordInput.focus();

        return false;

    }

    return true;

}

// =========================================
// Form Validation
// =========================================

function validateForm(){

    if(!validateLogin()){

        return false;

    }

    if(!validateEMIS(emisInput.value.trim())){

        return false;

    }

    if(!validatePassword(passwordInput.value.trim())){

        return false;

    }

    return true;

}
/*=========================================
 Remember Me Module
=========================================*/

// =========================================
// Load Remembered Login
// =========================================

function loadRememberMe(){

    const remember = localStorage.getItem("rememberMe");

    if(remember !== "true"){

        return;

    }

    const savedSchool = localStorage.getItem("savedSchool");
    const savedRole = localStorage.getItem("savedRole");
    const savedEMIS = localStorage.getItem("savedEMIS");

    if(savedSchool){

        schoolSelect.value = savedSchool;

    }

    if(savedRole){

        roleSelect.value = savedRole;

    }

    if(savedEMIS){

        emisInput.value = savedEMIS;

    }

    rememberCheck.checked = true;

}

// =========================================
// Save Remember Me
// =========================================

function saveRememberMe(){

    if(rememberCheck.checked){

        localStorage.setItem("rememberMe","true");

        localStorage.setItem("savedSchool",schoolSelect.value);

        localStorage.setItem("savedRole",roleSelect.value);

        localStorage.setItem("savedEMIS",emisInput.value.trim());

    }else{

        clearRememberMe();

    }

}

// =========================================
// Clear Remember Me
// =========================================

function clearRememberMe(){

    localStorage.removeItem("rememberMe");

    localStorage.removeItem("savedSchool");

    localStorage.removeItem("savedRole");

    localStorage.removeItem("savedEMIS");

}

// =========================================
// Remember Checkbox Event
// =========================================

function bindRememberEvent(){

    rememberCheck.addEventListener("change",function(){

        if(!rememberCheck.checked){

            clearRememberMe();

        }

    });

}
/*=========================================
 Login Process Module
=========================================*/

// =========================================
// Login Button Click
// =========================================

async function loginUser(){

    clearMessage();

    // Validate Form

    if(!validateForm()){

        return;

    }

    // Loading Start

    showLoading();

    try{

        // Save Remember Me Data

        saveRememberMe();

        // Small Delay (UI Smooth)

        await delay(800);

        // Next Step

        await processLogin();

    }
    catch(error){

        console.error(error);

        showMessage(
            "Unexpected error occurred."
        );

        hideLoading();

    }

}

// =========================================
// Process Login
// =========================================

async function processLogin(){

    try{

        const q = query(
            collection(db,"users"),
            where("emis","==",emisInput.value.trim())
        );

        const snapshot = await getDocs(q);

        if(snapshot.empty){

            hideLoading();

            showMessage("EMIS Number not found.");

            return;

        }

        const user = snapshot.docs[0].data();

        if(user.password !== passwordInput.value.trim()){

            hideLoading();

            showMessage("Incorrect Password.");

            return;

        }

        if(user.role !== roleSelect.value){

            hideLoading();

            showMessage("Wrong Login Role.");

            return;

        }

        if(user.active === false){

            hideLoading();

            showMessage("User account disabled.");

            return;

        }

        loginSuccess(user);

    }
    catch(error){

        console.error(error);

        hideLoading();

        showMessage("Login Failed.");

    }

}
/*=========================================
 Login Success
=========================================*/

function loginSuccess(user){

    // Session Save

    sessionStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    // Success Message

    showMessage(
        "Login Successful.",
        "success"
    );

    // Stop Loading

    hideLoading();

    // Dashboard Redirect

    setTimeout(function(){

        redirectDashboard(user.role);

    },1000);

}
/*=========================================
 Dashboard Redirect
=========================================*/

function redirectDashboard(role){

    switch(role){

        case "Student":

            window.location.href="student.html";
            break;

        case "Parent":

            window.location.href="parent.html";
            break;

        case "Teacher":

            window.location.href="teacher.html";
            break;

        case "Headmaster":

            window.location.href="headmaster.html";
            break;

        case "Admin":

            window.location.href="admin.html";
            break;

        default:

            showMessage("Invalid User Role.");

    }

}
// =========================================
// Delay Function
// =========================================

function delay(ms){

    return new Promise(resolve=>{

        setTimeout(resolve,ms);

    });

}
