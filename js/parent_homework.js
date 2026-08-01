//==================================================
// School Connect TN
// Parent Homework
// Production Version V3
// Part 1 - Imports & Initialization
//==================================================

import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
getDoc,
doc,
addDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Elements
//==================================================

const homeworkTable =
document.getElementById("homeworkTable");

//==================================================
// Variables
//==================================================

let emis = "";

let student = {};

//==================================================
// Start
//==================================================

window.addEventListener(

"DOMContentLoaded",

initialize

);

//==================================================
// Initialize
//==================================================

async function initialize(){

try{

emis =
localStorage.getItem("parentEMIS") ||
sessionStorage.getItem("parentEMIS");

if(!emis){

alert("Session Expired");

location.href="login.html";

return;

}

const studentRef =
doc(db,"students",emis);

const studentSnap =
await getDoc(studentRef);

if(!studentSnap.exists()){

alert("Student Not Found");

return;

}

student =
studentSnap.data();

console.log("Student Loaded");

console.log(student);

await loadHomework();

}

catch(error){

console.error(error);

alert(error.message);

}
//==================================================
// Part 2 - Load Homework
//==================================================

async function loadHomework(){

try{

homeworkTable.innerHTML=`
<tr>
<td colspan="4" style="text-align:center;">
Loading Homework...
</td>
</tr>
`;

const homeworkQuery=query(

collection(db,"homework"),

where("class","==",student.class),

where("section","==",student.section),

where("status","==","Active")

);

const homeworkSnap=await getDocs(homeworkQuery);

if(homeworkSnap.empty){

homeworkTable.innerHTML=`
<tr>
<td colspan="4" style="text-align:center;">
No Homework Available
</td>
</tr>
`;

return;

}

let html="";

const today=new Date();

for(const docSnap of homeworkSnap.docs){

const hw=docSnap.data();

const submissionQuery=query(

collection(db,"homework_submissions"),

where("homeworkId","==",docSnap.id),

where("emis","==",student.emis)

);

const submissionSnap=await getDocs(submissionQuery);

const completed=!submissionSnap.empty;

let badge="🟢 Pending";

if(completed){

badge="✅ Completed";

}
else if(hw.dueDate){

const due=new Date(hw.dueDate);

if(due<today){

badge="🔴 Overdue";

}

}

html+=createHomeworkRow(
docSnap.id,
hw,
badge,
completed
);

}

homeworkTable.innerHTML=html;

}catch(error){

console.error(error);

homeworkTable.innerHTML=`
<tr>
<td colspan="4" style="text-align:center;color:red;">
Unable to Load Homework
</td>
</tr>
`;

}

}
}
//==================================================
// Part 3 - Homework Table UI
//==================================================

function createHomeworkRow(

homeworkId,

hw,

badge,

completed

){

let button="";

if(completed){

button=`

<span
style="
color:green;
font-weight:bold;
">

Completed

</span>

`;

}else{

button=`

<button

class="completeBtn"

onclick="completeHomework('${homeworkId}')">

Complete

</button>

`;

}

return `

<tr>

<td>

<b>

${hw.subject || "-"}

</b>

<br>

<small>

${badge}

</small>

</td>

<td>

<b>

${hw.title || "-"}

</b>

<br><br>

${hw.description || "-"}

</td>

<td>

${hw.dueDate || "-"}

</td>

<td>

${button}

</td>

</tr>

`;

}

//==================================================
// Helper Function
//==================================================

function formatDate(dateString){

if(!dateString) return "-";

try{

const date=new Date(dateString);

return date.toLocaleDateString("en-GB");

}catch{

return dateString;

}

}

console.log("Parent Homework Part 3 Loaded");
