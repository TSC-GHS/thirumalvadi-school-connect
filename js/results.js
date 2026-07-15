//==========================================
// School Connect TN
// Result Analytics
//==========================================

import { db } from "../firebase.js";

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const academicYear = document.getElementById("academicYear");
const examType = document.getElementById("examType");
const medium = document.getElementById("medium");
const showResults = document.getElementById("showResults");
const resultsContainer = document.getElementById("resultsContainer");

showResults.addEventListener("click", loadResults);

async function loadResults(){

const year = academicYear.value;
const exam = examType.value;
const med = medium.value;

if(!year || !exam || !med){

alert("Please Select Academic Year, Exam & Medium");
return;

}

resultsContainer.innerHTML =
"<p style='text-align:center'>Loading Results...</p>";

try{

const marksQuery = query(

collection(db,"marks",exam,"students"),

where("academicYear","==",year),
where("medium","==",med)

);

const marksSnap = await getDocs(marksQuery);

if(marksSnap.empty){

resultsContainer.innerHTML =
"<p style='text-align:center'>No Results Found</p>";

return;

}

let html = "";

marksSnap.forEach((doc)=>{

const data = doc.data();

html += `

<div class="resultCard">

<h3>Class ${data.class} - ${data.section}</h3>

<p><b>Student :</b> ${data.name}</p>

<p><b>Total :</b> ${data.total}</p>

<p><b>Percentage :</b> ${data.percentage}%</p>

<p><b>Result :</b> ${data.result}</p>

<p><b>Grade :</b> ${data.grade}</p>

</div>

`;

});

resultsContainer.innerHTML = html;

}catch(error){

console.error(error);

resultsContainer.innerHTML =

`<p style="color:red;text-align:center;">
${error.message}
</p>`;

}

}

console.log("Result Analytics Loaded");
