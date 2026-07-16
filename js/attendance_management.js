/*==================================================
School Connect TN
Attendance Management V2
JavaScript - Part 1
==================================================*/

import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

/*====================================
ELEMENTS
====================================*/

const attendanceDate =
document.getElementById("attendanceDate");

const studentClass =
document.getElementById("studentClass");

const section =
document.getElementById("section");

const studentList =
document.getElementById("studentList");

const totalStudents =
document.getElementById("totalStudents");

const presentCount =
document.getElementById("presentCount");

const absentCount =
document.getElementById("absentCount");

const leaveCount =
document.getElementById("leaveCount");

/*====================================
DEFAULT DATE
====================================*/

attendanceDate.value =
new Date().toISOString().split("T")[0];

/*====================================
LOAD STUDENTS
====================================*/

window.loadStudents = async function(){

studentList.innerHTML =
"<p>Loading Students...</p>";

if(
studentClass.value==="" ||
section.value===""
){

alert("Select Class and Section");

return;

}

try{

const q = query(

collection(db,"students"),

where("class","==",studentClass.value),

where("section","==",section.value)

);

const snapshot =
await getDocs(q);

studentList.innerHTML="";

let total=0;

snapshot.forEach(doc=>{

const student=doc.data();

total++;

studentList.innerHTML +=`

<div class="student-row">

<div>

<h3>${student.name}</h3>

<p>

EMIS :
${student.emis}

</p>

</div>

<div class="status-group">

<label>

<input
type="radio"
name="${student.emis}"
value="Present"
checked>

✅ Present

</label>

<label>

<input
type="radio"
name="${student.emis}"
value="Absent">

❌ Absent

</label>

<label>

<input
type="radio"
name="${student.emis}"
value="Leave">

🟡 Leave

</label>

</div>

</div>

`;

});

totalStudents.innerHTML=total;

presentCount.innerHTML=total;

absentCount.innerHTML=0;

leaveCount.innerHTML=0;

updateSummary();

}catch(error){

alert(error.message);

}

};
/*====================================
SUMMARY UPDATE
====================================*/

window.updateSummary = function(){

let present = 0;
let absent = 0;
let leave = 0;

document
.querySelectorAll(".status-group")
.forEach(group=>{

const selected =
group.querySelector(
"input[type=radio]:checked"
);

if(!selected) return;

if(selected.value==="Present"){
present++;
}

if(selected.value==="Absent"){
absent++;
}

if(selected.value==="Leave"){
leave++;
}

});

presentCount.innerHTML = present;
absentCount.innerHTML = absent;
leaveCount.innerHTML = leave;

};

/*====================================
AUTO UPDATE
====================================*/

document.addEventListener(
"change",
function(e){

if(
e.target.type==="radio"
){

updateSummary();

}

});

/*====================================
PRESENT ALL
====================================*/

window.markAllPresent=function(){

document
.querySelectorAll(
'input[value="Present"]'
)
.forEach(radio=>{

radio.checked=true;

});

updateSummary();

};

/*====================================
ABSENT ALL
====================================*/

window.markAllAbsent=function(){

document
.querySelectorAll(
'input[value="Absent"]'
)
.forEach(radio=>{

radio.checked=true;

});

updateSummary();

};

/*====================================
SEARCH STUDENT
====================================*/

window.searchStudent=function(){

const value =
document
.getElementById("searchStudent")
.value
.toLowerCase();

document
.querySelectorAll(".student-row")
.forEach(row=>{

row.style.display =
row.innerText
.toLowerCase()
.includes(value)
? "grid"
: "none";

});

};
/*====================================
SAVE ATTENDANCE
====================================*/

import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

window.saveAttendance = async function(){

const date = attendanceDate.value;

if(date===""){

alert("Select Attendance Date");

return;

}

const rows =
document.querySelectorAll(".student-row");

if(rows.length===0){

alert("No students loaded");

return;

}

try{

for(const row of rows){

const emis =
row.querySelector("input[type=radio]").name;

const studentName =
row.querySelector("h3").innerText;

const status =
row.querySelector(
"input[type=radio]:checked"
).value;

await setDoc(

doc(
db,
"attendance",
date,
"students",
emis
),

{

emis,
name:studentName,

class:studentClass.value,

section:section.value,

date,

status,

updatedAt:
new Date().toISOString()

},

{merge:true}

);

}

alert("✅ Attendance Saved Successfully");

}catch(error){

console.log(error);

alert(error.message);

}

};

/*====================================
LOAD EXISTING ATTENDANCE
(Future Ready)
====================================*/

window.loadExistingAttendance =
async function(){

// Future Update:
// Existing attendance will
// automatically load here.

};

console.log(
"Attendance Management Loaded Successfully"
);
