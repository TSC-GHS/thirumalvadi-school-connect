/*==================================================
School Connect TN
Admin Dashboard V3
JavaScript - Part 1
==================================================*/

import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

/*====================================
ELEMENTS
====================================*/

const totalStudents =
document.getElementById("totalStudents");

const totalTeachers =
document.getElementById("totalTeachers");

const todayAttendance =
document.getElementById("todayAttendance");

const totalNotices =
document.getElementById("totalNotices");

/*====================================
LOAD DASHBOARD
====================================*/

async function loadDashboard(){

try{

/* Students */

const studentSnap =
await getDocs(
collection(db,"students")
);

totalStudents.innerHTML =
studentSnap.size;

/* Teachers */

const teacherSnap =
await getDocs(
collection(db,"teachers")
);

totalTeachers.innerHTML =
teacherSnap.size;

/* Notices */

const noticeSnap =
await getDocs(
collection(db,"notices")
);

totalNotices.innerHTML =
noticeSnap.size;
/*====================================
TODAY ATTENDANCE
====================================*/

const today =
new Date().toISOString().split("T")[0];

try{

const attendanceSnap =
await getDocs(
collection(db,"attendance",today,"students")
);

const totalAttendance =
attendanceSnap.size;

const totalStudentCount =
studentSnap.size;

const attendancePercent =
totalStudentCount > 0
? ((totalAttendance / totalStudentCount) * 100).toFixed(1)
: "0";

todayAttendance.innerHTML =
attendancePercent + "%";

}catch(error){

todayAttendance.innerHTML = "--";

}

}catch(error){

console.error(error);

alert(error.message);

}

}

/*====================================
WELCOME MESSAGE
====================================*/

const hour =
new Date().getHours();

let greeting =
"Welcome";

if(hour < 12){

greeting =
"🌅 Good Morning";

}else if(hour < 17){

greeting =
"☀️ Good Afternoon";

}else{

greeting =
"🌙 Good Evening";

}

console.log(greeting);

/*====================================
LOGOUT
====================================*/

window.logoutAdmin=function(){

if(confirm("Do you want to logout?")){

localStorage.clear();

sessionStorage.clear();

location.href="index.html";

}

};

/*====================================
START
====================================*/

loadDashboard();

console.log(
"Admin Dashboard V3 Loaded Successfully"
);
