//==================================================
// School Connect TN
// Teacher List
// Part 3A
//==================================================

import { db } from "./firebase.js";

import {
collection,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Elements
//==================================================

const teacherList =
document.getElementById("teacherList");

const totalTeachers =
document.getElementById("totalTeachers");

const maleTeachers =
document.getElementById("maleTeachers");

const femaleTeachers =
document.getElementById("femaleTeachers");

const activeTeachers =
document.getElementById("activeTeachers");

//==================================================
// Global Array
//==================================================

let allTeachers = [];

//==================================================
// Load Teachers
//==================================================

async function loadTeachers(){

teacherList.innerHTML=`

<div class="loading">

Loading Teachers...

</div>

`;

allTeachers=[];

let male=0;
let female=0;
let active=0;

try{

const snap =
await getDocs(collection(db,"teachers"));

snap.forEach((teacherDoc)=>{

const teacher=teacherDoc.data();

teacher.id=teacherDoc.id;

allTeachers.push(teacher);

if(teacher.gender==="Male"){

male++;

}

if(teacher.gender==="Female"){

female++;

}

if(teacher.status==="Active"){

active++;

}

});

totalTeachers.innerText=
allTeachers.length;

maleTeachers.innerText=
male;

femaleTeachers.innerText=
female;

activeTeachers.innerText=
active;

renderTeachers(allTeachers);

refreshSummary();

}catch(error){

teacherList.innerHTML=`

<div class="empty">

Unable to load teachers

</div>

`;

console.log(error);

}

}

//==================================================
// Render Teachers
//==================================================

function renderTeachers(list){

teacherList.innerHTML="";

if(list.length===0){

teacherList.innerHTML=`

<div class="empty">

No Teachers Found

</div>

`;

return;

}

list.forEach((teacher)=>{

teacherList.innerHTML+=`

<div class="teacherCard">

<div class="teacherLeft">

<div class="teacherPhoto">

<img
src="${
teacher.photo ||
'assets/images/teacher.png'
}">

</div>

<div class="teacherInfo">

<h3>

${teacher.name || "-"}

</h3>

<p>

<b>ID :</b>

${teacher.teacherId || "-"}

</p>

<p>

<b>Subject :</b>

${teacher.subject || "-"}

</p>

<p>

<b>Mobile :</b>

${teacher.mobile || "-"}

</p>

<p>

<b>Status :</b>

${teacher.status || "-"}

</p>

</div>

</div>

<div class="teacherActions">

<button
class="viewBtn"
onclick="viewTeacher('${teacher.id}')">

👁

</button>

<button
class="editBtn"
onclick="editTeacher('${teacher.id}')">

✏️

</button>

<button
class="callBtn"
onclick="callTeacher('${teacher.mobile}')">

📞

</button>

<button
class="deleteBtn"
onclick="deleteTeacher('${teacher.id}')">

🗑

</button>

</div>

</div>

`;

});

}

//==================================================
// Delete Teacher
//==================================================

window.deleteTeacher = async function(id){

const ok =
confirm("Delete this Teacher?");

if(!ok){

return;

}

try{

await deleteDoc(
doc(db,"teachers",id)
);

alert("Teacher Deleted");

loadTeachers();

}catch(error){

alert(error.message);

}

}

//==================================================
// Start
//==================================================

loadTeachers();
//==================================================
// Search Teacher
//==================================================

window.searchTeacher = function(){

const value =
document.getElementById("search")
.value
.toLowerCase();

const subject =
document.getElementById("filterSubject")
.value;

const gender =
document.getElementById("filterGender")
.value;

const status =
document.getElementById("filterStatus")
.value;

const filtered =
allTeachers.filter((teacher)=>{

const searchMatch =

(teacher.name || "")
.toLowerCase()
.includes(value)

||

(teacher.teacherId || "")
.toLowerCase()
.includes(value)

||

(teacher.mobile || "")
.toLowerCase()
.includes(value);

const subjectMatch =

!subject ||

teacher.subject===subject;

const genderMatch =

!gender ||

teacher.gender===gender;

const statusMatch =

!status ||

teacher.status===status;

return(

searchMatch &&

subjectMatch &&

genderMatch &&

statusMatch

);

});

renderTeachers(filtered);

};

//==================================================
// Filter Events
//==================================================

document
.getElementById("filterSubject")
.onchange = searchTeacher;

document
.getElementById("filterGender")
.onchange = searchTeacher;

document
.getElementById("filterStatus")
.onchange = searchTeacher;

//==================================================
// Download Excel
//==================================================

window.downloadExcel=function(){

let csv="Teacher ID,Name,Subject,Mobile,Gender,Status\n";

allTeachers.forEach((teacher)=>{

csv+=

`${teacher.teacherId||""},
${teacher.name||""},
${teacher.subject||""},
${teacher.mobile||""},
${teacher.gender||""},
${teacher.status||""}\n`;

});

const blob=new Blob([csv],{type:"text/csv"});

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="Teacher_List.csv";

a.click();

URL.revokeObjectURL(url);

}

//==================================================
// Download PDF
//==================================================

window.downloadPDF=function(){

alert(

"PDF Export will be added in Version 2"

);

};

//==================================================
// View Teacher
//==================================================

window.viewTeacher=function(id){

location.href=

"teacher_profile.html?id="+id;

};

//==================================================
// Edit Teacher
//==================================================

window.editTeacher=function(id){

location.href=

"manage_teachers.html?id="+id;

};

//==================================================
// Call Teacher
//==================================================

window.callTeacher=function(number){

if(number){

window.location.href=

"tel:"+number;

}else{

alert("Mobile Number Not Available");

}

};
//==================================================
// Animated Counter
//==================================================

function animateCounter(element,target){

let start=0;

const speed=20;

const timer=setInterval(()=>{

start++;

element.innerText=start;

if(start>=target){

clearInterval(timer);

element.innerText=target;

}

},speed);

}

//==================================================
// Refresh Summary
//==================================================

function refreshSummary(){

let male=0;
let female=0;
let active=0;

allTeachers.forEach((teacher)=>{

if(teacher.gender==="Male") male++;

if(teacher.gender==="Female") female++;

if(teacher.status==="Active") active++;

});

animateCounter(
totalTeachers,
allTeachers.length
);

animateCounter(
maleTeachers,
male
);

animateCounter(
femaleTeachers,
female
);

animateCounter(
activeTeachers,
active
);

}
