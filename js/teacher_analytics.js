import { db } from "../firebase.js";

import {
collection,
getDocs,
doc,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Dashboard Elements

const totalTeachers = document.getElementById("totalTeachers");
const activeTeachers = document.getElementById("activeTeachers");
const classTeachers = document.getElementById("classTeachers");
const totalSubjects = document.getElementById("totalSubjects");

const teacherList = document.getElementById("teacherList");

const searchTeacher =
document.getElementById("searchTeacher");

if(searchTeacher){

searchTeacher.addEventListener("input",()=>{

const value =
searchTeacher.value.toLowerCase();

const cards =
document.querySelectorAll(".teacherItem");

cards.forEach(card=>{

const text =
card.innerText.toLowerCase();

card.style.display =
text.includes(value)
? "block"
: "none";

});

});

}
async function loadAnalytics(){

try{

const snap = await getDocs(collection(db,"teachers"));

let total = 0;
let active = 0;
let classTeacher = 0;

const subjects = new Set();

let html = "";
snap.forEach(docSnap=>{

const t = docSnap.data();
const t = doc.data();

total++;

if((t.status || "").toLowerCase()=="active"){
active++;
}

if((t.teacherType || "").toLowerCase().includes("class")){
classTeacher++;
}

if(t.subject){
subjects.add(t.subject);
}

html += `

<div class="teacherItem">

<h3>👨‍🏫 ${t.name || "-"}</h3>

<p><b>Teacher ID :</b> ${t.id || "-"}</p>

<p>

<b>Subject :</b>

<select id="subject_${docSnap.id}">

<option ${t.subject=="Tamil"?"selected":""}>Tamil</option>
<option ${t.subject=="English"?"selected":""}>English</option>
<option ${t.subject=="Maths"?"selected":""}>Maths</option>
<option ${t.subject=="Science"?"selected":""}>Science</option>
<option ${t.subject=="Social Science"?"selected":""}>Social Science</option>

</select>

</p>

<p>

<b>Teacher Type :</b>

<select id="type_${docSnap.id}">

<option value="Subject Teacher"
${t.teacherType=="Subject Teacher"?"selected":""}>
Subject Teacher
</option>

<option value="Class Teacher"
${t.teacherType=="Class Teacher"?"selected":""}>
Class Teacher
</option>

</select>

</p>

<p>

<b>Class :</b>

<input
type="text"
id="class_${docSnap.id}"
value="${t.className || ""}"
placeholder="Ex : 9">

<b>Section :</b>

<input
type="text"
id="section_${docSnap.id}"
value="${t.section || ""}"
placeholder="A">

</p>

<p>

<b>Status :</b>

<select id="status_${docSnap.id}">

<option value="Active"
${t.status=="Active"?"selected":""}>
Active
</option>

<option value="Inactive"
${t.status=="Inactive"?"selected":""}>
Inactive
</option>

</select>

</p>

<div style="margin-top:10px;">

<button onclick="updateTeacher('${docSnap.id}')">

💾 Save

</button>

<button onclick="deleteTeacher('${docSnap.id}')">

🗑 Delete

</button>

</div>

</div>

`;

});

totalTeachers.textContent = total;
activeTeachers.textContent = active;
classTeachers.textContent = classTeacher;
totalSubjects.textContent = subjects.size;

teacherList.innerHTML = html || "<p>No Teachers Found</p>";

}catch(err){

console.error("Teacher Analytics Error:", err);

alert(err.message);

teacherList.innerHTML =
`<p style="color:red">
${err.message}
</p>`;

}

}

console.log("Teacher Analytics Loaded");
//==========================================
// Update Teacher
//==========================================

window.updateTeacher = async function(docId){

try{

const subject =
document.getElementById("subject_"+docId).value;

const teacherType =
document.getElementById("type_"+docId).value;

const className =
document.getElementById("class_"+docId).value.trim();

const section =
document.getElementById("section_"+docId).value.trim();

const status =
document.getElementById("status_"+docId).value;

await updateDoc(doc(db,"teachers",docId),{

subject,

teacherType,

className,

section,

status

});

alert("✅ Teacher Updated Successfully");

loadAnalytics();
console.log("Teacher Analytics Loaded");
}catch(error){

console.error(error);

alert(error.message);

}

};

//==========================================
// Delete Teacher
//==========================================

window.deleteTeacher = async function(docId){

const ok = confirm("Delete this Teacher?");

if(!ok) return;

try{

await deleteDoc(doc(db,"teachers",docId));

alert("✅ Teacher Deleted");

loadAnalytics();

}catch(error){

console.error(error);

alert(error.message);

}

};
