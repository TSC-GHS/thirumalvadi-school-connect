//==================================================
// School Connect TN
// Parent Dashboard V1
// Part 1
//==================================================

import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
orderBy,
limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Elements
//==================================================

const studentName =
document.getElementById("studentName");

const studentClass =
document.getElementById("studentClass");

const studentEMIS =
document.getElementById("studentEMIS");

const attendanceCount =
document.getElementById("attendanceCount");

const homeworkCount =
document.getElementById("homeworkCount");

const noticeCount =
document.getElementById("noticeCount");

const resultCount =
document.getElementById("resultCount");

const latestNotices =
document.getElementById("latestNotices");

const recentHomework =
document.getElementById("recentHomework");

//==================================================
// Parent Session
//==================================================

const parentEMIS =
localStorage.getItem("parentEMIS") ||
sessionStorage.getItem("parentEMIS");

if(!parentEMIS){

alert("Session Expired");

location.href="index.html";

}

//==================================================
// Student Details
//==================================================

let studentData = null;

async function loadStudent(){

try{

const q = query(
collection(db,"students"),
where("emis","==",parentEMIS)
);

const snap = await getDocs(q);

if(snap.empty){

alert("Student Record Not Found");

location.href="index.html";

return false;

}

studentData = snap.docs[0].data();

studentName.textContent =
studentData.name || "-";

studentEMIS.textContent =
studentData.emis || "-";

studentClass.textContent =
`${studentData.class || "-"}-${studentData.section || "-"}`;

attendanceCount.textContent =
studentData.attendance || "0%";

return true;

}catch(error){

console.error(error);

alert("Unable to load Student");

return false;

}

}

console.log("Parent Dashboard Part 1 Loaded");
//==================================================
// Dashboard Summary
// Part 2
//==================================================

async function loadDashboard(){

try{

//============================
// Homework Count
//============================

const homeworkSnap = await getDocs(

query(
collection(db,"homework"),
where("className","==",studentData.class),
where("section","==",studentData.section)
)

);

homeworkCount.textContent =
homeworkSnap.size;

//============================
// Notice Count
//============================

const noticeSnap =
await getDocs(collection(db,"notices"));

noticeCount.textContent =
noticeSnap.size;

//============================
// Average Marks
//============================

const marksSnap = await getDocs(

query(
collection(db,"marks"),
where("emis","==",parentEMIS)
)

);

let total = 0;
let subjects = 0;

marksSnap.forEach((doc)=>{

const mark = Number(doc.data().mark || 0);

total += mark;
subjects++;

});

if(subjects>0){

resultCount.textContent =
Math.round(total/subjects)+"%";

}else{

resultCount.textContent="0%";

}

}catch(error){

console.error(error);

homeworkCount.textContent="-";
noticeCount.textContent="-";
resultCount.textContent="-";

}

}

//==================================================
// Initialize Dashboard
//==================================================

async function initializeDashboard(){

const loaded =
await loadStudent();

if(!loaded) return;

await loadDashboard();

}

initializeDashboard();

console.log("Parent Dashboard Part 2 Loaded");
//==================================================
// Latest Notices
//==================================================

async function loadLatestNotices(){

try{

const snap = await getDocs(

query(
collection(db,"notices"),
orderBy("createdAt","desc"),
limit(5)
)

);

latestNotices.innerHTML="";

if(snap.empty){

latestNotices.innerHTML=
"<p>No Notices Available</p>";

return;

}

snap.forEach((doc)=>{

const notice = doc.data();

latestNotices.innerHTML += `

<div class="notice-item">

<div class="notice-title">

${notice.title || "Notice"}

</div>

<p>

${notice.description || ""}

</p>

</div>

`;

});

}catch(error){

console.error(error);

latestNotices.innerHTML=
"<p>Unable to load notices</p>";

}

}

//==================================================
// Recent Homework
//==================================================

async function loadRecentHomework(){

try{

const snap = await getDocs(

query(
collection(db,"homework"),
where("className","==",studentData.class),
where("section","==",studentData.section),
orderBy("createdAt","desc"),
limit(5)
)

);

recentHomework.innerHTML="";

if(snap.empty){

recentHomework.innerHTML=
"<p>No Homework Available</p>";

return;

}

snap.forEach((doc)=>{

const hw = doc.data();

recentHomework.innerHTML += `

<div class="homework-item">

<div class="homework-sub">

${hw.subject || "-"}

</div>

<p>

${hw.title || hw.description || "-"}

</p>

<small>

Due : ${hw.dueDate || "-"}

</small>

</div>

`;

});

}catch(error){

console.error(error);

recentHomework.innerHTML=
"<p>Unable to load homework</p>";

}

}

//==================================================
// Load Dashboard Data
//==================================================

async function loadParentData(){

await loadLatestNotices();

await loadRecentHomework();

}

loadParentData();

console.log("Parent Dashboard Part 3 Loaded");
// ========================================
// PART 4 - Homework
// ========================================

async function loadHomework(){

try{

const q = query(
collection(db,"homework"),
where("className","==",studentData.class),
where("section","==",studentData.section)
);

const snap = await getDocs(q);

let html="";

snap.forEach((doc)=>{

const hw=doc.data();

html += `
<div class="homework-item">
<div class="homework-sub">${hw.subject}</div>
<div>${hw.title}</div>
<small>Due : ${hw.dueDate}</small>
</div>
`;

});

if(html===""){

html="<p>No Homework Available</p>";

}

document.getElementById("homeworkList").innerHTML=html;

}catch(error){

console.log(error);

}

}

// ========================================
// Bottom Menu
// ========================================

window.goHome=()=>{
location.href="parent_dashboard.html";
};

window.goAttendance=()=>{
location.href="parent_attendance.html";
};

window.goReport=()=>{
location.href="parent_report_card.html";
};

window.goProfile=()=>{
location.href="parent_profile.html";
};

// ========================================
// Logout
// ========================================

window.logout=()=>{

localStorage.removeItem("parentEMIS");
sessionStorage.removeItem("parentEMIS");

location.href="index.html";

};

// ========================================
// Initialize
// ========================================

loadStudent();

console.log("================================");
console.log("School Connect TN");
console.log("Parent Dashboard V1");
console.log("================================");
