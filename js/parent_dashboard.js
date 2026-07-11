//============================
// School Connect TN Pro
// parent_dashboard.js
// Part 1
//============================

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
orderBy,
limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const emis = localStorage.getItem("parentEMIS");

if(!emis){

alert("Session Expired");

location.href="parent_login.html";

}

async function loadDashboard(){

try{

const studentRef = doc(db,"students",emis);

const studentSnap = await getDoc(studentRef);

if(!studentSnap.exists()){

alert("Student Not Found");

return;

}

const student = studentSnap.data();

document.getElementById("studentName").innerHTML =
student.name || "-";

document.getElementById("studentEMIS").innerHTML =
student.emis || emis;

document.getElementById("studentClass").innerHTML =
student.class || "-";

document.getElementById("studentSection").innerHTML =
student.section || "-";

document.getElementById("attendancePercent").innerHTML =
student.attendance || "0%";

if(student.photo){

document.getElementById("studentPhoto").src =
student.photo;

}

await loadHomework(student.class);

await loadNotice();

await loadMarks(emis);

}catch(err){

console.error(err);

alert(err.message);

}

}
//============================
// parent_dashboard.js
// Part 2
//============================

async function loadHomework(studentClass){

try{

const homeworkRef = collection(db,"homework");

const homeworkSnap = await getDocs(homeworkRef);

let html="";
let count=0;

homeworkSnap.forEach((d)=>{

const hw=d.data();

if(hw.class===studentClass){

count++;

html+=`

<div class="homework-item">

<div class="homework-sub">

${hw.subject || "-"}

</div>

<div>

${hw.homework || "-"}

</div>

</div>

`;

}

});

document.getElementById("homeworkCount").innerHTML=count;

document.getElementById("todayHomework").innerHTML=

count===0

? "<p>No Homework Available</p>"

: html;

}catch(error){

console.error(error);

document.getElementById("todayHomework").innerHTML=

"<p>Unable to Load Homework</p>";

}

}

async function loadNotice(){

try{

const q=query(

collection(db,"notice"),

orderBy("createdAt","desc"),

limit(3)

);

const noticeSnap=await getDocs(q);

let html="";
let count=0;

noticeSnap.forEach((d)=>{

count++;

const notice=d.data();

html+=`

<div class="notice-item">

<div class="notice-title">

${notice.title || "Notice"}

</div>

<div>

${notice.notice || "-"}

</div>

<div class="notice-date">

${notice.date || "-"}

</div>

</div>

`;

});

document.getElementById("noticeCount").innerHTML=count;

document.getElementById("latestNotice").innerHTML=

count===0

? "<p>No Notice Available</p>"

: html;

}catch(error){

console.error(error);

document.getElementById("latestNotice").innerHTML=

"<p>Unable to Load Notice</p>";

}

}
//============================
// parent_dashboard.js
// Part 3 (Final)
//============================

async function loadMarks(emis){

try{

const marksRef =
collection(db,"marks","Unit Test","students");

const marksSnap =
await getDocs(marksRef);

let total=0;
let count=0;

marksSnap.forEach((d)=>{

const mark=d.data();

if(mark.emis===emis){

total += Number(mark.total || 0);

count++;

}

});

const average =
count===0 ? 0 : Math.round(total/count);

document.getElementById("marksAverage").innerHTML =
average;

}catch(error){

console.error(error);

document.getElementById("marksAverage").innerHTML="0";

}

}

window.logoutParent = async function(){

try{

await signOut(auth);

localStorage.removeItem("parentEMIS");

localStorage.removeItem("role");
localStorage.removeItem("schoolCode");
localStorage.removeItem("email");

location.href="parent_login.html";

}catch(error){

console.error(error);

alert(error.message);

}

}

window.addEventListener("load",()=>{

loadDashboard();

});
