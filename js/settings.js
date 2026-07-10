import { auth, db } from "../firebase.js";

import {
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// =====================================
// Elements
// =====================================

const teacherIdElement = document.getElementById("teacherId");
const teacherNameElement = document.getElementById("teacherName");
const teacherTypeElement = document.getElementById("teacherType");
const subjectElement = document.getElementById("subject");
const classNameElement = document.getElementById("className");
const sectionElement = document.getElementById("section");
const emailElement = document.getElementById("email");
const mobileElement = document.getElementById("mobile");

const logoutBtn = document.getElementById("logoutBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");

let currentTeacher = null;

// =====================================
// Load Teacher Profile
// =====================================

async function loadTeacherProfile(){

const teacherId =
localStorage.getItem("teacherId") ||
sessionStorage.getItem("teacherId");

if(!teacherId){

alert("Teacher session expired");

location.href="index.html";

return false;

}

const teacherSnap =
await getDoc(doc(db,"teachers",teacherId));

if(!teacherSnap.exists()){

alert("Teacher Record Not Found");

location.href="index.html";

return false;

}

currentTeacher = teacherSnap.data();
// =====================================
// Display Teacher Details
// =====================================

teacherIdElement.textContent =
teacherId;

teacherNameElement.textContent =
currentTeacher.name || "-";

teacherTypeElement.textContent =
currentTeacher.teacherType || "-";

subjectElement.textContent =
currentTeacher.subject || "-";

classNameElement.textContent =
currentTeacher.className || "-";

sectionElement.textContent =
currentTeacher.section || "-";

emailElement.textContent =
currentTeacher.email || "-";

mobileElement.textContent =
currentTeacher.mobile || "-";

return true;

}

// =====================================
// Change Password
// =====================================

changePasswordBtn.addEventListener(
"click",
async ()=>{

if(!auth.currentUser){

alert("Please login again.");

return;

}

try{

await sendPasswordResetEmail(

auth,

auth.currentUser.email

);

alert(
"✅ Password reset link has been sent to your registered email."
);

}catch(error){

console.error(error);

alert(error.message);

}

});
// =====================================
// Logout
// =====================================

logoutBtn.addEventListener("click", async () => {

const ok = confirm("Are you sure you want to logout?");

if(!ok) return;

try{

await signOut(auth);

}catch(error){

console.error(error);

}

localStorage.removeItem("teacherId");
sessionStorage.removeItem("teacherId");

location.href = "index.html";

});

// =====================================
// Initialize
// =====================================

async function initializeSettings(){

try{

const loaded = await loadTeacherProfile();

if(!loaded) return;

console.log("Teacher Settings Loaded Successfully");

}catch(error){

console.error(error);

alert(
"Settings Loading Failed\n\n" +
error.message
);

}

}

initializeSettings();

// =====================================
// Version
// =====================================

console.log("================================");
console.log("School Connect TN");
console.log("Teacher Settings V1");
console.log("================================");

// =====================================
// Global Error Handler
// =====================================

window.addEventListener("error",(event)=>{

console.error("Global Error:",event.error);

});

window.addEventListener("unhandledrejection",(event)=>{

console.error("Unhandled Promise:",event.reason);

});
