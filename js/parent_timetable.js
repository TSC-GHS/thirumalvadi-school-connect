//==================================================
// School Connect TN
// Parent Timetable
//==================================================

import { db } from "../firebase.js";

import {
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Elements
//==================================================

const studentName =
document.getElementById("studentName");

const studentEMIS =
document.getElementById("studentEMIS");

const studentClass =
document.getElementById("studentClass");

const todayName =
document.getElementById("todayName");

const timetableBody =
document.getElementById("timetableBody");

//==================================================
// Parent Session
//==================================================

const emis =
localStorage.getItem("parentEMIS") ||
sessionStorage.getItem("parentEMIS");

if(!emis){

alert("Session Expired");

location.href="index.html";

}

//==================================================
// Load Timetable
//==================================================

async function loadTimetable(){

try{

//=============================
// Student Details
//=============================

const studentDoc =
await getDoc(
doc(db,"students",emis)
);

if(!studentDoc.exists()){

alert("Student Not Found");

return;

}

const student =
studentDoc.data();

studentName.textContent =
student.name;

studentEMIS.textContent =
student.emis;

studentClass.textContent =
student.class +
" - " +
student.section;

//=============================
// Today
//=============================

const days=[

"Sunday",
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday"

];

const today =
days[new Date().getDay()];

todayName.textContent =
today;

//=============================
// Document ID
//=============================

const academicYear =
"2026-2027";

const documentId =

`${academicYear}_${student.class}_${student.section}_${today}`;

//=============================
// Load Firestore
//=============================

const timetableDoc =
await getDoc(
doc(db,"timetable",documentId)
);

if(!timetableDoc.exists()){

timetableBody.innerHTML=

`
<tr>

<td colspan="2">

No Timetable Available

</td>

</tr>

`;

return;

}

const data =
timetableDoc.data();

const periods =
data.subjects;

//=============================
// Show Timetable
//=============================

timetableBody.innerHTML="";

for(let i=1;i<=7;i++){

if(i==3){

timetableBody.innerHTML+=`

<tr class="breakRow">

<td>

Break

</td>

<td>

🍵 Tea Break

</td>

</tr>

`;

}

if(i==5){

timetableBody.innerHTML+=`

<tr class="lunchRow">

<td>

Lunch

</td>

<td>

🍛 Lunch Break

</td>

</tr>

`;

}

timetableBody.innerHTML+=`

<tr>

<td>

Period ${i}

</td>

<td>

${periods["Period"+i] || "-"}

</td>

</tr>

`;

}

}catch(error){

console.error(error);

timetableBody.innerHTML=

`

<tr>

<td colspan="2">

Failed to Load Timetable

</td>

</tr>

`;

}

}

//==================================================
// Initialize
//==================================================

window.addEventListener(

"DOMContentLoaded",

()=>{

loadTimetable();

}

);
