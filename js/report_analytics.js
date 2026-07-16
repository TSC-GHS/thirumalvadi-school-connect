import { db } from "../firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const selectedExam = "Half Yearly";

const totalStudents = document.getElementById("totalStudents");
const passStudents = document.getElementById("passStudents");
const failStudents = document.getElementById("failStudents");
const passPercentage = document.getElementById("passPercentage");

const highestScorer = document.getElementById("highestScorer");
const bestClass = document.getElementById("bestClass");
const lowestClass = document.getElementById("lowestClass");
const schoolAverage = document.getElementById("schoolAverage");

const subjectPerformance = document.getElementById("subjectPerformance");
const classResults = document.getElementById("classResults");
const topRankers = document.getElementById("topRankers");

loadAnalytics();

async function loadAnalytics(){

try{

const snap = await getDocs(
collection(db,"marks",selectedExam,"students")
);

if(snap.empty){

subjectPerformance.innerHTML="<p>No Results Available</p>";
classResults.innerHTML="<p>No Results Available</p>";
topRankers.innerHTML="<p>No Results Available</p>";

return;

}

const students=[];

snap.forEach(doc=>{

students.push({
id:doc.id,
...doc.data()
});

});

let pass=0;
let fail=0;

let totalPercent=0;

let topperName="-";
let topperMarks=0;

let tamil=0;
let english=0;
let maths=0;
let science=0;
let social=0;

const classWise={};

students.forEach(s=>{

const percentage=Number(s.percentage||0);

totalPercent+=percentage;

if((s.result||"").toUpperCase()=="PASS"){

pass++;

}else{

fail++;

}

if(Number(s.total||0)>topperMarks){

topperMarks=Number(s.total||0);

topperName=s.name||s.id;

}

tamil+=Number(s.tamil||0);
english+=Number(s.english||0);
maths+=Number(s.maths||0);
science+=Number(s.science||0);
social+=Number(s.social||0);

const cls=`${s.class}-${s.section}`;

if(!classWise[cls]){

classWise[cls]={
students:0,
percentage:0
};

}

classWise[cls].students++;
classWise[cls].percentage+=percentage;

});

const total=students.length;

totalStudents.textContent=total;
passStudents.textContent=pass;
failStudents.textContent=fail;

passPercentage.textContent=((pass/total)*100).toFixed(1)+"%";

schoolAverage.textContent=(totalPercent/total).toFixed(1)+"%";

highestScorer.textContent=`${topperName} (${topperMarks})`;

subjectPerformance.innerHTML=`
<div class="item"><span>Tamil</span><span>${(tamil/total).toFixed(1)}%</span></div>
<div class="item"><span>English</span><span>${(english/total).toFixed(1)}%</span></div>
<div class="item"><span>Maths</span><span>${(maths/total).toFixed(1)}%</span></div>
<div class="item"><span>Science</span><span>${(science/total).toFixed(1)}%</span></div>
<div class="item"><span>Social</span><span>${(social/total).toFixed(1)}%</span></div>
`;

let bestAvg=-1;
let lowAvg=101;

let best="-";
let low="-";

classResults.innerHTML="";

Object.keys(classWise).sort().forEach(cls=>{

const avg=classWise[cls].percentage/classWise[cls].students;

classResults.innerHTML+=`
<div class="item">
<span>${cls}</span>
<span>${avg.toFixed(1)}%</span>
</div>
`;

if(avg>bestAvg){

bestAvg=avg;
best=cls;

}

if(avg<lowAvg){

lowAvg=avg;
low=cls;

}

});

bestClass.textContent=`${best} (${bestAvg.toFixed(1)}%)`;
lowestClass.textContent=`${low} (${lowAvg.toFixed(1)}%)`;

students.sort((a,b)=>
Number(b.total||0)-Number(a.total||0)
);

topRankers.innerHTML="";

students.slice(0,10).forEach((s,index)=>{

topRankers.innerHTML+=`
<div class="item">
<span>${index+1}. ${s.name}</span>
<span>${s.total}</span>
</div>
`;

});

}catch(error){

console.error(error);

document.body.innerHTML=`
<div style="
padding:20px;
font-size:18px;
color:red;
font-family:monospace;
white-space:pre-wrap;
">
${error.stack}
</div>
`;

}

}
