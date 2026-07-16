//==================================================
// School Connect TN
// Admin Dashboard V3
// Part 1
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
// Session Check
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

document.getElementById("studentCount").textContent =
students.size;

const teachers =
await getDocs(collection(db,"teachers"));

document.getElementById("teacherCount").textContent =
teachers.size;

const notices =
await getDocs(collection(db,"notices"));

document.getElementById("noticeCount").textContent =
notices.size;
const attendance =
"100%";

document.getElementById("attendanceCount").textContent =
attendance;

}catch(error){

console.error("Dashboard Error :",error);

}

}

//==================================================
// Logout
//==================================================

window.logoutAdmin = async function(){

try{

await signOut(auth);

localStorage.clear();

sessionStorage.clear();

window.location.href="login.html";

}catch(error){

console.error(error);

alert("Logout Failed");

}

};

//==================================================
// Load Dashboard
//==================================================

loadDashboard();
