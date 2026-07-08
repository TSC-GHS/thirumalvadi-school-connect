import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const marksTable = document.getElementById("marksTable");

let students = [];

window.loadStudents = async function(){

marksTable.innerHTML = "";

students = [];

const selectedClass = document.getElementById("classFilter").value;
const selectedSection = document.getElementById("sectionFilter").value;
const examType = document.getElementById("examType").value;

if(selectedClass=="" || selectedSection=="" || examType==""){

alert("Please Select Exam, Class and Section");

return;

}

const q = query(

collection(db,"students"),

where("class","==",selectedClass),

where("section","==",selectedSection)

);

const snap = await getDocs(q);

if(snap.empty){

marksTable.innerHTML = `
<tr>
<td colspan="6">
No Students Found
</td>
</tr>
`;

return;

}
snap.forEach((docSnap)=>{

const student = docSnap.data();

students.push(student);

marksTable.innerHTML += `

<tr>

<td>${student.name}</td>

<td><input type="number" id="tam_${student.emis}" min="0" max="100" value="0"></td>

<td><input type="number" id="eng_${student.emis}" min="0" max="100" value="0"></td>

<td><input type="number" id="mat_${student.emis}" min="0" max="100" value="0"></td>

<td><input type="number" id="sci_${student.emis}" min="0" max="100" value="0"></td>

<td><input type="number" id="soc_${student.emis}" min="0" max="100" value="0"></td>

</tr>

`;

});

}

window.saveMarks = function(){

if(students.length===0){

alert("Load Students First");

return;

}

alert("✅ Marks Entry Ready\n\nPart 3-ல் Firebase Save சேர்க்கப்படும்.");

}
import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

window.saveMarks = async function(){

if(students.length===0){

alert("Load Students First");

return;

}

const examType = document.getElementById("examType").value;

let saved = 0;

for(const student of students){

const tamil = Number(document.getElementById(`tam_${student.emis}`).value);
const english = Number(document.getElementById(`eng_${student.emis}`).value);
const maths = Number(document.getElementById(`mat_${student.emis}`).value);
const science = Number(document.getElementById(`sci_${student.emis}`).value);
const social = Number(document.getElementById(`soc_${student.emis}`).value);

const total = tamil + english + maths + science + social;

const percentage = (total/5).toFixed(2);

let grade="E";

if(percentage>=90) grade="A+";
else if(percentage>=80) grade="A";
else if(percentage>=70) grade="B+";
else if(percentage>=60) grade="B";
else if(percentage>=50) grade="C";
else if(percentage>=35) grade="D";

await setDoc(

doc(db,"marks",examType,"students",student.emis),

{

emis:student.emis,

name:student.name,

class:student.class,

section:student.section,

exam:examType,

tamil:tamil,

english:english,

maths:maths,

science:science,

social:social,

total:total,

percentage:Number(percentage),

grade:grade,

updatedAt:new Date().toISOString()

}

);

saved++;

}

alert("✅ Marks Saved Successfully\n\nRecords : "+saved);

}
