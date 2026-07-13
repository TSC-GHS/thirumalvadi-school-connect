//==========================================
// School Connect TN
// Parent Homework
// Production Version V2
// Part 1
//==========================================

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
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const homeworkTable =
document.getElementById("homeworkTable");

let emis = "";
let student = {};

window.addEventListener("DOMContentLoaded", initialize);

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
<td colspan="4">
Loading...
</td>
</tr>
`;

const submissionQuery=query(
collection(db,"homework_submissions"),
where("emis","==",student.emis)
);

const submissionSnap=await getDocs(submissionQuery);

if(submissionSnap.empty){

homeworkTable.innerHTML=`
<tr>
<td colspan="4">
No Homework Available
</td>
</tr>
`;

return;

}

let html="";

const today=new Date();

submissionSnap.forEach((docSnap)=>{

const hw=docSnap.data();

let badge="🟢 Pending";

if(hw.status==="Completed"){

badge="✅ Completed";

}else if(hw.dueDate){

const due=new Date(hw.dueDate);

if(due<today){

badge="🔴 Overdue";

}

}

let button="";

if(hw.status==="Completed"){

button=`
<span style="color:green;font-weight:bold;">
Completed
</span>
`;

}else{

button=`
<button
onclick="completeHomework('${docSnap.id}')"
class="completeBtn">

Complete

</button>
`;

}

html+=`

<tr>

<td>

<b>${hw.subject}</b>

<br>

<small>${badge}</small>

</td>

<td>

${hw.homeworkTitle || hw.title || "-"}

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

});

homeworkTable.innerHTML=html;

}catch(error){

console.error(error);

homeworkTable.innerHTML=`
<tr>
<td colspan="4">
Unable to Load Homework
</td>
</tr>
`;

}

}
//==========================================
// Complete Homework
//==========================================

window.completeHomework = async function(submissionId){

const comment = prompt(
"Parent Comment (Optional)"
) || "";

const ok = confirm(
"Homework completed?"
);

if(!ok) return;

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

await loadHomework();

}catch(error){

console.error(error);

alert("Unable to Submit Homework");

}

};

//==========================================
// Version
//==========================================

console.log("================================");
console.log("School Connect TN");
console.log("Parent Homework");
console.log("Production Version V2");
console.log("================================");
