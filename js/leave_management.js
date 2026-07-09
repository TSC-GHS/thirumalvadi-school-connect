import { db } from "../firebase.js";

import {
collection,
getDocs,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const leaveList=document.getElementById("leaveList");

const pendingCount=document.getElementById("pendingCount");
const approvedCount=document.getElementById("approvedCount");
const rejectedCount=document.getElementById("rejectedCount");
const totalCount=document.getElementById("totalCount");

const searchStudent=document.getElementById("searchStudent");
const statusFilter=document.getElementById("statusFilter");
const classFilter=document.getElementById("classFilter");
const sectionFilter=document.getElementById("sectionFilter");

const selectAll=document.getElementById("selectAll");
const approveSelected=document.getElementById("approveSelected");
const rejectSelected=document.getElementById("rejectSelected");

let leaveRequests=[];

async function loadLeaveRequests(){

const snap=await getDocs(collection(db,"leave_requests"));

leaveRequests=[];

snap.forEach((d)=>{

leaveRequests.push({

id:d.id,

...d.data()

});

});

renderLeaveList();

}
function renderLeaveList(){

let pending=0;
let approved=0;
let rejected=0;

leaveList.innerHTML="";

const keyword=searchStudent.value.trim().toLowerCase();

leaveRequests.forEach((leave)=>{

if(leave.status==="Pending") pending++;
if(leave.status==="Approved") approved++;
if(leave.status==="Rejected") rejected++;

if(keyword){

const student=(leave.studentName||"").toLowerCase();
const emis=(leave.emis||"").toLowerCase();

if(!student.includes(keyword) && !emis.includes(keyword))
return;

}

if(statusFilter.value!="All" &&
leave.status!=statusFilter.value)
return;

if(classFilter.value!="All" &&
leave.class!=classFilter.value)
return;

if(sectionFilter.value!="All" &&
leave.section!=sectionFilter.value)
return;

leaveList.innerHTML += `

<div class="leaveCard">

<label>

<input
type="checkbox"
class="leaveCheck"
value="${leave.id}">

Select

</label>

<h3>${leave.studentName}</h3>

<p><b>EMIS :</b> ${leave.emis}</p>

<p><b>Class :</b> ${leave.class}-${leave.section}</p>

<p><b>Date :</b> ${leave.leaveDate}</p>

<p><b>Reason :</b> ${leave.reason}</p>

<p><b>Status :</b> ${leave.status}</p>

<textarea
id="teacherRemark_${leave.id}"
placeholder="Teacher Remark">${leave.teacherRemark||""}</textarea>

<textarea
id="headmasterRemark_${leave.id}"
placeholder="Headmaster Remark">${leave.headmasterRemark||""}</textarea>

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

pendingCount.innerText = pending;
approvedCount.innerText = approved;
rejectedCount.innerText = rejected;
totalCount.innerText = leaveRequests.length;

}

searchStudent.addEventListener("input",renderLeaveList);

statusFilter.addEventListener("change",renderLeaveList);

classFilter.addEventListener("change",renderLeaveList);

sectionFilter.addEventListener("change",renderLeaveList);
// ===============================
// Individual Approve
// ===============================

window.approveLeave = async function(id){

  const teacherRemark =
    document.getElementById(`teacherRemark_${id}`)?.value || "";

  const headmasterRemark =
    document.getElementById(`headmasterRemark_${id}`)?.value || "";

  try{

    await updateDoc(doc(db,"leave_requests",id),{

      status:"Approved",

      teacherRemark:teacherRemark,

      headmasterRemark:headmasterRemark,

      updatedAt:new Date().toISOString()

    });

    alert("✅ Leave Approved Successfully");

    loadLeaveRequests();

  }catch(error){

    console.error(error);

    alert(error.message);

  }

};

// ===============================
// Individual Reject
// ===============================

window.rejectLeave = async function(id){

  const teacherRemark =
    document.getElementById(`teacherRemark_${id}`)?.value || "";

  const headmasterRemark =
    document.getElementById(`headmasterRemark_${id}`)?.value || "";

  try{

    await updateDoc(doc(db,"leave_requests",id),{

      status:"Rejected",

      teacherRemark:teacherRemark,

      headmasterRemark:headmasterRemark,

      updatedAt:new Date().toISOString()

    });

    alert("❌ Leave Rejected");

    loadLeaveRequests();

  }catch(error){

    console.error(error);

    alert(error.message);

  }

};
// =======================================
// Select All
// =======================================

selectAll.addEventListener("change",()=>{

document.querySelectorAll(".leaveCheck").forEach((check)=>{

check.checked=selectAll.checked;

});

});

// =======================================
// Bulk Update
// =======================================

async function bulkUpdate(status){

const selected=[];

document.querySelectorAll(".leaveCheck:checked")
.forEach((check)=>{

selected.push(check.value);

});

if(selected.length===0){

alert("Please select at least one leave request.");

return;

}

if(!confirm(`Are you sure you want to ${status.toLowerCase()} ${selected.length} leave request(s)?`))
return;

for(const id of selected){

const teacherRemark=
document.getElementById(`teacherRemark_${id}`)?.value||"";

const headmasterRemark=
document.getElementById(`headmasterRemark_${id}`)?.value||"";

await updateDoc(doc(db,"leave_requests",id),{

status:status,

teacherRemark,

headmasterRemark,

updatedAt:new Date().toISOString()

});

}

alert(`${selected.length} Leave Request(s) Updated Successfully`);

loadLeaveRequests();

}

// =======================================
// Bulk Buttons
// =======================================

approveSelected.addEventListener("click",()=>{

bulkUpdate("Approved");

});

rejectSelected.addEventListener("click",()=>{

bulkUpdate("Rejected");

});

// =======================================
// Initial Load
// =======================================

loadLeaveRequests();
