//==================================================
// School Connect TN
// Teacher Leave Apply
// Part 1
//==================================================

import { db } from "../firebase.js";

import {
collection,
addDoc,
getDocs,
query,
where,
orderBy,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Elements
//==================================================

const teacherName =
document.getElementById("teacherName");

const teacherId =
document.getElementById("teacherId");

const leaveType =
document.getElementById("leaveType");

const fromDate =
document.getElementById("fromDate");

const toDate =
document.getElementById("toDate");

const reason =
document.getElementById("reason");

const submitLeave =
document.getElementById("submitLeave");

const leaveHistory =
document.getElementById("leaveHistory");

//==================================================
// Start
//==================================================

loadTeacher();

//==================================================
// Load Teacher Details
//==================================================

async function loadTeacher(){

teacherName.value =
localStorage.getItem("teacherName") || "";

teacherId.value =
localStorage.getItem("teacherId") || "";

if(!teacherName.value){

teacherName.value = "Teacher";

}

if(!teacherId.value){

teacherId.value = "Not Available";

}

// Read Only

teacherName.readOnly = true;

teacherId.readOnly = true;

// Load Previous Leave History

loadHistory();

}
//==================================================
// Submit Leave
//==================================================

submitLeave.addEventListener("click", async ()=>{

const data={

teacherName:teacherName.value.trim(),

teacherId:teacherId.value.trim(),

leaveType:leaveType.value,

fromDate:fromDate.value,

toDate:toDate.value,

reason:reason.value.trim(),

status:"Pending",

appliedDate:serverTimestamp()

};

// Validation

if(

!data.leaveType ||

!data.fromDate ||

!data.toDate ||

!data.reason

){

alert("Please fill all fields.");

return;

}

// Date Validation

if(data.fromDate > data.toDate){

alert("From Date cannot be greater than To Date.");

return;

}

// Reason Validation

if(data.reason.length < 10){

alert("Reason should contain at least 10 characters.");

return;

}

submitLeave.disabled=true;

submitLeave.innerHTML="Submitting...";

try{

await addDoc(

collection(db,"leave_requests"),

data

);

alert("✅ Leave Request Submitted Successfully.");

leaveType.value="";

fromDate.value="";

toDate.value="";

reason.value="";

loadHistory();

}catch(error){

console.error(error);

alert("❌ Failed to submit leave request.");

}finally{

submitLeave.disabled=false;

submitLeave.innerHTML="📤 Submit Leave Request";

}

});
//==================================================
// Submit Leave
//==================================================

submitLeave.addEventListener("click", async ()=>{

const data={

teacherName:teacherName.value,

teacherId:teacherId.value,

leaveType:leaveType.value,

fromDate:fromDate.value,

toDate:toDate.value,

reason:reason.value.trim(),

status:"Pending",

appliedDate:serverTimestamp()

};

// Validation

if(
!data.leaveType ||
!data.fromDate ||
!data.toDate ||
!data.reason
){

alert("Please fill all fields.");

return;

}

if(data.fromDate > data.toDate){

alert("From Date cannot be greater than To Date.");

return;

}

if(data.reason.length < 10){

alert("Reason must contain at least 10 characters.");

return;

}

submitLeave.disabled=true;

submitLeave.innerHTML="Submitting...";

try{

await addDoc(
collection(db,"leave_requests"),
data
);

alert("✅ Leave Request Submitted Successfully.");

leaveType.value="";
fromDate.value="";
toDate.value="";
reason.value="";

loadHistory();

}catch(error){

console.error(error);

alert("Failed to submit leave request.");

}finally{

submitLeave.disabled=false;

submitLeave.innerHTML="📤 Submit Leave Request";

}

});
//==================================================
// Load Leave History
//==================================================

async function loadHistory(){

leaveHistory.innerHTML =
"<p class='loading'>Loading...</p>";

try{

const q = query(
collection(db,"leave_requests"),
where("teacherId","==",teacherId.value),
orderBy("appliedDate","desc")
);

const snap = await getDocs(q);

if(snap.empty){

leaveHistory.innerHTML =
"<p class='loading'>No Leave History Found</p>";

return;

}

let html="";

snap.forEach((doc)=>{

const leave = doc.data();

let statusClass="pending";

if(leave.status==="Approved"){

statusClass="approved";

}else if(leave.status==="Rejected"){

statusClass="rejected";

}

html += `

<div class="leaveItem">

<h4>${leave.leaveType}</h4>

<p><b>From :</b> ${leave.fromDate}</p>

<p><b>To :</b> ${leave.toDate}</p>

<p><b>Reason :</b> ${leave.reason}</p>

<p>

<b>Status :</b>

<span class="${statusClass}">

${leave.status}

</span>

</p>

</div>

`;

});

leaveHistory.innerHTML = html;

}catch(error){

console.error(error);

leaveHistory.innerHTML =
"<p class='loading'>Unable to load leave history.</p>";

}

}

console.log("Teacher Leave Module Loaded Successfully");
