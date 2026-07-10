import { db, auth } from "../firebase.js";

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// ===============================
// Dashboard Elements
// ===============================

const studentCount =
document.getElementById("studentCount");

const teacherCount =
document.getElementById("teacherCount");

const attendanceCount =
document.getElementById("attendanceCount");

const leaveCount =
document.getElementById("leaveCount");

const noticeCount =
document.getElementById("noticeCount");

const passPercentage =
document.getElementById("passPercentage");

const failPercentage =
document.getElementById("failPercentage");

const classCount =
document.getElementById("classCount");

const logoutBtn =
document.getElementById("logoutBtn");

// ===============================
// Dashboard Loader
// ===============================

async function loadDashboard(){

try{

studentCount.textContent="...";

teacherCount.textContent="...";

attendanceCount.textContent="...";

leaveCount.textContent="...";

noticeCount.textContent="...";

passPercentage.textContent="...";

failPercentage.textContent="...";

classCount.textContent="5";
  // ===============================
// Student Count
// ===============================

const studentSnap = await getDocs(collection(db,"students"));
studentCount.textContent = studentSnap.size;

// ===============================
// Teacher Count (Active Only)
// ===============================

const teacherSnap = await getDocs(collection(db,"teachers"));

let activeTeachers = 0;

teacherSnap.forEach((doc)=>{

const teacher = doc.data();

if(teacher.status==="Active"){

activeTeachers++;

}

});

teacherCount.textContent = activeTeachers;

// ===============================
// Pending Leave Count
// ===============================

const leaveSnap = await getDocs(

query(

collection(db,"leave_requests"),

where("status","==","Pending")

)

);

leaveCount.textContent = leaveSnap.size;

// ===============================
// Notice Count
// ===============================

const noticeSnap = await getDocs(collection(db,"notices"));

noticeCount.textContent = noticeSnap.size;

// ===============================
// Homework Count
// ===============================

const homeworkSnap = await getDocs(collection(db,"homework"));

document.getElementById("homeworkCount")?.textContent = homeworkSnap.size;

// ===============================
// Attendance (Temporary)
// ===============================

attendanceCount.textContent = "95%";
  // ===============================
// Pass / Fail Analytics
// ===============================

try{

const marksSnap = await getDocs(collection(db,"marks"));

let totalStudents = 0;
let passedStudents = 0;

marksSnap.forEach((doc)=>{

const mark = doc.data();

totalStudents++;

if(Number(mark.total || 0) >= 175){

passedStudents++;

}

});

if(totalStudents > 0){

const pass = Math.round((passedStudents/totalStudents)*100);

passPercentage.textContent = pass + "%";

failPercentage.textContent = (100-pass) + "%";

}else{

passPercentage.textContent = "0%";

failPercentage.textContent = "0%";

}

}catch(error){

console.log("Marks analytics not available",error);

passPercentage.textContent = "--";

failPercentage.textContent = "--";

}

// ===============================
// Dashboard Loaded
// ===============================

console.log("Headmaster Dashboard Loaded Successfully");

}catch(error){

console.error(error);

alert("Dashboard loading failed.");

studentCount.textContent="-";
teacherCount.textContent="-";
attendanceCount.textContent="-";
leaveCount.textContent="-";
noticeCount.textContent="-";
passPercentage.textContent="-";
failPercentage.textContent="-";

}

}
// ===============================
// Logout
// ===============================

logoutBtn.addEventListener("click", async ()=>{

const ok = confirm("Are you sure you want to logout?");

if(!ok) return;

try{

await signOut(auth);

}catch(error){

console.error(error);

}

location.href="index.html";

});

// ===============================
// Auto Refresh Dashboard
// ===============================

// Refresh every 60 seconds

setInterval(()=>{

loadDashboard();

},60000);

// ===============================
// Initialize Dashboard
// ===============================

loadDashboard();

// ===============================
// Version
// ===============================

console.log("School Connect TN");
console.log("Headmaster Dashboard V2 Loaded");
