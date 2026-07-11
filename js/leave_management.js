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

// ======================================
// School Connect TN
// Leave Management V4
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

let leaveRequests = [];
let currentTeacher = null;

// ======================================
// Load Teacher
// ======================================

async function loadTeacher(){

const teacherId =
localStorage.getItem("teacherId") ||
sessionStorage.getItem("teacherId");

if(!teacherId){

alert("Session Expired");

location.href="index.html";

return false;

}

const teacherSnap =
await getDocs(

query(

collection(db,"teachers"),

where("id","==",teacherId)

)

);

if(teacherSnap.empty){

alert("Teacher Profile Not Found");

location.href="index.html";

return false;

}

currentTeacher =
teacherSnap.docs[0].data();

return true;

}

// ======================================
// Load Pending Leave Requests
// ======================================

async function loadLeaveRequests(){

const loaded =
await loadTeacher();

if(!loaded) return;

leaveRequests = [];

if(currentTeacher.teacherType==="Subject Teacher"){

leaveList.innerHTML=

"<h3>No Leave Approval Permission</h3>";

return;

}

const leaveQuery = query(

collection(db,"leave_requests"),

where("class","==",currentTeacher.className),

where("section","==",currentTeacher.section),

where("status","==","Pending")

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
// Render Pending Leave List
// ======================================

function renderLeaveList(){

let pending = leaveRequests.length;

leaveList.innerHTML = "";

const keyword =
searchStudent.value.trim().toLowerCase();

leaveRequests.forEach((leave)=>{

// Search

if(keyword){

const student =
(leave.studentName || "").toLowerCase();

const emis =
String(leave.emis || "").toLowerCase();

if(
!student.includes(keyword) &&
!emis.includes(keyword)
){
return;
}

}

leaveList.innerHTML += `

<div class="leaveCard">

<h3>${leave.studentName}</h3>

<p><b>EMIS :</b> ${leave.emis}</p>

<p><b>Class :</b> ${leave.class} - ${leave.section}</p>

<p><b>Leave Date :</b> ${leave.leaveDate}</p>

<p><b>Reason :</b> ${leave.reason}</p>

<textarea
id="remark_${leave.id}"
placeholder="Teacher Remark"></textarea>

<div class="actions">

<button
class="approveBtn"
onclick="approveLeave('${leave.id}')">

✅ Approve

</button>

<button
class="rejectBtn"
onclick="rejectLeave('${leave.id}')">

❌ Reject

</button>

</div>

</div>

`;

});

// Dashboard

pendingCount.textContent =
leaveRequests.length;

approvedCount.textContent = "-";

rejectedCount.textContent = "-";

totalCount.textContent =
leaveRequests.length;

}

// ======================================
// Approve Leave
// ======================================

window.approveLeave = async function(id){

const remark =
document.getElementById(`remark_${id}`).value;

try{

await updateDoc(

doc(db,"leave_requests",id),

{

status:"Approved",

teacherRemark:remark,

approvedBy:currentTeacher.name,

approvedDate:serverTimestamp()

}

);

// Remove from current list
leaveRequests =
leaveRequests.filter(x=>x.id!==id);

renderLeaveList();

alert("✅ Leave Approved");

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
document.getElementById(`remark_${id}`).value;

try{

await updateDoc(

doc(db,"leave_requests",id),

{

status:"Rejected",

teacherRemark:remark,

approvedBy:currentTeacher.name,

approvedDate:serverTimestamp()

}

);

// Remove from current list
leaveRequests =
leaveRequests.filter(x=>x.id!==id);

renderLeaveList();

alert("❌ Leave Rejected");

}catch(error){

console.error(error);

alert(error.message);

}

};
// ======================================
// Search & Filter
// ======================================

searchStudent?.addEventListener("input", renderLeaveList);

statusFilter?.addEventListener("change", renderLeaveList);

classFilter?.addEventListener("change", renderLeaveList);

sectionFilter?.addEventListener("change", renderLeaveList);

// ======================================
// Select All (Future)
// ======================================

selectAll?.addEventListener("change", () => {

document.querySelectorAll(".leaveCheck").forEach((check)=>{

check.checked = selectAll.checked;

});

});

// ======================================
// Bulk Actions (Future)
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

setInterval(async()=>{

try{

await loadLeaveRequests();

}catch(error){

console.error(error);

}

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
console.log("Leave Management V4");
console.log("Pending Workflow Enabled");
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
