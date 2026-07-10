import { auth, db } from "../firebase.js";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// ======================================
// School Connect TN
// Leave Management V2
// ======================================

// Elements

const leaveList =
document.getElementById("leaveList");

const pendingCount =
document.getElementById("pendingCount");

const approvedCount =
document.getElementById("approvedCount");

const rejectedCount =
document.getElementById("rejectedCount");

const totalCount =
document.getElementById("totalCount");

const searchStudent =
document.getElementById("searchStudent");

const statusFilter =
document.getElementById("statusFilter");

const classFilter =
document.getElementById("classFilter");

const sectionFilter =
document.getElementById("sectionFilter");

const selectAll =
document.getElementById("selectAll");

const approveSelected =
document.getElementById("approveSelected");

const rejectSelected =
document.getElementById("rejectSelected");

// ======================================

let leaveRequests = [];

let currentTeacher = null;

// ======================================
// Load Current Teacher
// ======================================

async function loadTeacher(){

const teacherId =
localStorage.getItem("teacherId");

if(!teacherId){

alert("Session Expired");

location.href="index.html";

return false;

}

const teacherDoc =
await getDocs(

query(

collection(db,"teachers"),

where("id","==",teacherId)

)

);

if(teacherDoc.empty){

alert("Teacher Profile Not Found");

location.href="index.html";

return false;

}

currentTeacher =
teacherDoc.docs[0].data();

return true;

}
// ======================================
// Load Leave Requests
// ======================================

async function loadLeaveRequests(){

const loaded = await loadTeacher();

if(!loaded) return;

leaveRequests = [];

let leaveQuery;

// Subject Teacher -> No Approval

if(currentTeacher.teacherType==="Subject Teacher"){

leaveList.innerHTML=
"<h3>No Leave Approval Permission</h3>";

return;

}

// Class Teacher

leaveQuery = query(

collection(db,"leave_requests"),

where("class","==",currentTeacher.className),

where("section","==",currentTeacher.section)

);

const snap = await getDocs(leaveQuery);

snap.forEach((docSnap)=>{

leaveRequests.push({

id:docSnap.id,

...docSnap.data()

});

});

renderLeaveList();

}
// ======================================
// Render Leave List
// ======================================

function renderLeaveList() {

let pending = 0;
let approved = 0;
let rejected = 0;

leaveList.innerHTML = "";

const keyword =
searchStudent.value.trim().toLowerCase();

leaveRequests.forEach((leave)=>{

if(leave.status==="Pending") pending++;
if(leave.status==="Approved") approved++;
if(leave.status==="Rejected") rejected++;

if(keyword){

const student =
(leave.studentName || "").toLowerCase();

const emis =
(leave.emis || "").toLowerCase();

if(
!student.includes(keyword) &&
!emis.includes(keyword)
){
return;
}

}

if(
statusFilter.value !== "All" &&
leave.status !== statusFilter.value
){
return;
}

leaveList.innerHTML += `

<div class="leaveCard">

<h3>${leave.studentName}</h3>

<p><b>EMIS :</b> ${leave.emis}</p>

<p><b>Class :</b> ${leave.class}-${leave.section}</p>

<p><b>Date :</b> ${leave.leaveDate}</p>

<p><b>Reason :</b> ${leave.reason}</p>

<p><b>Status :</b> ${leave.status}</p>

<textarea
id="remark_${leave.id}"
placeholder="Teacher Remark">${leave.teacherRemark || ""}</textarea>

<div class="actions">

<button
class="approveBtn"
onclick="approveLeave('${leave.id}')"
${leave.status==="Approved" ? "disabled" : ""}>

✅ Approve

</button>

<button
class="rejectBtn"
onclick="rejectLeave('${leave.id}')"
${leave.status==="Rejected" ? "disabled" : ""}>

❌ Reject

</button>

</div>

</div>

`;

});

pendingCount.textContent = pending;
approvedCount.textContent = approved;
rejectedCount.textContent = rejected;
totalCount.textContent = leaveRequests.length;

}
// ======================================
// Render Leave List
// ======================================

