import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
doc,
setDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const studentTable = document.getElementById("studentTable");

const dateInput = document.getElementById("attendanceDate");
const classFilter = document.getElementById("classFilter");
const sectionFilter = document.getElementById("sectionFilter");

dateInput.value = new Date().toISOString().split("T")[0];

let students = [];

window.loadStudents = async function(){

studentTable.innerHTML="";

students=[];

const selectedClass = classFilter.value;
const selectedSection = sectionFilter.value;

if(selectedClass=="" || selectedSection==""){

alert("Please Select Class and Section");

return;

}

const q = query(
collection(db,"students"),
where("class","==",selectedClass),
where("section","==",selectedSection)
);

const snap = await getDocs(q);

if(snap.empty){

studentTable.innerHTML=`
<tr>
<td colspan="3">
No Students Found
</td>
</tr>
`;

return;

}

snap.forEach((d)=>{

const student=d.data();

students.push(student);

studentTable.innerHTML += `

<tr>

<td>${student.name}</td>

<td>${student.emis}</td>

<td>

<select id="${student.emis}">

<option value="Present">Present</option>

<option value="Absent">Absent</option>

<option value="Leave">Leave</option>

</select>

</td>

</tr>

`;

});

}
window.saveAttendance = async function(){

const attendanceDate = dateInput.value;

if(attendanceDate==""){

alert("Please Select Date");

return;

}

let saved = 0;

for(const student of students){

const status = document.getElementById(student.emis).value;

try{

// Latest Attendance (Parent / Student Dashboard)
await updateDoc(
doc(db,"students",student.emis),
{
attendance:status,
lastAttendanceDate:attendanceDate
}
);

// Attendance History
await setDoc(
doc(db,"attendance",attendanceDate,"students",student.emis),
{
emis:student.emis,
name:student.name,
class:student.class,
section:student.section,
status:status,
date:attendanceDate,
updatedAt:new Date().toISOString()
}
);

saved++;

}catch(error){

console.error(error);

}

}

alert("✅ Attendance Saved Successfully\n\nTotal Records : " + saved);

}
