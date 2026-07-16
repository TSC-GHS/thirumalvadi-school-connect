//==================================================
// School Connect TN
// Admin Dashboard V3
//==================================================

import { db, auth } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

//==================================================
// Admin Session Check
//==================================================

const role = localStorage.getItem("userRole");

if(role !== "Admin"){

window.location.href="login.html";

}

//==================================================
// Dashboard Counts
//==================================================

async function loadDashboard(){

try{

const students =
await getDocs(collection(db,"students"));

document.getElementById("totalStudents").textContent =
students.size;

const teachers =
await getDocs(collection(db,"teachers"));

document.getElementById("totalTeachers").textContent =
teachers.size;

let notices = 0;

try{

const noticeData =
await getDocs(collection(db,"notices"));

notices = noticeData.size;

}catch(e){

try{

const noticeData =
await getDocs(collection(db,"notice"));

notices = noticeData.size;

}catch(err){

notices = 0;

}

}

document.getElementById("totalNotices").textContent =
notices;
  document.getElementById("todayAttendance").textContent = "100%";

}catch(error){

console.error("Dashboard Error :", error);

alert("Unable to load dashboard data.");

}

}

//==================================================
// Logout Function
//==================================================

window.logoutAdmin = async function(){

try{

await signOut(auth);

localStorage.removeItem("userRole");

localStorage.removeItem("teacherId");
localStorage.removeItem("teacherName");

localStorage.removeItem("parentEMIS");
localStorage.removeItem("studentEMIS");

sessionStorage.clear();

window.location.href = "login.html";

}catch(error){

console.error(error);

alert("Logout Failed");

}

};

//==================================================
// Load Dashboard
//==================================================

document.addEventListener("DOMContentLoaded",()=>{

loadDashboard();

});
