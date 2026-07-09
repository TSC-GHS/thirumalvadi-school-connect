import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const leaveList = document.getElementById("leaveList");

const pendingCount = document.getElementById("pendingCount");
const approvedCount = document.getElementById("approvedCount");
const rejectedCount = document.getElementById("rejectedCount");

const searchStudent = document.getElementById("searchStudent");
const statusFilter = document.getElementById("statusFilter");
const classFilter = document.getElementById("classFilter");
const sectionFilter = document.getElementById("sectionFilter");

const selectAll = document.getElementById("selectAll");
const approveSelected = document.getElementById("approveSelected");
const rejectSelected = document.getElementById("rejectSelected");

let leaveData = [];

async function loadLeaveRequests(){

    const snap = await getDocs(collection(db,"leave_requests"));

    leaveData = [];

    snap.forEach((d)=>{

        leaveData.push({
            id:d.id,
            ...d.data()
        });

    });

    renderLeave();

}

function renderLeave(){

    let pending=0;
    let approved=0;
    let rejected=0;

    leaveList.innerHTML="";

    const keyword = searchStudent.value.toLowerCase();

    leaveData.forEach((leave)=>{

        if(leave.status==="Pending") pending++;
        if(leave.status==="Approved") approved++;
        if(leave.status==="Rejected") rejected++;

        if(keyword &&
        !leave.studentName.toLowerCase().includes(keyword))
        return;

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
        `
<div class="leaveCard">

<label>

<input
type="checkbox"
class="leaveCheck"
value="${leave.id}">

Select

</label>

<h3>${leave.studentName}</h3>

<p><b>EMIS:</b> ${leave.emis}</p>

<p><b>Class:</b> ${leave.class}-${leave.section}</p>

<p><b>Date:</b> ${leave.leaveDate}</p>

<p><b>Reason:</b> ${leave.reason}</p>

<p><b>Status:</b> ${leave.status}</p>

<div class="actions">

<button
class="approveBtn"
onclick="approveLeave('${leave.id}')"
${leave.status==="Approved"?"disabled":""}>

✅ Approve

</button>

<button
class="rejectBtn"
onclick="rejectLeave('${leave.id}')"
${leave.status==="Rejected"?"disabled":""}>

❌ Reject

</button>

</div>

</div>

`;

    });

    pendingCount.innerText = pending;
    approvedCount.innerText = approved;
    rejectedCount.innerText = rejected;

}

searchStudent.addEventListener("input",renderLeave);

statusFilter.addEventListener("change",renderLeave);

classFilter.addEventListener("change",renderLeave);

sectionFilter.addEventListener("change",renderLeave);
window.approveLeave = async function(id){

  await updateDoc(doc(db,"leave_requests",id),{

    status:"Approved"

  });

  loadLeaveRequests();

}

window.rejectLeave = async function(id){

  await updateDoc(doc(db,"leave_requests",id),{

    status:"Rejected"

  });

  loadLeaveRequests();

}

selectAll.addEventListener("change",()=>{

  document.querySelectorAll(".leaveCheck").forEach((check)=>{

    check.checked = selectAll.checked;

  });

});

async function bulkUpdate(status){

  const selected = [];

  document.querySelectorAll(".leaveCheck:checked").forEach((check)=>{

    selected.push(check.value);

  });

  if(selected.length===0){

    alert("Please select at least one leave request.");

    return;

  }

  for(const id of selected){

    await updateDoc(doc(db,"leave_requests",id),{

      status:status

    });

  }

  alert(`${selected.length} leave request(s) updated.`);

  loadLeaveRequests();

}

approveSelected.addEventListener("click",()=>{

  bulkUpdate("Approved");

});

rejectSelected.addEventListener("click",()=>{

  bulkUpdate("Rejected");

});

loadLeaveRequests();
