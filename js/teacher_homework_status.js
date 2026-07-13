//=========================================
// Teacher Homework Status
// Production Version
// Part 1
//=========================================

import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const totalHomework=document.getElementById("totalHomework");
const completedHomework=document.getElementById("completedHomework");
const pendingHomework=document.getElementById("pendingHomework");

const completedList=document.getElementById("completedStudents");
const pendingList=document.getElementById("pendingStudents");

let teacherId="";
let teacher={};

window.addEventListener("DOMContentLoaded",init);

async function init(){

teacherId=
localStorage.getItem("teacherId")||
sessionStorage.getItem("teacherId");

if(!teacherId){

alert("Session Expired");

location.href="index.html";

return;

}

const teacherSnap=await getDoc(doc(db,"teachers",teacherId));

if(!teacherSnap.exists()){

alert("Teacher Not Found");

return;

}

teacher=teacherSnap.data();

await loadStatus();

}
//=========================================
// Load Homework Status
//=========================================

async function loadStatus(){

try{

//------------------------------
// Total Homework
//------------------------------

const homeworkSnap = await getDocs(

query(
collection(db,"homework"),
where("teacherId","==",teacherId)
)

);

totalHomework.textContent = homeworkSnap.size;

//------------------------------
// Homework Submissions
//------------------------------

const submissionSnap = await getDocs(

query(
collection(db,"homework_submissions"),
where("teacherId","==",teacherId)
)

);

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

EMIS : ${data.emis}

</div>

`;

}else{

pending++;

pendingList.innerHTML += `

<div class="studentCard">

<b>${data.studentName}</b><br>

EMIS : ${data.emis}

</div>

`;

}

});

completedHomework.textContent = completed;
pendingHomework.textContent = pending;

if(completed===0){

completedList.innerHTML =
"No student has completed the homework yet.";

}

if(pending===0){

pendingList.innerHTML =
"All students completed the homework.";

}

}catch(error){

console.error(error);

alert(error.message);

}

}

console.log("Teacher Homework Status Loaded");
