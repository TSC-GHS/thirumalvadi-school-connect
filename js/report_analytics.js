//==================================================
// School Connect TN
// Headmaster Report Analytics V1
//==================================================

import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Dashboard Elements
//==================================================

const totalStudents =
document.getElementById("totalStudents");

const passStudents =
document.getElementById("passStudents");

const failStudents =
document.getElementById("failStudents");

const passPercentage =
document.getElementById("passPercentage");

const subjectPerformance =
document.getElementById("subjectPerformance");

const classResults =
document.getElementById("classResults");

const topRankers =
document.getElementById("topRankers");

const highestScorer =
document.getElementById("highestScorer");

const bestClass =
document.getElementById("bestClass");

const lowestClass =
document.getElementById("lowestClass");

const schoolAverage =
document.getElementById("schoolAverage");

//==================================================
// Default Settings
//==================================================

const selectedExam = "Half Yearly";

//==================================================

loadAnalytics();

//==================================================

async function loadAnalytics(){

try{

showLoading();

//==================================
// Read Marks
//==================================

const snap = await getDocs(

collection(
db,
"marks",
selectedExam,
"students"
)

);

if(snap.empty){

showNoData();

return;

}

const students = [];

snap.forEach((doc)=>{

students.push(doc.data());

});
//==================================================
// Overall Summary
//==================================================

let total = students.length;

let pass = 0;
let fail = 0;

let totalPercentage = 0;

let topperName = "-";
let topperMark = 0;

// Subject Totals

let tamilTotal = 0;
let englishTotal = 0;
let mathsTotal = 0;
let scienceTotal = 0;
let socialTotal = 0;

// Class Analytics

let classWise = {};

students.forEach((s)=>{

const percentage =
Number(s.percentage || 0);

totalPercentage += percentage;

if((s.result || "").toUpperCase() === "PASS"){

pass++;

}else{

fail++;

}

// Topper

if(Number(s.total || 0) > topperMark){

topperMark = Number(s.total);

topperName = s.name;

}

// Subject Totals

tamilTotal += Number(s.tamil || 0);

englishTotal += Number(s.english || 0);

mathsTotal += Number(s.maths || 0);

scienceTotal += Number(s.science || 0);

socialTotal += Number(s.social || 0);

// Class Wise

const cls =
`${s.class}-${s.section}`;

if(!classWise[cls]){

classWise[cls]={

students:0,

percentage:0

};

}

classWise[cls].students++;

classWise[cls].percentage += percentage;

});

//==================================================
// Dashboard Cards
//==================================================

totalStudents.textContent = total;

passStudents.textContent = pass;

failStudents.textContent = fail;

passPercentage.textContent =
((pass/total)*100).toFixed(1)+"%";

schoolAverage.textContent =
(totalPercentage/total).toFixed(1)+"%";

highestScorer.textContent =
`${topperName} (${topperMark})`;

//==================================================
// Subject Analytics
//==================================================

subjectPerformance.innerHTML = `

<div class="item">
<span>📘 Tamil</span>
<span>${(tamilTotal/total).toFixed(1)}%</span>
</div>

<div class="item">
<span>📗 English</span>
<span>${(englishTotal/total).toFixed(1)}%</span>
</div>

<div class="item">
<span>📙 Maths</span>
<span>${(mathsTotal/total).toFixed(1)}%</span>
</div>

<div class="item">
<span>📕 Science</span>
<span>${(scienceTotal/total).toFixed(1)}%</span>
</div>

<div class="item">
<span>📒 Social</span>
<span>${(socialTotal/total).toFixed(1)}%</span>
</div>

`;

//==================================================
// Class Wise Analytics
//==================================================

let classHTML = "";

let bestClassName = "-";
let lowestClassName = "-";

let bestAverage = -1;
let lowestAverage = 101;

Object.keys(classWise)
.sort()
.forEach((cls)=>{

const avg =
classWise[cls].percentage /
classWise[cls].students;

classHTML += `

<div class="item">

<span>${cls}</span>

<span>${avg.toFixed(1)}%</span>

</div>

`;

if(avg > bestAverage){

bestAverage = avg;
bestClassName = cls;

}

if(avg < lowestAverage){

lowestAverage = avg;
lowestClassName = cls;

}

});

classResults.innerHTML = classHTML;

//==================================================
// School Highlights
//==================================================

bestClass.textContent =
`${bestClassName} (${bestAverage.toFixed(1)}%)`;

lowestClass.textContent =
`${lowestClassName} (${lowestAverage.toFixed(1)}%)`;

//==================================================
// Top Rank Holders
//==================================================

students.sort((a,b)=>
Number(b.total||0)-Number(a.total||0)
);

let rankHTML = "";

students.slice(0,10).forEach((student,index)=>{

rankHTML += `

<div class="item">

<span>

${index+1}. ${student.name}

</span>

<span>

${student.total}

</span>

</div>

`;

});

topRankers.innerHTML = rankHTML;

//==================================================
// End
//==================================================

console.log("Report Analytics Loaded Successfully");
//

}catch(error){

console.error(error);

document.body.innerHTML = `
<div style="
padding:20px;
font-size:18px;
color:red;
white-space:pre-wrap;
font-family:monospace;
">
${error.stack}
</div>
`;

}

}

//==================================================
// Loading
//==================================================

function showLoading(){

totalStudents.textContent="...";

passStudents.textContent="...";

failStudents.textContent="...";

passPercentage.textContent="...";

schoolAverage.textContent="...";

highestScorer.textContent="Loading...";

bestClass.textContent="Loading...";

lowestClass.textContent="Loading...";

subjectPerformance.innerHTML=
"<p style='text-align:center'>Loading...</p>";

classResults.innerHTML=
"<p style='text-align:center'>Loading...</p>";

topRankers.innerHTML=
"<p style='text-align:center'>Loading...</p>";

}

//==================================================
// No Data
//==================================================

function showNoData(){

subjectPerformance.innerHTML=
"<p style='text-align:center'>No Results Found</p>";

classResults.innerHTML=
"<p style='text-align:center'>No Results Found</p>";

topRankers.innerHTML=
"<p style='text-align:center'>No Results Found</p>";
}
