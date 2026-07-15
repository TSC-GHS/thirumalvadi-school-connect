import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//============================
// Elements
//============================

const totalStudents =
document.getElementById("totalStudents");

const presentStudents =
document.getElementById("presentStudents");

const absentStudents =
document.getElementById("absentStudents");

const attendancePercent =
document.getElementById("attendancePercent");

const classAttendance =
document.getElementById("classAttendance");

const highestClass =
document.getElementById("highestClass");

const lowestClass =
document.getElementById("lowestClass");

const boysAttendance =
document.getElementById("boysAttendance");

const girlsAttendance =
document.getElementById("girlsAttendance");

//============================

loadAttendanceAnalytics();

//============================

async function loadAttendanceAnalytics(){

try{

// Student Count

const studentSnap =
await getDocs(collection(db,"students"));

const total =
studentSnap.size;

totalStudents.textContent = total;

// Attendance Collection

const attendanceSnap =
await getDocs(collection(db,"attendance"));

let present = 0;
let absent = 0;

const classWise = {};

attendanceSnap.forEach((doc)=>{

const data = doc.data();

if(data.status==="Present"){

present++;

}else{

absent++;

}

const cls =
`${data.class}-${data.section}`;

if(!classWise[cls]){

classWise[cls]={
present:0,
total:0
};

}

classWise[cls].total++;

if(data.status==="Present"){

classWise[cls].present++;

}

});

// Summary

presentStudents.textContent = present;

absentStudents.textContent = absent;

const percent =
total==0 ? 0 :
((present/total)*100).toFixed(1);

attendancePercent.textContent =
percent+"%";

// Boys / Girls
// V1 Placeholder

boysAttendance.textContent =
percent+"%";

girlsAttendance.textContent =
percent+"%";

// Class Wise

let html="";

let highName="-";
let lowName="-";

let high=0;
let low=101;

Object.keys(classWise)
.sort()
.forEach((cls)=>{

const p =
((classWise[cls].present /
classWise[cls].total)*100)
.toFixed(1);

if(Number(p)>high){

high=Number(p);

highName=cls;

}

if(Number(p)<low){

low=Number(p);

lowName=cls;

}

html += `

<div class="classItem">

<div class="classHeader">

<span>${cls}</span>

<span>${p}%</span>

</div>

<div class="progress">

<div class="progressBar"

style="width:${p}%">

</div>

</div>

</div>

`;

});

classAttendance.innerHTML = html;

highestClass.textContent =
`${highName} (${high}%)`;

lowestClass.textContent =
`${lowName} (${low}%)`;

}catch(error){

console.error(error);

alert(error.message);

}
}

console.log("Attendance Analytics Loaded");
