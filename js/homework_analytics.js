//==================================================
// School Connect TN
// Homework Analytics
// Part 3A
//==================================================

import { db } from "../firebase.js";

import {
collection,
getDocs
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
collection(db,"homework")
);

if(snap.empty){

teacherWise.innerHTML="<p>No Homework Found</p>";
classWise.innerHTML="<p>No Homework Found</p>";
latestHomework.innerHTML="<p>No Homework Found</p>";

return;

}

const homework=[];

snap.forEach(doc=>{

homework.push(doc.data());

});

totalHomework.textContent=homework.length;

const today =
new Date().toISOString().split("T")[0];

const todayList =
homework.filter(h=>h.date===today);

todayHomework.textContent=todayList.length;
//==================================================
// Teacher Wise Analytics
//==================================================

const teacherMap = {};
const classMap = {};

homework.forEach((hw)=>{

// Teacher Wise

const teacher =
hw.teacherName || "Unknown";

teacherMap[teacher] =
(teacherMap[teacher] || 0) + 1;

// Class Wise

const cls =
`${hw.class || "-"}-${hw.section || "-"}`;

classMap[cls] =
(classMap[cls] || 0) + 1;

});

//==================================================
// Teacher Count
//==================================================

teacherCount.textContent =
Object.keys(teacherMap).length;

//==================================================
// Class Count
//==================================================

classCount.textContent =
Object.keys(classMap).length;

//==================================================
// Teacher Wise UI
//==================================================

let teacherHTML="";

Object.keys(teacherMap)
.sort()
.forEach(name=>{

teacherHTML += `

<div class="item">

<span>👨‍🏫 ${name}</span>

<span>${teacherMap[name]}</span>

</div>

`;

});

teacherWise.innerHTML = teacherHTML;

//==================================================
// Class Wise UI
//==================================================

let classHTML="";

Object.keys(classMap)
.sort()
.forEach(cls=>{

classHTML += `

<div class="item">

<span>🏫 ${cls}</span>

<span>${classMap[cls]}</span>

</div>

`;

});

classWise.innerHTML = classHTML;
  //==================================================
// Latest Homework
//==================================================

// Newest First

homework.sort((a,b)=>{

const d1 = a.createdAt?.seconds || 0;

const d2 = b.createdAt?.seconds || 0;

return d2 - d1;

});

let latestHTML = "";

homework.slice(0,10).forEach((hw)=>{

latestHTML += `

<div class="item">

<div>

<b>${hw.subject || "-"}</b><br>

Class : ${hw.class || "-"}-${hw.section || "-"}<br>

${hw.homework || hw.title || "-"}

</div>

<div>

${hw.date || "-"}

</div>

</div>

`;

});

latestHomework.innerHTML = latestHTML;

//==================================================
// End
//==================================================

}catch(error){

console.error(error);

alert(error.message);

}

}

console.log("Homework Analytics Loaded Successfully");
