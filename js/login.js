//==================================================
// School Connect TN
// Login Module
// Developed by VTOOS Software Solutions
// Production Stable Version
//==================================================

import { db } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


//==================================================
// DOM Ready
//==================================================

document.addEventListener(
    "DOMContentLoaded",
    initLogin
);


//==================================================
// Global Variables
//==================================================

let schoolSelect;
let roleSelect;
let emisInput;
let passwordInput;
let rememberCheck;
let loginButton;
let messageBox;
let togglePasswordBtn;


//==================================================
// Initialize Login
//==================================================

function initLogin() {

    initializeElements();

    bindEvents();

    loadRememberMe();

    bindRememberEvent();

}


//==================================================
// Initialize Elements
//==================================================

function initializeElements() {

    schoolSelect =
        document.getElementById("school");

    roleSelect =
        document.getElementById("role");

    emisInput =
        document.getElementById("email");

    passwordInput =
        document.getElementById("password");

    rememberCheck =
        document.getElementById("remember");

    loginButton =
        document.querySelector(".loginBtn");

    messageBox =
        document.getElementById("msg");

    togglePasswordBtn =
        document.getElementById("togglePassword");

}


//==================================================
// Bind Events
//==================================================

function bindEvents() {

    if (togglePasswordBtn) {

        togglePasswordBtn.addEventListener(
            "click",
            togglePassword
        );

    }


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            loginUser
        );

    }

}


//==================================================
// Password Show / Hide
//==================================================

