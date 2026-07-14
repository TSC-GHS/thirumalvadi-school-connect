import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
updateDoc,
doc,
setDoc,  
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const attendanceDate=document.getElementById("attendanceDate");
const className=document.getElementById("className");
const section=document.getElementById("section");
const studentList=document.getElementById("studentList");
const loadStudents=document.getElementById("loadStudents");
const saveAttendance=document.getElementById("saveAttendance");

attendanceDate.value=new Date().toISOString().split("T")[0];

let attendanceMap={};

loadStudents.addEventListener("click",loadStudentList);

async function loadStudentList(){

studentList.innerHTML=`
<tr>
<td colspan="3">Loading...</td>
</tr>
`;

attendanceMap={};

try{

const cls=className.value;
const sec=section.value;
const date=attendanceDate.value;

if(!cls||!sec||!date){

alert("Please Select Date, Class & Section");

studentList.innerHTML="";

return;

}

// Existing Attendance

const attendanceQuery=query(
collection(db,"attendance"),
where("date","==",date),
where("class","==",cls),
where("section","==",sec)
);

const attendanceSnap=await getDocs(attendanceQuery);

attendanceSnap.forEach(d=>{

attendanceMap[d.data().emis]={
id:d.id,
status:d.data().status
};

});

if(attendanceSnap.empty){

saveAttendance.innerHTML="💾 Save Attendance";

}else{

saveAttendance.innerHTML="✏️ Update Attendance";

}

// Load Students

const studentQuery=query(
collection(db,"students"),
where("class","==",cls),
where("section","==",sec)
);

const studentSnap=await getDocs(studentQuery);

studentList.innerHTML="";

if(studentSnap.empty){

studentList.innerHTML=`
<tr>
<td colspan="3">
No Students Found
</td>
</tr>
`;

return;

}

studentSnap.forEach(docSnap=>{

const s=docSnap.data();

const status=
attendanceMap[s.emis]
?attendanceMap[s.emis].status
:"Present";

studentList.innerHTML+=`

<tr>

<td>${s.emis}</td>

<td>${s.name}</td>

<td>

<select
class="status"
data-emis="${s.emis}">

<option value="Present"
${status==="Present"?"selected":""}>
Present
</option>

<option value="Absent"
${status==="Absent"?"selected":""}>
Absent
</option>

</select>

</td>

</tr>

`;

});

}catch(err){

console.error(err);

alert(err.message);

}

}
// ======================================
// Save / Update Attendance
// ======================================

saveAttendance.addEventListener("click", async ()=>{

const cls=className.value;
const sec=section.value;
const date=attendanceDate.value;

if(!cls || !sec || !date){

alert("Please Select Date, Class & Section");

return;

}

const rows=document.querySelectorAll("#studentList tr");

if(rows.length===0){

alert("No Students Loaded");

return;

}

try{

for(const row of rows){

const select=row.querySelector(".status");

if(!select) continue;

const emis=select.dataset.emis;
const studentName=row.cells[1].textContent;
const status=select.value;

if(attendanceMap[emis]){

await updateDoc(

doc(db,"attendance",attendanceMap[emis].id),

{

status:status,

markedBy:
localStorage.getItem("teacherName") || "Teacher",

updatedAt:serverTimestamp()

}

);

}else{

const attendanceId = `${date}_${cls}_${sec}_${emis}`;

await setDoc(

doc(db,"attendance",attendanceId),

{

emis:emis,

studentName:studentName,

class:cls,

section:sec,

date:date,

status:status,

markedBy:
localStorage.getItem("teacherName") || "Teacher",

createdAt:serverTimestamp()

}

);

}

}

alert("✅ Attendance Saved Successfully");

await loadStudentList();

}catch(error){

console.error(error);

alert(error.message);

}

});

console.log("Attendance Module Loaded Successfully");
