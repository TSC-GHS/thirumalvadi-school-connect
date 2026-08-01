//==========================================
// School Connect TN
// Parent Attendance
//==========================================

import { db } from "../firebase.js";

import {
collection,
getDocs,
getDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==========================================
// Parent Session
//==========================================

const emis =
String(localStorage.getItem("parentEMIS") || "").trim();

if (!emis) {

    alert("Session Expired");

    location.href = "index.html";

}

//==========================================
// Load Attendance
//==========================================

async function loadAttendance(){

try{

const attendanceDays =
await getDocs(collection(db,"attendance"));

let present=0;
let absent=0;
let html="";

for(const day of attendanceDays.docs){
console.log("Date :", day.id);
console.log("EMIS :", emis);
const studentDoc =
await getDoc(
doc(
db,
"attendance",
day.id,
"students",
emis
)
);
console.log("Document Exists :", studentDoc.exists());
if(!studentDoc.exists()){

continue;

}

const data=studentDoc.data();

if(data.status=="P"){

present++;

}else{

absent++;

}

html+=`
<tr>
<td>${data.date}</td>
<td>${data.status}</td>
</tr>
`;

}

const total=present+absent;

const percent=
total==0
?0
:Math.round((present/total)*100);

presentCount.textContent=present;
absentCount.textContent=absent;
attendancePercent.textContent=percent+"%";

attendanceTable.innerHTML=
html||
`
<tr>
<td colspan="2">
No Attendance Records
</td>
</tr>
`;

}catch(e){

console.log(e);

}

}
//==========================================
// Initialize
//==========================================

window.addEventListener("DOMContentLoaded",()=>{

    loadAttendance();

});
