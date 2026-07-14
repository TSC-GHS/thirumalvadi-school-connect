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
// School Connect TN
// Teacher Dashboard V5
// =====================================

// Elements

const teacherName =
document.getElementById("teacherName");

const teacherRole =
document.getElementById("teacherRole");

const attendanceCount =
document.getElementById("attendanceCount");

const homeworkCount =
document.getElementById("homeworkCount");

const noticeCount =
document.getElementById("noticeCount");

const leaveCount =
document.getElementById("leaveCount");

const leaveMenu =
document.getElementById("leaveMenu");

const leaveCard =
document.getElementById("leaveCard");

const logoutBtn =
document.getElementById("logoutBtn");

let currentTeacher = null;

// =====================================
// Load Teacher Profile
// =====================================

async function loadTeacher() {

const teacherId =
localStorage.getItem("teacherId") ||
sessionStorage.getItem("teacherId");

if(!teacherId){

alert("Session Expired");

location.href="index.html";

return false;

}

try{

const teacherRef =
doc(db,"teachers",teacherId);

const teacherSnap =
await getDoc(teacherRef);

if(!teacherSnap.exists()){

alert("Teacher Profile Not Found");

location.href="index.html";

return false;

}

currentTeacher =
teacherSnap.data();

teacherName.textContent =
currentTeacher.name ?? "Teacher";

teacherRole.textContent =
currentTeacher.teacherType ?? "Teacher";

if(currentTeacher.teacherType==="Subject Teacher"){

leaveMenu.style.display="none";

leaveCard.style.display="none";

}

return true;

}catch(error){

console.error(error);

alert("Unable to load Teacher Profile");

return false;

}

}
// =====================================
// Dashboard Counts
// =====================================

async function loadDashboard() {

try{

// ==============================
// Homework Count
// ==============================

const homeworkSnap =
await getDocs(collection(db,"homework"));

homeworkCount.textContent =
homeworkSnap.size;

// ==============================
// Notice Count
// ==============================

const noticeSnap =
await getDocs(collection(db,"notices"));

noticeCount.textContent =
noticeSnap.size;

// ==============================
// Today's Attendance Count
// ==============================

const today = new Date().toISOString().split("T")[0];

const attendanceSnap = await getDocs(
    query(
        collection(db, "attendance"),
        where("date", "==", today)
    )
);

attendanceCount.textContent = attendanceSnap.size;

// ==============================
// Leave Count
// ==============================

if(currentTeacher.teacherType==="Class Teacher"){

const leaveSnap =
await getDocs(

query(

collection(db,"leave_requests"),

where("status","==","Pending")

)

);

let pending=0;

leaveSnap.forEach((doc)=>{

const leave=doc.data();

// assignedClasses support
if(Array.isArray(currentTeacher.assignedClasses)){

if(currentTeacher.assignedClasses.includes(leave.class)){

pending++;

}

}else{

if(

leave.class===currentTeacher.className &&

leave.section===currentTeacher.section

){

pending++;

}

}

});

leaveCount.textContent=pending;

}else{

leaveCount.textContent="-";

}

}catch(error){

console.error(error);

homeworkCount.textContent="-";
noticeCount.textContent="-";
attendanceCount.textContent="-";
leaveCount.textContent="-";

}

}

// =====================================
// Initialize Dashboard
// =====================================

async function initializeDashboard(){

const loaded=

await loadTeacher();

if(!loaded) return;

await loadDashboard();

console.log("Teacher Dashboard Loaded");

}
// =====================================
// Auto Refresh Dashboard
// =====================================

setInterval(async()=>{

try{

if(currentTeacher){

await loadDashboard();

}

}catch(error){

console.log("Dashboard Refresh Failed",error);

}

},60000);

// =====================================
// Logout
// =====================================

logoutBtn.addEventListener("click",async()=>{

const ok=confirm("Are you sure you want to logout?");

if(!ok) return;

try{

await signOut(auth);

}catch(error){

console.log(error);

}

localStorage.removeItem("teacherId");
localStorage.removeItem("teacherName");
localStorage.removeItem("userRole");

sessionStorage.removeItem("teacherId");
sessionStorage.removeItem("teacherName");
sessionStorage.removeItem("userRole");

location.href="index.html";

});
// =====================================
// Initialize Application
// =====================================

initializeDashboard();

// =====================================
// Version Information
// =====================================

console.log("================================");
console.log("School Connect TN");
console.log("Teacher Dashboard V5");
console.log("Firebase Connected");
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
