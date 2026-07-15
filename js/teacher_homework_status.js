//==========================================
// School Connect TN
// Teacher Homework Status
// Stable Version V1
// Part 1
//==========================================

import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Dashboard Elements

const totalHomework =
document.getElementById("totalHomework");

const completedCount =
document.getElementById("completedCount");

const pendingCount =
document.getElementById("pendingCount");

const completedList =
document.getElementById("completedList");

const pendingList =
document.getElementById("pendingList");

// Teacher Session

const teacherId =
localStorage.getItem("teacherId") ||
sessionStorage.getItem("teacherId");

if(!teacherId){

alert("Session Expired");

location.href="index.html";

}

window.addEventListener(
"DOMContentLoaded",
loadHomeworkStatus
);
//==========================================
// Load Homework Status
// Part 2
//==========================================

async function loadHomeworkStatus(){

try{

const q = query(
collection(db,"homework_submissions"),
where("teacherId","==",teacherId)
);

const snap = await getDocs(q);

let total = 0;
let completed = 0;
let pending = 0;

completedList.innerHTML = "";
pendingList.innerHTML = "";

if(snap.empty){

totalHomework.textContent = "0";
completedCount.textContent = "0";
pendingCount.textContent = "0";

completedList.innerHTML =
"<p>No Completed Homework</p>";

pendingList.innerHTML =
"<p>No Pending Homework</p>";

return;

}

snap.forEach((docSnap)=>{

const hw = docSnap.data();

total++;
const today = new Date().toISOString().split("T")[0];

if(hw.dueDate < today){
    return;
}  

if(hw.status === "Completed"){

completed++;

completedList.innerHTML += `

<div class="homeworkCard">

<h3>👨‍🎓 ${hw.studentName}</h3>

<p><b>EMIS :</b> ${hw.emis}</p>

<p><b>Subject :</b> ${hw.subject}</p>

<p><b>Status :</b> ✅ Completed</p>

</div>

`;

}else{

pending++;

pendingList.innerHTML += `

<div class="homeworkCard">

<h3>👨‍🎓 ${hw.studentName}</h3>

<p><b>EMIS :</b> ${hw.emis}</p>

<p><b>Subject :</b> ${hw.subject}</p>

<p><b>Status :</b> 🟢 Pending</p>

</div>

`;

}

});

totalHomework.textContent = total;
completedCount.textContent = completed;
pendingCount.textContent = pending;

}catch(error){

console.error("Teacher Analytics Error:", err);
alert(err.message);

}

}
//==========================================
// Auto Refresh
//==========================================

setInterval(async()=>{

try{

if(teacherId){

await loadHomeworkStatus();

}

}catch(error){

console.error("Refresh Error :",error);

}

},30000);

//==========================================
// Version
//==========================================

console.log("================================");
console.log("School Connect TN");
console.log("Teacher Homework Status");
console.log("Stable Version V1");
console.log("================================");
