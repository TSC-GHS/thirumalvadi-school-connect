import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//=====================================
// Elements
//=====================================

const totalStudents=document.getElementById("totalStudents");
const passStudents=document.getElementById("passStudents");
const failStudents=document.getElementById("failStudents");
const passPercentage=document.getElementById("passPercentage");

const subjectPerformance=document.getElementById("subjectPerformance");
const classResults=document.getElementById("classResults");
const topRankers=document.getElementById("topRankers");

const highestScorer=document.getElementById("highestScorer");
const bestClass=document.getElementById("bestClass");
const lowestClass=document.getElementById("lowestClass");
const schoolAverage=document.getElementById("schoolAverage");

//=====================================

loadReportAnalytics();

//=====================================

async function loadReportAnalytics(){

try{

const exams=[
"Unit Test",
"Quarterly",
"Half Yearly",
"Annual"
];

let allStudents=[];

// Load all exams

for(const exam of exams){

const snap=await getDocs(
collection(db,"marks",exam,"students")
);

snap.forEach(doc=>{

const data=doc.data();

data.exam=exam;

allStudents.push(data);

});

}

if(allStudents.length===0){

alert("No Results Available");

return;

}

//=====================================
// Overall Summary
//=====================================

const total=allStudents.length;

let pass=0;
let fail=0;

let totalPercentage=0;

let topper="";

let topperMark=0;

// Subject Totals

let tamil=0;
let english=0;
let maths=0;
let science=0;
let social=0;

// Class Wise

const classWise={};

allStudents.forEach(s=>{

if((s.result||"").toUpperCase()=="PASS"){

pass++;

}else{

fail++;

}

totalPercentage+=Number(s.percentage||0);

tamil+=Number(s.tamil||0);
english+=Number(s.english||0);
maths+=Number(s.maths||0);
science+=Number(s.science||0);
social+=Number(s.social||0);

if(Number(s.total)>topperMark){

topperMark=Number(s.total);

topper=s.name;

}

const cls=`${s.class}-${s.section}`;

if(!classWise[cls]){

classWise[cls]={

students:0,

pass:0,

percentage:0

};

}

classWise[cls].students++;

classWise[cls].percentage+=Number(s.percentage||0);

if((s.result||"").toUpperCase()=="PASS"){

classWise[cls].pass++;

}

});

//=====================================
// Summary Cards
//=====================================

totalStudents.textContent=total;
passStudents.textContent=pass;
failStudents.textContent=fail;

passPercentage.textContent=
((pass/total)*100).toFixed(1)+"%";

schoolAverage.textContent=
(totalPercentage/total).toFixed(1)+"%";

highestScorer.textContent=
`${topper} (${topperMark})`;

//=====================================
// Subject Performance
//=====================================

subjectPerformance.innerHTML=`

<div class="item">
<span>Tamil</span>
<span>${(tamil/total).toFixed(1)}%</span>
</div>

<div class="item">
<span>English</span>
<span>${(english/total).toFixed(1)}%</span>
</div>

<div class="item">
<span>Maths</span>
<span>${(maths/total).toFixed(1)}%</span>
</div>

<div class="item">
<span>Science</span>
<span>${(science/total).toFixed(1)}%</span>
</div>

<div class="item">
<span>Social</span>
<span>${(social/total).toFixed(1)}%</span>
</div>

`;

//=====================================
// Class Wise
//=====================================

let classHTML="";

let best="-";
let low="-";

let bestValue=0;
let lowValue=101;

Object.keys(classWise).sort().forEach(cls=>{

const avg=

classWise[cls].percentage/

classWise[cls].students;

if(avg>bestValue){

bestValue=avg;

best=cls;

}

if(avg<lowValue){

lowValue=avg;

low=cls;

}

classHTML+=`

<div class="item">

<span>${cls}</span>

<span>${avg.toFixed(1)}%</span>

</div>

`;

});

classResults.innerHTML=classHTML;

bestClass.textContent=
`${best} (${bestValue.toFixed(1)}%)`;

lowestClass.textContent=
`${low} (${lowValue.toFixed(1)}%)`;

//=====================================
// Top Rankers
//=====================================

allStudents.sort((a,b)=>b.total-a.total);

let rankHTML="";

allStudents.slice(0,10).forEach((s,index)=>{

rankHTML+=`

<div class="item">

<span>

${index+1}. ${s.name}

</span>

<span>

${s.total}

</span>

</div>

`;

});

topRankers.innerHTML=rankHTML;

}catch(error){

console.error(error);

alert(error.message);

document.body.innerHTML = `
<h2 style="color:red;text-align:center;">
${error.message}
</h2>
`;

}

}

console.log("Report Analytics Loaded");
