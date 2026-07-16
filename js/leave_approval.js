import { db } from "../firebase.js";

import {
collection,
getDocs,
doc,
updateDoc,
query,
where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const pendingCount = document.getElementById("pendingCount");
const approvedCount = document.getElementById("approvedCount");
const rejectedCount = document.getElementById("rejectedCount");
const leaveList = document.getElementById("leaveList");

loadLeaves();

async function loadLeaves(){

try{

leaveList.innerHTML="<p class='loading'>Loading...</p>";

const snap = await getDocs(collection(db,"leave_requests"));

let pending=0;
let approved=0;
let rejected=0;

let html="";

snap.forEach((docSnap)=>{

const leave=docSnap.data();

const id=docSnap.id;

const status=(leave.status||"Pending");

if(status==="Pending") pending++;
else if(status==="Approved") approved++;
else if(status==="Rejected") rejected++;

if(status==="Pending"){

html+=`

<div class="leaveCard">

<h3>👨‍🏫 ${leave.teacherName || "-"}</h3>

<p><b>Reason :</b> ${leave.reason || "-"}</p>

<p><b>From :</b> ${leave.fromDate || "-"}</p>

<p><b>To :</b> ${leave.toDate || "-"}</p>

<div class="btnRow">

<button
class="approveBtn"
onclick="approveLeave('${id}')">

✅ Approve

</button>

<button
class="rejectBtn"
onclick="rejectLeave('${id}')">

❌ Reject

</button>

</div>

</div>

`;

}

});

pendingCount.textContent=pending;
approvedCount.textContent=approved;
rejectedCount.textContent=rejected;

leaveList.innerHTML=
html || "<p>No Pending Leave Requests</p>";

}catch(error){

console.error(error);

leaveList.innerHTML=
"<p style='color:red'>Unable to load leave requests.</p>";

}

}

window.approveLeave = async function(id){

if(!confirm("Approve this leave request?")) return;

await updateDoc(doc(db,"leave_requests",id),{

status:"Approved"

});

loadLeaves();

}

window.rejectLeave = async function(id){

if(!confirm("Reject this leave request?")) return;

await updateDoc(doc(db,"leave_requests",id),{

status:"Rejected"

});

loadLeaves();

}

console.log("Teacher Leave Approval Loaded");
