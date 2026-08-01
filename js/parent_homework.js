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

updateDoc,

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

const submissionSnap = await getDocs(submissionQuery);

let completed = false;

let submissionDocId = "";

if(!submissionSnap.empty){

const submissionDoc = submissionSnap.docs[0];

submissionDocId = submissionDoc.id;

const submission = submissionDoc.data();

completed = submission.status === "Completed";

}

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

html += createHomeworkRow(
docSnap.id,
hw,
badge,
completed,
submissionDocId
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

completed,

submissionDocId

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
//==================================================
// Part 4 - Complete Homework
//==================================================

window.completeHomework = async function(homeworkId){

try{

//--------------------------------------------------
// Check Already Submitted
//--------------------------------------------------

//--------------------------------------------------
// Parent Comment
//--------------------------------------------------

const comment = prompt(

"Parent Comment (Optional)"

) || "";

//--------------------------------------------------
// Save Submission
//--------------------------------------------------

const submissionQuery = query(

collection(db,"homework_submissions"),

where("homeworkId","==",homeworkId),

where("emis","==",student.emis)

);

const submissionSnap = await getDocs(submissionQuery);

if(submissionSnap.empty){

alert("Submission record not found.");

return;

}

const submissionId = submissionSnap.docs[0].id;

await updateDoc(

doc(db,"homework_submissions",submissionId),

{

homeworkId:homeworkId,

emis:student.emis,

studentName:student.name || "",

class:student.class || "",

section:student.section || "",

status:"Completed",

completedBy:"Parent",

parentComment:comment,

completedTime:serverTimestamp()

}

);

//--------------------------------------------------
// Success
//--------------------------------------------------

alert("✅ Homework Submitted Successfully");

await loadHomework();

}

catch(error){

console.error(error);

alert("Unable to Submit Homework");

}

};

console.log("Parent Homework Part 4 Loaded");
//==================================================
// School Connect TN
// Parent Homework
// Production Version V3
// Part 5 - Final Helpers
//==================================================

//==================================================
// Sort Homework by Due Date
//==================================================

function sortHomeworkByDate(homeworkArray){

return homeworkArray.sort((a,b)=>{

const dateA=new Date(a.dueDate || "2099-12-31");

const dateB=new Date(b.dueDate || "2099-12-31");

return dateA-dateB;

});

}

//==================================================
// Empty Message
//==================================================

function showNoHomework(){

homeworkTable.innerHTML=`

<tr>

<td colspan="4"
style="text-align:center;padding:25px;">

📚 No Homework Available

</td>

</tr>

`;

}

//==================================================
// Loading Message
//==================================================

function showLoading(){

homeworkTable.innerHTML=`

<tr>

<td colspan="4"
style="text-align:center;padding:25px;">

⏳ Loading Homework...

</td>

</tr>

`;

}

//==================================================
// Error Message
//==================================================

function showError(){

homeworkTable.innerHTML=`

<tr>

<td colspan="4"
style="text-align:center;
color:red;
padding:25px;">

❌ Unable to Load Homework

</td>

</tr>

`;

}

//==================================================
// Refresh Homework
//==================================================

window.refreshHomework=async()=>{

await loadHomework();

};

//==================================================
// Version
//==================================================

console.log("================================");
console.log("School Connect TN");
console.log("Parent Homework");
console.log("Production Version V3");
console.log("================================");
