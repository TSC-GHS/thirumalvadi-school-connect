//====================================================
// School Connect TN
// Headmaster Dashboard V1
//====================================================

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

//====================================================
// Dashboard Elements
//====================================================

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

const homeworkPercentage =
document.getElementById("homeworkPercentage");

const logoutBtn =
document.getElementById("logoutBtn");

//====================================================
// Dashboard Loader
//====================================================

async function loadDashboard(){

try{

showLoading();

await loadStudents();

await loadTeachers();

await loadTeacherLeaves();

await loadNotices();

await loadHomework();

await loadAttendance();

await loadResults();

console.log("Dashboard Loaded Successfully");

}catch(error){

console.error(error);

alert("Dashboard Loading Failed");

showError();

}

}

//====================================================
// Loading State
//====================================================

function showLoading(){

studentCount.textContent="...";

teacherCount.textContent="...";

attendanceCount.textContent="...";

leaveCount.textContent="...";

noticeCount.textContent="...";

passPercentage.textContent="...";

failPercentage.textContent="...";

if(homeworkPercentage){

homeworkPercentage.textContent="...";

}

}

//====================================================
// Error State
//====================================================

function showError(){

studentCount.textContent="-";

teacherCount.textContent="-";

attendanceCount.textContent="-";

leaveCount.textContent="-";

noticeCount.textContent="-";

passPercentage.textContent="-";

failPercentage.textContent="-";

if(homeworkPercentage){

homeworkPercentage.textContent="-";

}

}

//====================================================
// Student Count
//====================================================

async function loadStudents(){

const snap =
await getDocs(collection(db,"students"));

let total=0;

snap.forEach((doc)=>{

const student=doc.data();

if(student.status!=="TC"){

total++;

}

});

studentCount.textContent=total;

}

//====================================================
// Teacher Count
//====================================================

async function loadTeachers(){

const snap =
await getDocs(collection(db,"teachers"));

let total=0;

snap.forEach((doc)=>{

const teacher=doc.data();

if(teacher.status==="Active"){

total++;

}

});

teacherCount.textContent=total;

}
//====================================================
// Pending Teacher Leave
//====================================================

async function loadTeacherLeaves(){

try{

const snap = await getDocs(
query(
collection(db,"teacherLeaves"),
where("status","==","Pending")
)
);

leaveCount.textContent = snap.size;

}catch(error){

console.error(error);

leaveCount.textContent="0";

}

}

//====================================================
// Notice Count
//====================================================

async function loadNotices(){

try{

const snap =
await getDocs(collection(db,"notices"));

noticeCount.textContent =
snap.size;

}catch(error){

console.error(error);

noticeCount.textContent="0";

}

}

//====================================================
// Homework Analytics
//====================================================

async function loadHomework(){

try{

const snap =
await getDocs(collection(db,"homework"));

const totalHomework = snap.size;

if(totalHomework===0){

homeworkPercentage.textContent="0%";

return;

}

// V1 Placeholder
homeworkPercentage.textContent="100%";

}catch(error){

console.error(error);

homeworkPercentage.textContent="0%";

}

}

//====================================================
// Attendance Analytics
//====================================================

async function loadAttendance(){

try{

// V1 Placeholder

attendanceCount.textContent="95%";

}catch(error){

attendanceCount.textContent="0%";

}

}

//====================================================
// Result Analytics
//====================================================

async function loadResults(){

try{

const snap = await getDocs(
collection(db,"marks","Half Yearly","students")
);

let total=0;

let pass=0;

snap.forEach((doc)=>{

const data=doc.data();

total++;

if((data.result||"").toUpperCase()==="PASS"){

pass++;

}

});

if(total===0){

passPercentage.textContent="0%";

failPercentage.textContent="0%";

return;

}

const passPer =
Math.round((pass/total)*100);

passPercentage.textContent=
passPer+"%";

failPercentage.textContent=
(100-passPer)+"%";

}catch(error){

console.error(error);

passPercentage.textContent="0%";

failPercentage.textContent="0%";

}

}

//====================================================
// Logout
//====================================================

logoutBtn.addEventListener("click",async()=>{

const ok=confirm("Are you sure you want to logout?");

if(!ok)return;

try{

await signOut(auth);

location.href="index.html";

}catch(error){

console.error(error);

alert("Logout Failed");

}

});

//====================================================
// Auto Refresh
//====================================================

setInterval(()=>{

loadDashboard();

},60000);

//====================================================
// Initialize
//====================================================

loadDashboard();

console.log("================================");
console.log("School Connect TN");
console.log("Headmaster Dashboard V1");
console.log("================================");
