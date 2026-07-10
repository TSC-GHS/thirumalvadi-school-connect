import { db } from "../firebase.js";

import {
collection,
addDoc,
getDocs,
doc,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const teacherList=document.getElementById("teacherList");

const teacherName=document.getElementById("teacherName");
const teacherId=document.getElementById("teacherId");
const teacherMobile=document.getElementById("teacherMobile");
const teacherEmail=document.getElementById("teacherEmail");
const teacherType=document.getElementById("teacherType");
const teacherSubject=document.getElementById("teacherSubject");
const teacherClass=document.getElementById("teacherClass");
const teacherSection=document.getElementById("teacherSection");
const teacherStatus=document.getElementById("teacherStatus");
const assignedClasses=document.getElementById("assignedClasses");

const saveTeacherBtn=document.getElementById("saveTeacherBtn");
const updateTeacherBtn=document.getElementById("updateTeacherBtn");
const searchTeacher=document.getElementById("searchTeacher");

let editId=null;
let teachers=[];
// ===============================
// Save Teacher
// ===============================

saveTeacherBtn.addEventListener("click", async ()=>{

if(
teacherName.value.trim()==="" ||
teacherId.value.trim()==="" ||
teacherMobile.value.trim()==="" ||
teacherType.value===""
){

alert("Please fill all mandatory fields.");

return;

}

let className="";
let section="";
let assigned=[];

if(teacherType.value==="Class Teacher"){

className=teacherClass.value;
section=teacherSection.value;

if(className==="" || section===""){

alert("Please select Class and Section.");

return;

}

assigned=[`${className}-${section}`];

}else{

assigned=assignedClasses.value
.split(",")
.map(x=>x.trim())
.filter(x=>x!="");

}

await addDoc(collection(db,"teachers"),{

name:teacherName.value.trim(),

id:teacherId.value.trim(),

mobile:teacherMobile.value.trim(),

email:teacherEmail.value.trim(),

teacherType:teacherType.value,

subject:teacherSubject.value.trim(),

className:className,

section:section,

assignedClasses:assigned,

status:teacherStatus.value,

createdAt:new Date().toISOString()

});

alert("✅ Teacher Saved Successfully");

clearForm();

loadTeachers();

});
// ===============================
// Load Teachers
// ===============================

async function loadTeachers(){

teacherList.innerHTML="Loading...";

const snap=await getDocs(collection(db,"teachers"));

teachers=[];

teacherList.innerHTML="";

snap.forEach((d)=>{

teachers.push({

docId:d.id,

...d.data()

});

});

renderTeachers(teachers);

}

// ===============================
// Render Teacher Cards
// ===============================

function renderTeachers(list){

teacherList.innerHTML="";

if(list.length===0){

teacherList.innerHTML="<p>No Teachers Found</p>";

return;

}

list.forEach((t)=>{

teacherList.innerHTML+=`

<div class="teacherCard">

<h4>${t.name}</h4>

<div class="teacherInfo">

<b>ID :</b> ${t.id}

</div>

<div class="teacherInfo">

<b>Mobile :</b> ${t.mobile}

</div>

<div class="teacherInfo">

<b>Email :</b> ${t.email||"-"}

</div>

<div class="teacherInfo">

<b>Type :</b> ${t.teacherType}

</div>

<div class="teacherInfo">

<b>Subject :</b> ${t.subject}

</div>

<div class="teacherInfo">

<b>Class :</b>

${t.className||"-"}

${t.section||""}

</div>

<div class="teacherInfo">

<b>Status :</b>

<span class="${
t.status==="Active"
?
"statusActive"
:
"statusInactive"
}">

${t.status}

</span>

</div>

<div class="teacherActions">

<button
class="editBtn"
onclick="editTeacher('${t.docId}')">

✏️ Edit

</button>

<button
class="deleteBtn"
onclick="deleteTeacher('${t.docId}')">

🗑 Delete

</button>

</div>

</div>

`;

});

}
// ===============================
// Search Teacher
// ===============================

searchTeacher.addEventListener("input",()=>{

const keyword=searchTeacher.value.toLowerCase().trim();

const filtered=teachers.filter((t)=>{

return(
(t.name||"").toLowerCase().includes(keyword) ||
(t.id||"").toLowerCase().includes(keyword) ||
(t.subject||"").toLowerCase().includes(keyword)
);

});

renderTeachers(filtered);

});

// ===============================
// Edit Teacher
// ===============================

window.editTeacher=function(docId){

const t=teachers.find(x=>x.docId===docId);

if(!t) return;

editId=docId;

teacherName.value=t.name||"";
teacherId.value=t.id||"";
teacherMobile.value=t.mobile||"";
teacherEmail.value=t.email||"";
teacherType.value=t.teacherType||"";
teacherSubject.value=t.subject||"";
teacherClass.value=t.className||"";
teacherSection.value=t.section||"";
teacherStatus.value=t.status||"Active";

assignedClasses.value=
(t.assignedClasses||[]).join(",");

updateTeacherBtn.style.display="block";

window.scrollTo({
top:0,
behavior:"smooth"
});

};

// ===============================
// Update Teacher
// ===============================

updateTeacherBtn.addEventListener("click",async()=>{

if(!editId){

alert("Select a teacher first.");

return;

}

let assigned=[];

if(teacherType.value==="Class Teacher"){

assigned=[
`${teacherClass.value}-${teacherSection.value}`
];

}else{

assigned=assignedClasses.value
.split(",")
.map(x=>x.trim())
.filter(x=>x!="");

}

await updateDoc(doc(db,"teachers",editId),{

name:teacherName.value.trim(),

id:teacherId.value.trim(),

mobile:teacherMobile.value.trim(),

email:teacherEmail.value.trim(),

teacherType:teacherType.value,

subject:teacherSubject.value.trim(),

className:teacherClass.value,

section:teacherSection.value,

assignedClasses:assigned,

status:teacherStatus.value,

updatedAt:new Date().toISOString()

});

alert("✅ Teacher Updated Successfully");

clearForm();

loadTeachers();

});
// ===============================
// Delete Teacher
// ===============================

window.deleteTeacher = async function(docId){

const ok = confirm("Are you sure you want to delete this teacher?");

if(!ok) return;

try{

await deleteDoc(doc(db,"teachers",docId));

alert("🗑 Teacher Deleted Successfully");

loadTeachers();

}catch(error){

console.error(error);

alert(error.message);

}

};

// ===============================
// Clear Form
// ===============================

function clearForm(){

editId = null;

teacherName.value = "";
teacherId.value = "";
teacherMobile.value = "";
teacherEmail.value = "";
teacherType.value = "";
teacherSubject.value = "";
teacherClass.value = "";
teacherSection.value = "";
teacherStatus.value = "Active";
assignedClasses.value = "";

updateTeacherBtn.style.display = "none";

toggleTeacherFields();

}

// ===============================
// Teacher Type Logic
// ===============================

function toggleTeacherFields(){

if(teacherType.value==="Class Teacher"){

teacherClass.disabled = false;
teacherSection.disabled = false;
assignedClasses.disabled = true;
assignedClasses.value = "";

}else if(teacherType.value==="Subject Teacher"){

teacherClass.disabled = true;
teacherSection.disabled = true;

teacherClass.value = "";
teacherSection.value = "";

assignedClasses.disabled = false;

}else{

teacherClass.disabled = false;
teacherSection.disabled = false;
assignedClasses.disabled = false;

}

}

teacherType.addEventListener("change",toggleTeacherFields);

// ===============================
// Initial Load
// ===============================

updateTeacherBtn.style.display = "none";

toggleTeacherFields();

loadTeachers();
