//==================================================
// School Connect TN
// Homework Analytics
//==================================================

import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Elements
//==================================================

const totalHomework=document.getElementById("totalHomework");
const todayHomework=document.getElementById("todayHomework");
const teacherCount=document.getElementById("teacherCount");
const classCount=document.getElementById("classCount");

const teacherWise=document.getElementById("teacherWise");
const classWise=document.getElementById("classWise");
const latestHomework=document.getElementById("latestHomework");

//==================================================

loadHomeworkAnalytics();

async function loadHomeworkAnalytics(){

try{

const snap=await getDocs(collection(db,"homework"));

if(snap.empty){

totalHomework.textContent="0";
todayHomework.textContent="0";
teacherCount.textContent="0";
classCount.textContent="0";

teacherWise.innerHTML="<p>No Homework Found</p>";
classWise.innerHTML="<p>No Homework Found</p>";
latestHomework.innerHTML="<p>No Homework Found</p>";

return;

}

const list=[];

snap.forEach(doc=>{

list.push(doc.data());

});

totalHomework.textContent=list.length;

// Today's Homework

const today=new Date().toISOString().split("T")[0];

const todayCount=list.filter(item=>item.dueDate===today).length;

todayHomework.textContent=todayCount;

// Teacher Wise

const teacherMap={};

// Class Wise

const classMap={};

list.forEach(item=>{

const teacher=item.teacherName || "Unknown";

teacherMap[teacher]=(teacherMap[teacher]||0)+1;

const cls=`${item.className||"-"}-${item.section||"-"}`;

classMap[cls]=(classMap[cls]||0)+1;

});

teacherCount.textContent=Object.keys(teacherMap).length;

classCount.textContent=Object.keys(classMap).length;

// Teacher UI

let teacherHTML="";

Object.entries(teacherMap).forEach(([name,count])=>{

teacherHTML+=`

<div class="item">

<span>👨‍🏫 ${name}</span>

<span>${count}</span>

</div>

`;

});

teacherWise.innerHTML=teacherHTML;

// Class UI

let classHTML="";

Object.entries(classMap).forEach(([cls,count])=>{

classHTML+=`

<div class="item">

<span>🏫 ${cls}</span>

<span>${count}</span>

</div>

`;

});

classWise.innerHTML=classHTML;

// Latest Homework

list.sort((a,b)=>{

const t1=a.createdAt?.seconds||0;

const t2=b.createdAt?.seconds||0;

return t2-t1;

});

let latestHTML="";

list.slice(0,10).forEach(item=>{

latestHTML+=`

<div class="item">

<div>

<b>${item.subject||"-"}</b><br>

Class : ${item.className||"-"}-${item.section||"-"}<br>

${item.title||item.description||"-"}

</div>

<div>

${item.dueDate||"-"}

</div>

</div>

`;

});

latestHomework.innerHTML=latestHTML;

}catch(error){

console.error(error);

teacherWise.innerHTML="<p>"+error.message+"</p>";

classWise.innerHTML="<p>"+error.message+"</p>";

latestHomework.innerHTML="<p>"+error.message+"</p>";

}

}

console.log("Homework Analytics Loaded");
