import { db } from "../firebase.js";

import {
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// =====================================
// Elements
// =====================================

const studentName =
document.getElementById("studentName");

const attendanceValue =
document.getElementById("attendanceValue");

const gradeValue =
document.getElementById("gradeValue");

const noticeText =
document.getElementById("noticeText");

// =====================================
// Parent Session
// =====================================

const emis =
localStorage.getItem("parentEMIS") ||
sessionStorage.getItem("parentEMIS");

if(!emis){

alert("Parent session expired.");

location.href="index.html";

throw new Error("Parent Session Expired");

}

// =====================================
// Load Dashboard
// =====================================

async function loadDashboard(){

try{

const studentSnap =
await getDoc(doc(db,"students",emis));

if(studentSnap.exists()){

const student =
studentSnap.data();

studentName.textContent =
student.name || "-";

attendanceValue.textContent =
student.attendance || "-";

}else{

studentName.textContent="Student Not Found";

return;

}
  // =====================================
// Latest Grade
// =====================================

const exams = [
"Annual",
"Half Yearly",
"Quarterly",
"Unit Test"
];

gradeValue.textContent = "-";

for(const exam of exams){

const reportSnap =
await getDoc(
doc(db,"marks",exam,"students",emis)
);

if(reportSnap.exists()){

const report =
reportSnap.data();

gradeValue.textContent =
report.grade || "-";

break;

}

}

// =====================================
// Latest Notice
// =====================================

const noticeSnap =
await getDocs(collection(db,"notices"));

let latestNotice = "No Notices";

noticeSnap.forEach((d)=>{

const notice = d.data();

if(notice.message){

latestNotice = notice.message;

}

});

noticeText.textContent = latestNotice;

}catch(error){

console.error(error);

alert(
"Dashboard Loading Failed\n\n"+
error.message
);

}

}
// =====================================
// Initialize Dashboard
// =====================================

loadDashboard();

// =====================================
// Auto Refresh (Every 60 Seconds)
// =====================================

setInterval(async()=>{

try{

await loadDashboard();

}catch(error){

console.error("Dashboard Refresh Error",error);

}

},60000);

// =====================================
// Version
// =====================================

console.log("================================");
console.log("School Connect TN");
console.log("Parent Dashboard V2");
console.log("Firebase Connected");
console.log("================================");

// =====================================
// Global Error Handler
// =====================================

window.addEventListener("error",(event)=>{

console.error("Global Error :",event.error);

});

window.addEventListener("unhandledrejection",(event)=>{

console.error("Unhandled Promise :",event.reason);

});
