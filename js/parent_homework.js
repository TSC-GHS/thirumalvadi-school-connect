//==========================================
// School Connect TN
// Parent Homework
// Production Version
// Part 1
//==========================================

import { db } from "../firebase.js";

import {
doc,
getDoc,
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const homeworkTable =
document.getElementById("homeworkTable");

const emis =
localStorage.getItem("parentEMIS") ||
sessionStorage.getItem("parentEMIS");

let student = {};

window.addEventListener("DOMContentLoaded", initialize);

async function initialize(){

if(!emis){

alert("Session Expired");

location.href="login.html";

return;

}

try{

const studentSnap =
await getDoc(doc(db,"students",emis));

if(!studentSnap.exists()){

alert("Student Not Found");

return;

}

student = studentSnap.data();

await loadHomework();

}catch(error){

console.error(error);

alert(error.message);

}

}
//==========================================
// Load Homework
//==========================================

async function loadHomework(){

try{

homeworkTable.innerHTML=`
<tr>
<td colspan="3">Loading...</td>
</tr>
`;

const homeworkQuery=query(
collection(db,"homework"),
where("className","==",student.class),
where("section","==",student.section)
);

const homeworkSnap=await getDocs(homeworkQuery);

if(homeworkSnap.empty){

homeworkTable.innerHTML=`
<tr>
<td colspan="3">
No Homework Available
</td>
</tr>
`;

return;

}

let html="";

const today=new Date();

homeworkSnap.forEach((docSnap)=>{

const hw=docSnap.data();

let badge="🟢 Pending";

if(hw.dueDate){

const due=new Date(hw.dueDate);

if(due<today){

badge="🔴 Overdue";

}

}

html+=`

<tr>

<td>

<b>${hw.subject}</b>

<br>

<small>${badge}</small>

</td>

<td>

${hw.description}

</td>

<td>

${hw.dueDate}

</td>

</tr>

`;

});

homeworkTable.innerHTML=html;

}catch(error){

console.error(error);

homeworkTable.innerHTML=`
<tr>
<td colspan="3">
Unable to Load Homework
</td>
</tr>
`;

}

}
//==========================================
// Parent Complete Homework
//==========================================

import {
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

window.completeHomework = async function(submissionId){

const comment = prompt(
"Comment (Optional)"
) || "";

try{

await updateDoc(
doc(db,"homework_submissions",submissionId),
{

status:"Completed",

completedBy:"Parent",

parentComment:comment,

completedTime:serverTimestamp()

}
);

alert("✅ Homework Submitted Successfully");

loadHomework();

}catch(error){

console.error(error);

alert("Unable to Submit Homework");

}

}
//==========================================
// Reload Homework After Completion
//==========================================

async function refreshHomework(){

await loadHomework();

}

//==========================================
// Version
//==========================================

console.log("================================");
console.log("School Connect TN");
console.log("Parent Homework");
console.log("Production Version V1");
console.log("================================");
