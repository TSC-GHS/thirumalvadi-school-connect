import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
addDoc,
updateDoc,
doc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const studentList = document.getElementById("studentList");
const loadStudents = document.getElementById("loadStudents");
const saveAttendance = document.getElementById("saveAttendance");
const attendanceDate = document.getElementById("attendanceDate");

let existingAttendance = [];
let isUpdate = false;

// ======================================
// Check Existing Attendance
// ======================================

async function checkExistingAttendance(className, section, date){

existingAttendance = [];
isUpdate = false;

const q = query(

collection(db,"attendance"),

where("class","==",className),

where("section","==",section),

where("date","==",date)

);

const snap = await getDocs(q);

snap.forEach((docSnap)=>{

existingAttendance.push({

id:docSnap.id,

...docSnap.data()

});

});

if(existingAttendance.length>0){

isUpdate = true;

saveAttendance.innerHTML =
"✏️ Update Attendance";

}else{

saveAttendance.innerHTML =
"💾 Save Attendance";

}

}

// ======================================
// Load Students
// ======================================

loadStudents.addEventListener("click", async ()=>{

const className =
document.getElementById("className").value;

const section =
document.getElementById("section").value;

const date =
attendanceDate.value;

if(!date){

alert("Please Select Date");

return;

}

if(!className || !section){

alert("Please Select Class & Section");

return;

}

studentList.innerHTML = `
<tr>
<td colspan="3">Loading...</td>
</tr>
`;

await checkExistingAttendance(
className,
section,
date
);

try{

const q = query(

collection(db,"students"),

where("class","==",className),

where("section","==",section)

);

const snap = await getDocs(q);

studentList.innerHTML="";

if(snap.empty){

studentList.innerHTML=`
<tr>
<td colspan="3">
No Students Found
</td>
</tr>
`;

return;

}

snap.forEach((docSnap)=>{

const student = docSnap.data();

let status = "Present";

if(isUpdate){

const old = existingAttendance.find(

x=>x.emis===student.emis

);

if(old){

status = old.status;

}

}

studentList.innerHTML += `

<tr>

<td>${student.emis}</td>

<td>${student.name}</td>

<td>

<select
class="status"
data-emis="${student.emis}">

<option
value="Present"
${status==="Present"?"selected":""}>
Present
</option>

<option
value="Absent"
${status==="Absent"?"selected":""}>
Absent
</option>

</select>

</td>

</tr>

`;

});

}catch(error){

console.error(error);

alert(error.message);

}
  // ======================================
// Save / Update Attendance
// ======================================

saveAttendance.addEventListener("click", async ()=>{

const className =
document.getElementById("className").value;

const section =
document.getElementById("section").value;

const date =
attendanceDate.value;

if(!date || !className || !section){

alert("Please Select Date, Class & Section");

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

// Existing Attendance

const old =
existingAttendance.find(
x=>x.emis===emis
);

if(old){

await updateDoc(

doc(db,"attendance",old.id),

{

status:status,

markedBy:
localStorage.getItem("teacherName") || "Teacher",

createdAt:
serverTimestamp()

}

);

}else{

await addDoc(

collection(db,"attendance"),

{

emis,
studentName,

class:className,

section,

date,

status,

markedBy:
localStorage.getItem("teacherName") || "Teacher",

createdAt:
serverTimestamp()

}

);

}

}

alert(

isUpdate

? "✅ Attendance Updated Successfully"

: "✅ Attendance Saved Successfully"

);

// Refresh
await checkExistingAttendance(
className,
section,
date
);

}catch(error){

console.error(error);

alert(error.message);

}

});

// ======================================
// Default Date = Today
// ======================================

attendanceDate.value =
new Date().toISOString().split("T")[0];

// ======================================
// Module Loaded
// ======================================

console.log("================================");
console.log("School Connect TN");
console.log("Attendance Management V2");
console.log("Duplicate Prevention Enabled");
console.log("================================");
