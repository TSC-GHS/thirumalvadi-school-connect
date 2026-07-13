//==========================================
// School Connect TN
// Homework Management
// Production Version V2
// Part 1
//==========================================

import { db } from "../firebase.js";

import {
collection,
addDoc,
getDocs,
getDoc,
deleteDoc,
doc,
query,
where,
orderBy,
writeBatch
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const saveBtn =
document.getElementById("saveHomework");

const homeworkList =
document.getElementById("homeworkList");

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

const teacherSnap =
await getDoc(
doc(db,"teachers",teacherId)
);

if(!teacherSnap.exists()){

alert("Teacher Not Found");

return;

}

teacher = teacherSnap.data();

await loadHomework();

}catch(error){

console.error(error);

alert(error.message);

}

}
//==========================================
// Load Homework List
//==========================================

async function loadHomework(){

try{

homeworkList.innerHTML = "Loading Homework...";

const homeworkQuery = query(
collection(db,"homework"),
where("teacherId","==",teacherId),
orderBy("createdAt","desc")
);

const homeworkSnap = await getDocs(homeworkQuery);

homeworkList.innerHTML = "";

if(homeworkSnap.empty){

homeworkList.innerHTML = `
<p style="text-align:center;">
No Homework Available
</p>
`;

return;

}

homeworkSnap.forEach((docSnap)=>{

const hw = docSnap.data();

homeworkList.innerHTML += `

<div class="homeworkCard">

<h3>${hw.title}</h3>

<p>${hw.description}</p>

<p><b>Class :</b> ${hw.className}</p>

<p><b>Section :</b> ${hw.section}</p>

<p><b>Subject :</b> ${hw.subject}</p>

<p><b>Due Date :</b> ${hw.dueDate}</p>

<p><b>Status :</b> ${hw.status}</p>

<button
onclick="deleteHomework('${docSnap.id}')">

🗑 Delete

</button>

</div>

<br>

`;

});

}catch(error){

console.error(error);

homeworkList.innerHTML = `
<p style="color:red;">
Unable to Load Homework
</p>
`;

}

}

//==========================================
// Delete Homework
//==========================================

window.deleteHomework = async function(id){

const ok = confirm("Delete this Homework?");

if(!ok) return;

try{

await deleteDoc(doc(db,"homework",id));

alert("✅ Homework Deleted");

await loadHomework();

}catch(error){

console.error(error);

alert("Unable to Delete Homework");

}

}
//==========================================
// Save Homework
//==========================================

saveBtn.addEventListener("click", async ()=>{

const title =
document.getElementById("homeworkTitle").value.trim();

const description =
document.getElementById("homeworkDescription").value.trim();

const className =
document.getElementById("className").value;

const section =
document.getElementById("section").value;

const subject =
document.getElementById("subject").value;

const dueDate =
document.getElementById("dueDate").value;

if(
!title ||
!description ||
!className ||
!section ||
!subject ||
!dueDate
){

alert("Please fill all fields");

return;

}

try{

const homeworkRef = await addDoc(
collection(db,"homework"),
{

title,
description,
className,
section,
subject,
dueDate,

teacherId,
teacherName: teacher.name,
teacherType: teacher.teacherType || "",

status:"Active",

createdAt:new Date()

}
);

//==========================================
// Create Homework Submission Records
//==========================================

const studentQuery = query(
collection(db,"students"),
where("class","==",className),
where("section","==",section)
);

const studentSnap = await getDocs(studentQuery);

const batch = writeBatch(db);

studentSnap.forEach((studentDoc)=>{

const student = studentDoc.data();

const submissionRef =
doc(collection(db,"homework_submissions"));

batch.set(submissionRef,{

homeworkId: homeworkRef.id,

title,
description,

className,
section,
subject,
dueDate,

teacherId,
teacherName: teacher.name,

studentName: student.name,
emis: student.emis,

status:"Pending",

completedBy:"",
parentComment:"",
completedTime:null,

createdAt:new Date()

});

});

await batch.commit();

alert("✅ Homework Saved Successfully");

// Clear Form

document.getElementById("homeworkTitle").value="";
document.getElementById("homeworkDescription").value="";
document.getElementById("className").value="";
document.getElementById("section").value="";
document.getElementById("subject").value="";
document.getElementById("dueDate").value="";

await loadHomework();

}catch(error){

console.error(error);

alert(error.message);

}

});
//==========================================
// Auto Refresh Homework List
//==========================================

setInterval(async()=>{

try{

if(teacherId){

await loadHomework();

}

}catch(error){

console.log("Homework Refresh Failed",error);

}

},60000);

//==========================================
// Version Information
//==========================================

console.log("================================");
console.log("School Connect TN");
console.log("Homework Management");
console.log("Production Version V2");
console.log("Firebase Connected");
console.log("================================");

//==========================================
// Global Error Handler
//==========================================

window.addEventListener("error",(event)=>{

console.error("Global Error :",event.error);

});

window.addEventListener("unhandledrejection",(event)=>{

console.error("Unhandled Promise :",event.reason);

});
