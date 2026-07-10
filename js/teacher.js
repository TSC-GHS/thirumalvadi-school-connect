import { auth, db } from "../firebase.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const teacherName=document.getElementById("teacherName");
const teacherRole=document.getElementById("teacherRole");

const attendanceCount=document.getElementById("attendanceCount");
const homeworkCount=document.getElementById("homeworkCount");
const noticeCount=document.getElementById("noticeCount");
const leaveCount=document.getElementById("leaveCount");

const leaveMenu=document.getElementById("leaveMenu");
const leaveCard=document.getElementById("leaveCard");

const logoutBtn=document.getElementById("logoutBtn");

let currentTeacher=null;

async function loadTeacher(){

const teacherId=
localStorage.getItem("teacherId");

if(!teacherId){

location.href="login.html";

return;

}

const teacherRef=
doc(db,"teachers",teacherId);

const teacherSnap=
await getDoc(teacherRef);

if(!teacherSnap.exists()){

alert("Teacher not found");

location.href="login.html";

return;

}

currentTeacher=teacherSnap.data();

teacherName.innerText=currentTeacher.name;

teacherRole.innerText=currentTeacher.teacherType;
// ===============================
// Role Permission
// ===============================

if(currentTeacher.teacherType==="Subject Teacher"){

leaveMenu.style.display="none";

leaveCard.style.display="none";

}

loadDashboard();

}

// ===============================
// Dashboard Counts
// ===============================

async function loadDashboard(){

// Homework Count

const homeworkSnap=
await getDocs(collection(db,"homework"));

homeworkCount.innerText=homeworkSnap.size;

// Notice Count

const noticeSnap=
await getDocs(collection(db,"notices"));

noticeCount.innerText=noticeSnap.size;

// Leave Count

if(currentTeacher.teacherType==="Class Teacher"){

const leaveSnap=
await getDocs(collection(db,"leave_requests"));

let pending=0;

leaveSnap.forEach((doc)=>{

const leave=doc.data();

if(

leave.status==="Pending" &&
leave.class===currentTeacher.class &&
leave.section===currentTeacher.section

){

pending++;

}

});

leaveCount.innerText=pending;

}else{

leaveCount.innerText="-";

}

// Attendance Count

attendanceCount.innerText="Today";

}
// ===============================
// Logout
// ===============================

logoutBtn.addEventListener("click", async ()=>{

const ok = confirm("Are you sure you want to logout?");

if(!ok) return;

localStorage.removeItem("teacherId");

try{

await signOut(auth);

}catch(e){

console.log(e);

}

location.href="login.html";

});

// ===============================
// Initialize Dashboard
// ===============================

try{

await loadTeacher();

}catch(error){

console.error(error);

alert("Failed to load Teacher Dashboard.");

location.href="login.html";

}
