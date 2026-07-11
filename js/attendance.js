import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const studentList =
document.getElementById("studentList");

const loadStudents =
document.getElementById("loadStudents");

// ======================================
// Load Students
// ======================================

loadStudents.addEventListener("click", async ()=>{

const className =
document.getElementById("className").value;

const section =
document.getElementById("section").value;

if(!className || !section){

alert("Please Select Class & Section");

return;

}

studentList.innerHTML = `
<tr>
<td colspan="3">Loading...</td>
</tr>
`;

try{

const q = query(

collection(db,"students"),

where("class","==",className),

where("section","==",section)

);

const snap = await getDocs(q);

studentList.innerHTML = "";

if(snap.empty){

studentList.innerHTML = `
<tr>
<td colspan="3">No Students Found</td>
</tr>
`;

return;

}

snap.forEach((docSnap)=>{

const student = docSnap.data();

studentList.innerHTML += `

<tr>

<td>${student.emis}</td>

<td>${student.name}</td>

<td>

<select class="status" data-emis="${student.emis}">

<option value="Present">Present</option>

<option value="Absent">Absent</option>

</select>

</td>

</tr>

`;

});

}catch(error){

console.error(error);

alert(error.message);

}

});
import {
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ======================================
// Save Attendance
// ======================================

const saveAttendance =
document.getElementById("saveAttendance");

saveAttendance.addEventListener("click", async ()=>{

const attendanceDate =
document.getElementById("attendanceDate").value;

const className =
document.getElementById("className").value;

const section =
document.getElementById("section").value;

if(!attendanceDate || !className || !section){

alert("Please select Date, Class and Section");

return;

}

const rows =
document.querySelectorAll("#studentList tr");

if(rows.length===0){

alert("No Students Loaded");

return;

}

try{

for(const row of rows){

const statusSelect =
row.querySelector(".status");

if(!statusSelect) continue;

const emis =
statusSelect.dataset.emis;

const status =
statusSelect.value;

const studentName =
row.cells[1].textContent;

await addDoc(collection(db,"attendance"),{

emis,
studentName,
class:className,
section,
date:attendanceDate,
status,

markedBy:
localStorage.getItem("teacherName") || "Teacher",

createdAt:
serverTimestamp()

});

}

alert("✅ Attendance Saved Successfully");

}catch(error){

console.error(error);

alert(error.message);

}

});

console.log("Attendance Module Loaded");