function togglePassword() {

    if (
        passwordInput.type === "password"
    ) {

        passwordInput.type = "text";

        togglePasswordBtn.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    }

    else {

        passwordInput.type = "password";

        togglePasswordBtn.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

}


//==================================================
// Loading Button
//==================================================

function showLoading() {

    loginButton.disabled = true;

    loginButton.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';

}


function hideLoading() {

    loginButton.disabled = false;

    loginButton.innerHTML =
        "🚀 LOGIN TO DASHBOARD";

}


//==================================================
// Message Helper
//==================================================

function showMessage(
    text,
    type = "error"
) {

    if (!messageBox) return;

    messageBox.innerHTML = text;

    messageBox.className = type;

}


function clearMessage() {

    if (!messageBox) return;

    messageBox.innerHTML = "";

    messageBox.className = "";

}


//==================================================
// Login Validation
//==================================================

function validateLogin() {

    clearMessage();


    const school =
        schoolSelect.value.trim();

    const role =
        roleSelect.value.trim();

    const emis =
        emisInput.value.trim();

    const password =
        passwordInput.value.trim();


    //==================================================
    // School
    //==================================================

    if (school === "") {

        showMessage(
            "Please select your school."
        );

        schoolSelect.focus();

        return false;

    }


    //==================================================
    // Role
    //==================================================

    if (role === "") {

        showMessage(
            "Please select login role."
        );

        roleSelect.focus();

        return false;

    }


    //==================================================
    // Username / EMIS
    //==================================================

    if (emis === "") {

        showMessage(
            "Please enter EMIS Number / Username."
        );

        emisInput.focus();

        return false;

    }


    //==================================================
    // Password
    //==================================================

    if (password === "") {

        showMessage(
            "Please enter password."
        );

        passwordInput.focus();

        return false;

    }


    return true;

}


//==================================================
// EMIS / Username Validation
//==================================================

function validateEMIS(emis) {

    const role =
        roleSelect.value;


    //==================================================
    // Teacher
    //==================================================

    if (role === "Teacher") {

        if (emis.length < 4) {

            showMessage(
                "Invalid Teacher ID."
            );

            emisInput.focus();

            return false;

        }

        return true;

    }


    //==================================================
    // Admin / Headmaster
    //==================================================

    if (
        role === "Admin" ||
        role === "Headmaster"
    ) {

        if (emis.length < 4) {

            showMessage(
                "Invalid Username / Email."
            );

            emisInput.focus();

            return false;

        }

        return true;

    }


    //==================================================
    // Parent / Student
    //==================================================

    if (emis.length < 6) {

        showMessage(
            "Invalid EMIS Number."
        );

        emisInput.focus();

        return false;

    }


    return true;

}


//==================================================
// Password Validation
//==================================================

function validatePassword(password) {

    if (password.length < 4) {

        showMessage(
            "Password is too short."
        );

        passwordInput.focus();

        return false;

    }


    return true;

}


//==================================================
// Complete Form Validation
//==================================================

function validateForm() {

    if (!validateLogin()) {

        return false;

    }


    if (
        !validateEMIS(
            emisInput.value.trim()
        )
    ) {

        return false;

    }


    if (
        !validatePassword(
            passwordInput.value.trim()
        )
    ) {

        return false;

    }


    return true;

}


//==================================================
// Remember Me
//==================================================

function loadRememberMe() {

    const remember =
        localStorage.getItem(
            "rememberMe"
        );


    if (remember !== "true") {

        return;

    }


    const savedSchool =
        localStorage.getItem(
            "savedSchool"
        );

    const savedRole =
        localStorage.getItem(
            "savedRole"
        );

    const savedEMIS =
        localStorage.getItem(
            "savedEMIS"
        );


    if (savedSchool) {

        schoolSelect.value =
            savedSchool;

    }


    if (savedRole) {

        roleSelect.value =
            savedRole;

    }


    if (savedEMIS) {

        emisInput.value =
            savedEMIS;

    }


    rememberCheck.checked = true;

}


//==================================================
// Save Remember Me
//==================================================

function saveRememberMe() {

    if (rememberCheck.checked) {

        localStorage.setItem(
            "rememberMe",
            "true"
        );

        localStorage.setItem(
            "savedSchool",
            schoolSelect.value
        );

        localStorage.setItem(
            "savedRole",
            roleSelect.value
        );

        localStorage.setItem(
            "savedEMIS",
            emisInput.value.trim()
        );

    }

    else {

        clearRememberMe();

    }

}


//==================================================
// Clear Remember Me
//==================================================

function clearRememberMe() {

    localStorage.removeItem(
        "rememberMe"
    );

    localStorage.removeItem(
        "savedSchool"
    );

    localStorage.removeItem(
        "savedRole"
    );

    localStorage.removeItem(
        "savedEMIS"
    );

}


//==================================================
// Remember Checkbox
//==================================================

function bindRememberEvent() {

    if (!rememberCheck) {

        return;

    }


    rememberCheck.addEventListener(
        "change",
        function () {

            if (!rememberCheck.checked) {

                clearRememberMe();

            }

        }
    );

}


//==================================================
// LOGIN
//==================================================

async function loginUser() {

    clearMessage();


    if (!validateForm()) {

        return;

    }


    showLoading();


    try {

        saveRememberMe();

        await delay(500);

        await processLogin();

    }

    catch (error) {

        console.error(
            "Login Error:",
            error
        );

        hideLoading();

        showMessage(
            "Unexpected error occurred."
        );

    }

}


//==================================================
// PROCESS LOGIN
//==================================================

async function processLogin() {

    try {

        const loginId =
            emisInput.value.trim();

        const password =
            passwordInput.value.trim();

        const role =
            roleSelect.value;


        let q;


        //================================================
        // Student / Parent
        //================================================

        if (
            role === "Student" ||
            role === "Parent"
        ) {

            q = query(

                collection(
                    db,
                    "users"
                ),

                where(
                    "emis",
                    "==",
                    loginId
                )

            );

        }


        //================================================
        // Teacher
        //================================================

        else if (
            role === "Teacher"
        ) {

            q = query(

                collection(
                    db,
                    "teachers"
                ),

                where(
                    "id",
                    "==",
                    loginId
                )

            );

        }


        //================================================
        // Admin / Headmaster
        //================================================

        else if (
            role === "Admin" ||
            role === "Headmaster"
        ) {

            q = query(

                collection(
                    db,
                    "users"
                ),

                where(
                    "email",
                    "==",
                    loginId
                )

            );

        }


        //================================================
        // Firestore Search
        //================================================

        const snapshot =
            await getDocs(q);


        console.log(
            "Login Role:",
            role
        );

        console.log(
            "Login ID:",
            loginId
        );

        console.log(
            "Matched Users:",
            snapshot.size
        );


        //================================================
        // User Not Found
        //================================================

        if (snapshot.empty) {

            hideLoading();

            showMessage(
                "User not found."
            );

            return;

        }


        //================================================
        // Get User
        //================================================

        const user =
            snapshot.docs[0].data();


        console.log(
            "User Data:",
            user
        );


        //================================================
        // Password
        //================================================

        if (
            user.password !== password
        ) {

            hideLoading();

            showMessage(
                "Incorrect Password."
            );

            return;

        }


        //================================================
        // Role
        //================================================

        if (
            user.role !== role
        ) {

            hideLoading();

            showMessage(
                "Wrong Login Role."
            );

            return;

        }


        //================================================
        // Active Status
        //================================================

        if (
            user.active === false
        ) {

            hideLoading();

            showMessage(
                "User account disabled."
            );

            return;

        }


        //================================================
        // LOGIN SUCCESS
        //================================================

        loginSuccess(
            user,
            snapshot.docs[0].id
        );

    }

    catch (error) {

        console.error(
            "Process Login Error:",
            error
        );

        hideLoading();

        showMessage(
            error.message ||
            "Login Failed."
        );

    }

}


//==================================================
// LOGIN SUCCESS
//==================================================

function loginSuccess(
    user,
    documentId
) {

    const role =
        user.role;


    //================================================
    // IMPORTANT SESSION DATA
    //================================================

    // Common User
    sessionStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    //================================================
    // Common Role
    //================================================

    localStorage.setItem(
        "userRole",
        role
    );

    sessionStorage.setItem(
        "userRole",
        role
    );


    //================================================
    // Store User ID
    //================================================

    if (user.id) {

        localStorage.setItem(
            "userId",
            user.id
        );

        sessionStorage.setItem(
            "userId",
            user.id
        );

    }


    //================================================
    // Firestore Document ID
    //================================================

    if (documentId) {

        localStorage.setItem(
            "userDocId",
            documentId
        );

        sessionStorage.setItem(
            "userDocId",
            documentId
        );

    }


    //================================================
    // Teacher Session
    //================================================

    if (role === "Teacher") {

        const teacherId =
            user.id ||
            user.teacherId;


        if (teacherId) {

            localStorage.setItem(
                "teacherId",
                teacherId
            );

            sessionStorage.setItem(
                "teacherId",
                teacherId
            );

        }


        if (user.name) {

            localStorage.setItem(
                "teacherName",
                user.name
            );

            sessionStorage.setItem(
                "teacherName",
                user.name
            );

        }


        localStorage.setItem(
            "userRole",
            "Teacher"
        );

        sessionStorage.setItem(
            "userRole",
            "Teacher"
        );

    }


    //================================================
    // Student / Parent Session
    //================================================

    if (
        role === "Student" ||
        role === "Parent"
    ) {

        if (user.emis) {

            //================================================
            // Common EMIS
            //================================================

            localStorage.setItem(
                "emis",
                user.emis
            );

            sessionStorage.setItem(
                "emis",
                user.emis
            );


            //================================================
            // Parent Session
            // IMPORTANT FIX
            //================================================

            if (role === "Parent") {

                localStorage.setItem(
                    "parentEMIS",
                    user.emis
                );

                sessionStorage.setItem(
                    "parentEMIS",
                    user.emis
                );

                console.log(
                    "Parent EMIS Session Saved:",
                    user.emis
                );

            }


            //================================================
            // Student Session
            //================================================

            if (role === "Student") {

                localStorage.setItem(
                    "studentEMIS",
                    user.emis
                );

                sessionStorage.setItem(
                    "studentEMIS",
                    user.emis
                );

                console.log(
                    "Student EMIS Session Saved:",
                    user.emis
                );

            }

        }

    }


    //================================================
    // Headmaster
    //================================================

    if (
        role === "Headmaster"
    ) {

        localStorage.setItem(
            "userRole",
            "Headmaster"
        );

        sessionStorage.setItem(
            "userRole",
            "Headmaster"
        );

    }


    //================================================
    // Admin
    //================================================

    if (
        role === "Admin"
    ) {

        localStorage.setItem(
            "userRole",
            "Admin"
        );

        sessionStorage.setItem(
            "userRole",
            "Admin"
        );


        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        sessionStorage.setItem(
            "adminLoggedIn",
            "true"
        );

    }


    //================================================
    // Success Message
    //================================================

    showMessage(
        "Login Successful.",
        "success"
    );


    hideLoading();


    //================================================
    // Redirect
    //================================================

    setTimeout(
        function () {

            redirectDashboard(
                role
            );

        },
        700
    );

}


//==================================================
// DASHBOARD REDIRECT
//==================================================

function redirectDashboard(role) {

    console.log(
        "Redirecting Role:",
        role
    );


    switch (role) {


        //==========================================
        // Student
        //==========================================

        case "Student":

            window.location.href =
                "student.html";

            break;


        //==========================================
        // Parent
        //==========================================

        case "Parent":

            window.location.href =
                "parent.html";

            break;


        //==========================================
        // Teacher
        //==========================================

        case "Teacher":

            window.location.href =
                "teacher.html";

            break;


        //==========================================
        // Headmaster
        //==========================================

        case "Headmaster":

            window.location.href =
                "headmaster.html";

            break;


        //==========================================
        // ADMIN
        //==========================================

        case "Admin":

            window.location.href =
                "admin_dashboard_v3.html";

            break;


        //==========================================
        // Invalid
        //==========================================

        default:

            console.error(
                "Invalid Role:",
                role
            );

            showMessage(
                "Invalid User Role."
            );

    }

}


//==================================================
// DELAY
//==================================================

function delay(ms) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                ms
            );

        }
    );

}


//==================================================
// VERSION
//==================================================

console.log(
    "===================================="
);

console.log(
    "School Connect TN"
);

console.log(
    "Login Module"
);

console.log(
    "Production Stable Version"
);

console.log(
    "Firebase Connected"
);

console.log(
    "Parent Session Fix Applied"
);

console.log(
    "Admin Session Fix Applied"
);

console.log(
    "===================================="
);
