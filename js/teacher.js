import { auth, db } from "../firebase.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
doc,
getDoc,
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// =====================================
// Elements
// =====================================

const teacherName = document.getElementById("teacherName");
const teacherRole = document.getElementById("teacherRole");

const attendanceCount = document.getElementById("attendanceCount");
const homeworkCount = document.getElementById("homeworkCount");
const noticeCount = document.getElementById("noticeCount");
const leaveCount = document.getElementById("leaveCount");

const leaveMenu = document.getElementById("leaveMenu");
const leaveCard = document.getElementById("leaveCard");

const logoutBtn = document.getElementById("logoutBtn");

let currentTeacher = null;

// =====================================
// Load Teacher Profile
// =====================================

async function loadTeacher(){

const teacherDocId = localStorage.getItem("teacherId");

if(!teacherDocId){

alert("Teacher session expired.");

location.href = "login.html";

return;

}

const teacherRef = doc(db,"teachers",teacherId);

const teacherSnap = await getDoc(teacherRef);

if(!teacherSnap.exists()){

alert("Teacher record not found.");

location.href = "login.html";

return;

}

currentTeacher = teacherSnap.data();

teacherName.textContent = currentTeacher.name || "Teacher";

teacherRole.textContent = currentTeacher.teacherType || "Teacher";

// Subject Teacher cannot approve leave

if(currentTeacher.teacherType === "Subject Teacher"){

leaveMenu.style.display = "none";

leaveCard.style.display = "none";

}

}
// =====================================
// Dashboard Counts
// =====================================

async function loadDashboard(){

// ===============================
// Homework Count
// ===============================

const homeworkSnap =
await getDocs(collection(db,"homework"));

homeworkCount.textContent = homeworkSnap.size;

// ===============================
// Notice Count
// ===============================

const noticeSnap =
await getDocs(collection(db,"notices"));

noticeCount.textContent = noticeSnap.size;

// ===============================
// Attendance Count
// (Temporary - Later connect Attendance Module)
// ===============================

attendanceCount.textContent = "Today";

// ===============================
// Leave Count
// ===============================

if(currentTeacher.teacherType === "Class Teacher"){

const leaveQuery = query(
collection(db,"leave_requests"),
where("status","==","Pending")
);

const leaveSnap = await getDocs(leaveQuery);

let pending = 0;

leaveSnap.forEach((doc)=>{

const leave = doc.data();

if(
leave.class === currentTeacher.className &&
leave.section === currentTeacher.section
){

pending++;

}

});

leaveCount.textContent = pending;

}else{

leaveCount.textContent = "-";

}

}
// =====================================
// Initialize Dashboard
// =====================================

async function initializeDashboard(){

try{

await loadTeacher();

await loadDashboard();

console.log("Teacher Dashboard Loaded Successfully");

}catch(error){

console.error(error);

alert("Failed to load Teacher Dashboard.");

location.href="login.html";

}

}

// =====================================
// Auto Refresh
// =====================================

// Refresh dashboard every 60 seconds

setInterval(async()=>{

try{

await loadDashboard();

}catch(error){

console.log("Dashboard refresh failed",error);

}

},60000);
// =====================================
// Logout
// =====================================

logoutBtn.addEventListener("click", async ()=>{

const ok = confirm("Are you sure you want to logout?");

if(!ok) return;

try{

await signOut(auth);

}catch(error){

console.log(error);

}

// Clear Session

localStorage.removeItem("teacherId");
localStorage.removeItem("teacherId");
localStorage.removeItem("teacherName");
localStorage.removeItem("teacherType");
localStorage.removeItem("teacherClass");
localStorage.removeItem("teacherSection");
localStorage.removeItem("userRole");

sessionStorage.clear();

location.href="index.html";

});

// =====================================
// Session Validation
// =====================================

if(!localStorage.getItem("teacherId")){

alert("Session Expired. Please login again.");

location.href="index.html";

}
// =====================================
// Initialize Application
// =====================================

initializeDashboard();

// =====================================
// Version Information
// =====================================

console.log("================================");
console.log("School Connect TN");
console.log("Teacher Dashboard V2");
console.log("Status : Production Ready");
console.log("================================");

// =====================================
// Global Error Handler
// =====================================

window.addEventListener("error",(event)=>{

console.error("Global Error :",event.error);

});

window.addEventListener("unhandledrejection",(event)=>{

console.error("Unhandled Promise :",event.reason);

});
