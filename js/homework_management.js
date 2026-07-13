//==========================================
// Homework Management
// Production Version
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

const saveBtn = document.getElementById("saveHomework");
const homeworkList = document.getElementById("homeworkList");

let teacherId = "";
let teacher = {};

window.addEventListener("DOMContentLoaded", init);

async function init(){

teacherId =
localStorage.getItem("teacherId") ||
sessionStorage.getItem("teacherId");

if(!teacherId){

alert("Session Expired");

location.href="index.html";

return;

}

const teacherDoc =
await getDoc(doc(db,"teachers",teacherId));

if(!teacherDoc.exists()){

alert("Teacher Profile Not Found");

return;

}

teacher = teacherDoc.data();

await loadHomework();

}
//==========================================
// Load Homework List
//==========================================

async function loadHomework(){

try{

homeworkList.innerHTML="Loading Homework...";

const q=query(
collection(db,"homework"),
where("teacherId","==",teacherId),
orderBy("createdAt","desc")
);

const snap=await getDocs(q);

homeworkList.innerHTML="";

if(snap.empty){

homeworkList.innerHTML=`
<p style="text-align:center;">
No Homework Available
</p>
`;

return;

}

snap.forEach((docSnap)=>{

const hw=docSnap.data();

homeworkList.innerHTML+=`

<div class="homeworkCard">

<h3>${hw.title}</h3>

<p>${hw.description}</p>

<p><b>Class :</b> ${hw.className}</p>

<p><b>Section :</b> ${hw.section}</p>

<p><b>Subject :</b> ${hw.subject}</p>

<p><b>Due Date :</b> ${hw.dueDate}</p>

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

homeworkList.innerHTML=`
<p style="color:red;">
Failed to Load Homework
</p>
`;

}

}
//==========================================
// Save Homework
//==========================================

saveBtn.addEventListener("click", async () => {

const title = document.getElementById("homeworkTitle").value.trim();
const description = document.getElementById("homeworkDescription").value.trim();
const className = document.getElementById("className").value;
const section = document.getElementById("section").value;
const subject = document.getElementById("subject").value;
const dueDate = document.getElementById("dueDate").value;

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

const homeworkRef = await addDoc(collection(db,"homework"),{

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

});

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

teacherId,
teacherName: teacher.name,

studentName: student.name,
emis: student.emis,

class: className,
section,
subject,

status:"Pending",

completedAt:null,

createdAt:new Date()

});

});

await batch.commit();

alert("✅ Homework Saved Successfully");

document.getElementById("homeworkTitle").value="";
document.getElementById("homeworkDescription").value="";
document.getElementById("className").value="";
document.getElementById("section").value="";
document.getElementById("subject").value="";
document.getElementById("dueDate").value="";

loadHomework();

}catch(error){

console.error(error);

alert(error.message);

}

});
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
// End
//==========================================

console.log("================================");
console.log("Homework Management Loaded");
console.log("Production Version");
console.log("================================");
