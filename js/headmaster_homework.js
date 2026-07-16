//==================================================
// School Connect TN
// Headmaster Homework Analytics
// Part 3A
//==================================================

import { db } from "../firebase.js";

import {
collection,
getDocs,
orderBy,
query
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Elements
//==================================================

const totalHomework =
document.getElementById("totalHomework");

const todayHomework =
document.getElementById("todayHomework");

const teacherCount =
document.getElementById("teacherCount");

const classCount =
document.getElementById("classCount");

const teacherWise =
document.getElementById("teacherWise");

const classWise =
document.getElementById("classWise");

const latestHomework =
document.getElementById("latestHomework");

//==================================================

loadHomeworkAnalytics();

//==================================================

async function loadHomeworkAnalytics(){

try{

const snap = await getDocs(

query(
collection(db,"homework"),
orderBy("createdAt","desc")
)

);

if(snap.empty){

teacherWise.innerHTML =
"<p>No Homework Available</p>";

classWise.innerHTML =
"<p>No Homework Available</p>";

latestHomework.innerHTML =
"<p>No Homework Available</p>";

return;

}

const homework=[];

snap.forEach(doc=>{

homework.push(doc.data());

});
//==================================================
// Teacher Wise Analytics
//==================================================

const teacherWiseData = {};

students.forEach((hw)=>{

const teacher = hw.teacherName || "Unknown";

if(!teacherWiseData[teacher]){

teacherWiseData[teacher]=0;

}

teacherWiseData[teacher]++;

});

teacherCount.textContent =
Object.keys(teacherWiseData).length;

let teacherHTML="";

Object.keys(teacherWiseData)
.sort()
.forEach((teacher)=>{

teacherHTML += `

<div class="item">

<span>👨‍🏫 ${teacher}</span>

<span>${teacherWiseData[teacher]} Homework</span>

</div>

`;

});

teacherWise.innerHTML = teacherHTML;

//==================================================
// Class Wise Analytics
//==================================================

const classWiseData = {};

students.forEach((hw)=>{

const cls =
`${hw.class}-${hw.section}`;

if(!classWiseData[cls]){

classWiseData[cls]=0;

}

classWiseData[cls]++;

});

classCount.textContent =
Object.keys(classWiseData).length;

let classHTML="";

Object.keys(classWiseData)
.sort()
.forEach((cls)=>{

classHTML += `

<div class="item">

<span>🏫 ${cls}</span>

<span>${classWiseData[cls]} Homework</span>

</div>

`;

});

classWise.innerHTML = classHTML;
  //==================================================
// Summary Analytics
//==================================================

totalHomework.textContent = homework.length;

const today = new Date().toISOString().split("T")[0];

let todayCount = 0;

const teacherMap = {};
const classMap = {};

let teacherHTML = "";
let classHTML = "";
let latestHTML = "";

homework.forEach((hw)=>{

// Today's Homework

if(hw.date === today){

todayCount++;

}

// Teacher Count

const teacher =
hw.teacherName || "Unknown";

teacherMap[teacher] =
(teacherMap[teacher] || 0) + 1;

// Class Count

const cls =
`${hw.class}-${hw.section}`;

classMap[cls] =
(classMap[cls] || 0) + 1;

});

// Cards

todayHomework.textContent = todayCount;

teacherCount.textContent =
Object.keys(teacherMap).length;

classCount.textContent =
Object.keys(classMap).length;

//==================================================
// Teacher Wise
//==================================================

Object.keys(teacherMap)
.sort()
.forEach((teacher)=>{

teacherHTML += `

<div class="item">

<span>${teacher}</span>

<span>${teacherMap[teacher]} Homework</span>

</div>

`;

});

teacherWise.innerHTML = teacherHTML;

//==================================================
// Class Wise
//==================================================

Object.keys(classMap)
.sort()
.forEach((cls)=>{

classHTML += `

<div class="item">

<span>${cls}</span>

<span>${classMap[cls]} Homework</span>

</div>

`;

});

classWise.innerHTML = classHTML;