function renderLeaveList() {

let pending = 0;
let approved = 0;
let rejected = 0;

leaveList.innerHTML = "";

const keyword =
searchStudent.value.trim().toLowerCase();

leaveRequests.forEach((leave)=>{

if(leave.status==="Pending") pending++;
if(leave.status==="Approved") approved++;
if(leave.status==="Rejected") rejected++;

if(keyword){

const student =
(leave.studentName || "").toLowerCase();

const emis =
(leave.emis || "").toLowerCase();

if(
!student.includes(keyword) &&
!emis.includes(keyword)
){
return;
}

}

if(
statusFilter.value !== "All" &&
leave.status !== statusFilter.value
){
return;
}

leaveList.innerHTML += `

<div class="leaveCard">

<h3>${leave.studentName}</h3>

<p><b>EMIS :</b> ${leave.emis}</p>

<p><b>Class :</b> ${leave.class}-${leave.section}</p>

<p><b>Date :</b> ${leave.leaveDate}</p>

<p><b>Reason :</b> ${leave.reason}</p>

<p><b>Status :</b> ${leave.status}</p>

<textarea
id="remark_${leave.id}"
placeholder="Teacher Remark">${leave.teacherRemark || ""}</textarea>

<div class="actions">

<button
class="approveBtn"
onclick="approveLeave('${leave.id}')"
${leave.status==="Approved" ? "disabled" : ""}>

✅ Approve

</button>

<button
class="rejectBtn"
onclick="rejectLeave('${leave.id}')"
${leave.status==="Rejected" ? "disabled" : ""}>

❌ Reject

</button>

</div>

</div>

`;

});

pendingCount.textContent = pending;
approvedCount.textContent = approved;
rejectedCount.textContent = rejected;
totalCount.textContent = leaveRequests.length;

}
// ======================================
// Approve Leave
// ======================================

window.approveLeave = async function(id){

const remark =
document.getElementById(`remark_${id}`)?.value || "";

try{

await updateDoc(doc(db,"leave_requests",id),{

status:"Approved",

teacherRemark:remark,

approvedBy:
currentTeacher.name,

approvedDate:
serverTimestamp()

});

alert("✅ Leave Approved Successfully");

loadLeaveRequests();

}catch(error){

console.error(error);

alert(error.message);

}

};

// ======================================
// Reject Leave
// ======================================

window.rejectLeave = async function(id){

const remark =
document.getElementById(`remark_${id}`)?.value || "";

try{

await updateDoc(doc(db,"leave_requests",id),{

status:"Rejected",

teacherRemark:remark,

approvedBy:
currentTeacher.name,

approvedDate:
serverTimestamp()

});

alert("❌ Leave Rejected Successfully");

loadLeaveRequests();

}catch(error){

console.error(error);

alert(error.message);

}

};

// ======================================
// Search & Filters
// ======================================

searchStudent.addEventListener(
"input",
renderLeaveList
);

statusFilter.addEventListener(
"change",
renderLeaveList
);

classFilter?.addEventListener(
"change",
renderLeaveList
);

sectionFilter?.addEventListener(
"change",
renderLeaveList
);
// ======================================
// Select All
// ======================================

selectAll?.addEventListener("change", () => {

document.querySelectorAll(".leaveCheck").forEach((check)=>{

check.checked = selectAll.checked;

});

});

// ======================================
// Bulk Actions (Coming Soon)
// ======================================

approveSelected?.addEventListener("click",()=>{

alert("Bulk Approve will be available in Version 2");

});

rejectSelected?.addEventListener("click",()=>{

alert("Bulk Reject will be available in Version 2");

});

// ======================================
// Auto Refresh
// ======================================

setInterval(()=>{

loadLeaveRequests();

},60000);

// ======================================
// Initialize
// ======================================

loadLeaveRequests();

// ======================================
// Version
// ======================================

console.log("================================");
console.log("School Connect TN");
console.log("Leave Management V2");
console.log("Status : Production Ready");
console.log("================================");

// ======================================
// Global Error Handler
// ======================================

window.addEventListener("error",(event)=>{

console.error("Global Error :",event.error);

});

window.addEventListener("unhandledrejection",(event)=>{

console.error("Unhandled Promise :",event.reason);

});
