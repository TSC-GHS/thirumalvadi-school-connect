import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const table = document.getElementById("historyTable");

window.loadAttendanceHistory = async function(){

const emis = document.getElementById("emis").value.trim();

const fromDate = document.getElementById("fromDate").value;

const toDate = document.getElementById("toDate").value;

if(emis==""){

alert("Enter Student EMIS Number");

return;

}

if(fromDate=="" || toDate==""){

alert("Select From Date and To Date");

return;

}

table.innerHTML="";

let present=0;

let absent=0;

let leave=0;

let working=0;
const start = new Date(fromDate);
const end = new Date(toDate);

for(let d = new Date(start); d <= end; d.setDate(d.getDate()+1)){

const date = d.toISOString().split("T")[0];

const snap = await getDocs(
collection(db,"attendance",date,"students")
);

snap.forEach((docSnap)=>{

const data = docSnap.data();

if(data.emis === emis){

working++;

table.innerHTML += `

<tr>

<td>${data.date}</td>

<td>${data.status}</td>

</tr>

`;

if(data.status==="Present") present++;

if(data.status==="Absent") absent++;

if(data.status==="Leave") leave++;

}

});

}

if(table.innerHTML===""){

table.innerHTML=`

<tr>

<td colspan="2">

No Attendance Records Found

</td>

</tr>

`;

}

document.getElementById("workingDays").textContent = working;
document.getElementById("presentDays").textContent = present;
document.getElementById("absentDays").textContent = absent;
document.getElementById("leaveDays").textContent = leave;

const percentage =
working === 0
? 0
: ((present / working) * 100).toFixed(1);

document.getElementById("percentage").textContent =
percentage + "%";

}
