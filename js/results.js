//==========================================
// School Connect TN
// Result Analytics V2
// Part 1
//==========================================

import { db } from "../firebase.js";

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==========================================
// Elements
//==========================================

const academicYear =
document.getElementById("academicYear");

const examType =
document.getElementById("examType");

const medium =
document.getElementById("medium");

const showResults =
document.getElementById("showResults");

const classSummary =
document.getElementById("classSummary");

const resultsContainer =
document.getElementById("resultsContainer");

//==========================================
// Button Event
//==========================================

showResults.addEventListener("click",loadResults);

//==========================================
// Load Results
//==========================================

async function loadResults(){

const year =
academicYear.value;

const exam =
examType.value;

const med =
medium.value;

if(
!year ||
!exam ||
!med
){

alert("Please Select Academic Year, Exam & Medium");

return;

}

classSummary.innerHTML="";

resultsContainer.innerHTML=`
<p style="text-align:center;">
Loading Results...
</p>
`;

try{

const marksQuery=query(

collection(db,"marks",exam,"students"),

where("academicYear","==",year),

where("medium","==",med)

);

const marksSnap=
await getDocs(marksQuery);

if(marksSnap.empty){

classSummary.innerHTML="";

resultsContainer.innerHTML=`
<p style="text-align:center;">
No Results Found
</p>
`;

return;

}
//==========================================
// Overall Summary
//==========================================

let totalStudents = 0;
let passCount = 0;
let failCount = 0;
let totalPercentage = 0;

let topperName = "";
let topperMark = 0;

let html = "";

//==========================================
// Loop Students
//==========================================

marksSnap.forEach((doc)=>{

const data = doc.data();

totalStudents++;

totalPercentage += Number(data.percentage);

if(data.result==="PASS"){

passCount++;

}else{

failCount++;

}

if(Number(data.total)>topperMark){

topperMark = Number(data.total);

topperName = data.name;

}

// Student Card

html += `

<div class="resultCard">

<h3>
Class ${data.class} - ${data.section}
</h3>

<p>
<b>Student :</b>
${data.name}
</p>

<p>
<b>Total :</b>
${data.total}
</p>

<p>
<b>Percentage :</b>
${data.percentage}%
</p>

<p>
<b>Grade :</b>
${data.grade}
</p>

<p>
<b>Result :</b>
${data.result}
</p>

</div>

`;

});

//==========================================
// Calculate Summary
//==========================================

const average =

(totalPercentage/totalStudents).toFixed(2);

const passPercentage =

((passCount/totalStudents)*100).toFixed(2);    
 //==========================================
// Class Summary
//==========================================

const firstStudent =
marksSnap.docs[0].data();

classSummary.innerHTML = `

<div class="classSummaryCard">

<h3>
📚 Class ${firstStudent.class} - ${firstStudent.section}
</h3>

<p><b>Medium :</b> ${med}</p>

<p><b>Academic Year :</b> ${year}</p>

<p><b>Exam :</b> ${exam}</p>

<p><b>Total Students :</b> ${totalStudents}</p>

<p><b>Pass :</b> ${passCount}</p>

<p><b>Fail :</b> ${failCount}</p>

<p><b>Pass Percentage :</b> ${passPercentage}%</p>

<p><b>Average :</b> ${average}%</p>

<p><b>Topper :</b> ${topperName} (${topperMark})</p>

</div>

`;

//==========================================
// Overall Summary
//==========================================

resultsContainer.innerHTML = `

<div class="summaryCard">

<h2>📊 Overall Summary</h2>

<div class="summaryGrid">

<div class="summaryItem">
<h3>${totalStudents}</h3>
<p>Total Students</p>
</div>

<div class="summaryItem">
<h3>${passCount}</h3>
<p>Pass</p>
</div>

<div class="summaryItem">
<h3>${failCount}</h3>
<p>Fail</p>
</div>

<div class="summaryItem">
<h3>${passPercentage}%</h3>
<p>Pass %</p>
</div>

<div class="summaryItem">
<h3>${average}%</h3>
<p>Average</p>
</div>

<div class="summaryItem">
<h3>${topperName}</h3>
<p>Topper (${topperMark})</p>
</div>

</div>

</div>

${html}

`;

}catch(error){

console.error(error);

classSummary.innerHTML="";

resultsContainer.innerHTML=`

<p style="text-align:center;color:red;">

${error.message}

</p>

`;

}

}

console.log("=================================");
console.log("School Connect TN");
console.log("Results Analytics V2 Loaded");
console.log("=================================");   
