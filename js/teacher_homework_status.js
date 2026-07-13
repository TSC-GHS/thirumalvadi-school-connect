//========================================
// School Connect TN
// Teacher Homework Status
// Production Version
// Part 1
//========================================

import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
getDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const totalHomework =
document.getElementById("totalHomework");

const completedCount =
document.getElementById("completedCount");

const pendingCount =
document.getElementById("pendingCount");

const completedList =
document.getElementById("completedList");

const pendingList =
document.getElementById("pendingList");

let teacherId = "";
let teacher = {};

window.addEventListener("DOMContentLoaded", initialize);

async function initialize(){

teacherId =
localStorage.getItem("teacherId") ||
sessionStorage.getItem("teacherId");

if(!teacherId){

alert("Session Expired");

location.href="index.html";

return;

}

try{

const teacherRef =
doc(db,"teachers",teacherId);

const teacherSnap =
await getDoc(teacherRef);

if(!teacherSnap.exists()){

alert("Teacher Not Found");

location.href="index.html";

return;

}

teacher = teacherSnap.data();

await loadHomeworkStatus();

}catch(error){

console.error(error);

alert(error.message);

}

}
//========================================
// Load Homework Status
//========================================

async function loadHomeworkStatus(){

try{

const homeworkQuery = query(
collection(db,"homework"),
where("teacherId","==",teacherId)
);

const homeworkSnap = await getDocs(homeworkQuery);

totalHomework.textContent = homeworkSnap.size;

const submissionQuery = query(
collection(db,"homework_submissions"),
where("teacherId","==",teacherId)
);

const submissionSnap = await getDocs(submissionQuery);

let completed = 0;
let pending = 0;

completedList.innerHTML = "";
pendingList.innerHTML = "";

submissionSnap.forEach((docSnap)=>{

const data = docSnap.data();

if(data.status==="Completed"){

completed++;

completedList.innerHTML += `
<div class="studentCard">
<b>${data.studentName}</b><br>
EMIS : ${data.emis}<br>
${data.subject}
</div>
`;

}else{

pending++;

pendingList.innerHTML += `
<div class="studentCard">
<b>${data.studentName}</b><br>
EMIS : ${data.emis}<br>
${data.subject}
</div>
`;

}

});

completedCount.textContent = completed;
pendingCount.textContent = pending;
  //========================================
// Empty Message Handling
//========================================

if(completed===0){

completedList.innerHTML=`
<div class="studentCard">
No students have completed the homework.
</div>
`;

}

if(pending===0){

pendingList.innerHTML=`
<div class="studentCard">
No pending students.
</div>
`;

}

}catch(error){

console.error(error);

alert("Unable to load Homework Status");

}

}

//========================================
// Auto Refresh
//========================================

setInterval(async()=>{

try{

await loadHomeworkStatus();

}catch(error){

console.log(error);

}

},30000);

//========================================
// Version
//========================================

console.log("================================");
console.log("Teacher Homework Status");
console.log("Production Version V2");
console.log("================================");
