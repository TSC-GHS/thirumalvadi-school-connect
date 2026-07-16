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

//========================================
// Elements
//========================================

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

//========================================
// Load Teacher Details
//========================================

loadTeacher();

async function loadTeacher(){

teacherName.value =
localStorage.getItem("teacherName") || "";

teacherId.value =
localStorage.getItem("teacherId") || "";

if(!teacherName.value){

teacherName.value="Teacher";

}

if(!teacherId.value){

teacherId.value="Not Available";

}

loadHistory();

}

//========================================
// Submit Leave
//========================================

submitLeave.addEventListener("click",async()=>{

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

if(

!data.leaveType ||

!data.fromDate ||

!data.toDate ||

!data.reason

){

alert("Please fill all fields.");

return;

}

submitLeave.disabled=true;

submitLeave.innerHTML="Submitting...";

try{

await addDoc(

collection(db,"leave_requests"),

data

);

// Continue in Part 3B...
