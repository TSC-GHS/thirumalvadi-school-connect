import { db } from "../firebase.js";

import {
collection,
getDocs,
doc,
updateDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const studentTable=document.getElementById("studentTable");

let students=[];

window.loadStudents=async function(){

studentTable.innerHTML="";

students=[];

const snap=await getDocs(collection(db,"students"));

snap.forEach((d)=>{

const student=d.data();

students.push(student);

studentTable.innerHTML+=`

<tr>

<td>${student.name}</td>

<td>${student.class}-${student.section}</td>

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

const today = new Date().toISOString().split("T")[0];

for(const student of students){

const status = document.getElementById(student.emis).value;

await updateDoc(
doc(db,"students",student.emis),
{
attendance:status
}
);

await setDoc(
doc(db,"attendance",today,"students",student.emis),
{
emis:student.emis,
name:student.name,
class:student.class,
section:student.section,
status:status,
date:today,
updatedAt:new Date().toISOString()
}
);

}

alert("✅ Attendance Saved Successfully");

}

loadStudents();
