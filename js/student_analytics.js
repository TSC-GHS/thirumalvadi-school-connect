import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const totalStudents =
document.getElementById("totalStudents");

const boysCount =
document.getElementById("boysCount");

const girlsCount =
document.getElementById("girlsCount");

const classCount =
document.getElementById("classCount");

const classList =
document.getElementById("classList");

async function loadAnalytics(){

try{

const snap =
await getDocs(collection(db,"students"));

let total=0;

let tamil=0;

let english=0;

const classWise={};

snap.forEach((doc)=>{

const student=doc.data();

if(student.status==="TC") return;

total++;

if(student.medium==="Tamil"){

tamil++;

}

if(student.medium==="English"){

english++;

}

const key=
`${student.class}-${student.section}`;

if(!classWise[key]){

classWise[key]=0;

}

classWise[key]++;

});

totalStudents.textContent=total;

boysCount.textContent=tamil;

girlsCount.textContent=english;

classCount.textContent=
Object.keys(classWise).length;

let html="";

Object.keys(classWise)
.sort()
.forEach((cls)=>{

html+=`

<div class="classItem">

<div>

<b>${cls}</b>

</div>

<div>

${classWise[cls]} Students

</div>

</div>

`;

});

classList.innerHTML=html;

}catch(error){

console.error(error);

alert(error.message);

}

}

loadAnalytics();

console.log("Student Analytics Loaded");
