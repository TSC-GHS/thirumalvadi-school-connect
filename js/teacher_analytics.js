import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Dashboard Elements

const totalTeachers = document.getElementById("totalTeachers");
const activeTeachers = document.getElementById("activeTeachers");
const classTeachers = document.getElementById("classTeachers");
const totalSubjects = document.getElementById("totalSubjects");

const teacherList = document.getElementById("teacherList");

loadAnalytics();

async function loadAnalytics(){

try{

const snap = await getDocs(collection(db,"teachers"));

let total = 0;
let active = 0;
let classTeacher = 0;

const subjects = new Set();

let html = "";

snap.forEach(doc=>{

const t = doc.data();

total++;

if((t.status || "").toLowerCase()=="active"){
active++;
}

if((t.classTeacher || "").toLowerCase()=="yes"){
classTeacher++;
}

if(t.subject){
subjects.add(t.subject);
}

html += `

<div class="teacherItem">

<h4>👨‍🏫 ${t.name || "-"}</h4>

<p><b>Teacher ID :</b> ${t.teacherId || "-"}</p>

<p><b>Subject :</b> ${t.subject || "-"}</p>

<p><b>Class Teacher :</b> ${t.class || "-"} ${t.section || ""}</p>

<p><b>Status :</b> ${t.status || "-"}</p>

</div>

`;

});

totalTeachers.textContent = total;
activeTeachers.textContent = active;
classTeachers.textContent = classTeacher;
totalSubjects.textContent = subjects.size;

teacherList.innerHTML = html || "<p>No Teachers Found</p>";

}catch(err){

console.error(err);

teacherList.innerHTML =
"<p style='color:red'>Unable to load teacher analytics.</p>";

}

}

console.log("Teacher Analytics Loaded");
