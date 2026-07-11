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

let attendanceDocs = [];

// Default Date
attendanceDate.value =
new Date().toISOString().split("T")[0];

// ===============================
// Load Students
// ===============================

loadStudents.addEventListener("click", async () => {

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

studentList.innerHTML=`
<tr>
<td colspan="3">Loading...</td>
</tr>
`;

attendanceDocs=[];

try{

// Existing Attendance

const attendanceQuery=query(

collection(db,"attendance"),

where("date","==",date),

where("class","==",className),

where("section","==",section)

);

const attendanceSnap=
await getDocs(attendanceQuery);

attendanceSnap.forEach((d)=>{

attendanceDocs.push({

id:d.id,

...d.data()

});

});

if(attendanceDocs.length>0){

saveAttendance.innerHTML=
"✏️ Update Attendance";

}else{

saveAttendance.innerHTML=
"💾 Save Attendance";

}

// Student List

const studentQuery=query(

collection(db,"students"),

where("class","==",className),

where("section","==",section)

);

const studentSnap=
await getDocs(studentQuery);

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

studentSnap.forEach((docSnap)=>{

const student=docSnap.data();

let status="Present";

const old=attendanceDocs.find(

x=>String(x.emis)===String(student.emis)

);

if(old){

status=old.status;

}

studentList.innerHTML+=`

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

});
// ===============================
// Save / Update Attendance
// ===============================

saveAttendance.addEventListener("click", async () => {

const className =
document.getElementById("className").value;

const section =
document.getElementById("section").value;

const date =
attendanceDate.value;

if (!date || !className || !section) {

alert("Please Select Date, Class & Section");

return;

}

const rows =
document.querySelectorAll("#studentList tr");

if (rows.length === 0) {

alert("No Students Loaded");

return;

}

try {

for (const row of rows) {

const statusSelect =
row.querySelector(".status");

if (!statusSelect) continue;

const emis =
statusSelect.dataset.emis;

const studentName =
row.cells[1].textContent;

const status =
statusSelect.value;

const existing =
attendanceDocs.find(
x => String(x.emis) === String(emis)
);

if (existing) {

// Update Existing Attendance

await updateDoc(

doc(db, "attendance", existing.id),

{

status: status,

markedBy:
localStorage.getItem("teacherName") || "Teacher",

updatedAt:
serverTimestamp()

}

);

} else {

// Save New Attendance

await addDoc(

collection(db, "attendance"),

{

emis,

studentName,

class: className,

section: section,

date: date,

status: status,

markedBy:
localStorage.getItem("teacherName") || "Teacher",

createdAt:
serverTimestamp()

}

);

}

}

alert(
attendanceDocs.length > 0
? "✅ Attendance Updated Successfully"
: "✅ Attendance Saved Successfully"
);

// Reload latest attendance

loadStudents.click();

} catch (error) {

console.error(error);

alert(error.message);

}

});

// ===============================
// Module Loaded
// ===============================

console.log("================================");
console.log("School Connect TN");
console.log("Attendance Management V2");
console.log("Status : Production Ready");
console.log("================================");
