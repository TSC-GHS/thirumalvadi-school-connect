import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const historyTable=document.getElementById("historyTable");

const workingDays=document.getElementById("workingDays");
const presentDays=document.getElementById("presentDays");
const absentDays=document.getElementById("absentDays");
const leaveDays=document.getElementById("leaveDays");
const percentage=document.getElementById("percentage");

window.loadAttendanceHistory=async function(){

const emis=document.getElementById("emis").value.trim();

const fromDate=document.getElementById("fromDate").value;

const toDate=document.getElementById("toDate").value;

if(emis==""){
alert("Enter EMIS Number");
return;
}

if(fromDate=="" || toDate==""){
alert("Select From Date and To Date");
return;
}

historyTable.innerHTML="";

let found=false;

let working=0;
let present=0;
let absent=0;
let leave=0;

const start=new Date(fromDate);
const end=new Date(toDate);
for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {

    const date = d.toISOString().split("T")[0];

    const snap = await getDocs(
        collection(db, "attendance", date, "students")
    );

    snap.forEach((docSnap) => {

        const data = docSnap.data();

        if (data.emis === emis) {

            found = true;
            working++;

            let color = "#2E7D32";

            if (data.status === "Absent") color = "#D32F2F";
            else if (data.status === "Leave") color = "#F57C00";

            historyTable.innerHTML += `
<tr>
<td>${data.date}</td>
<td style="color:${color};font-weight:bold;">
${data.status}
</td>
</tr>
`;

            if (data.status === "Present") present++;
            else if (data.status === "Absent") absent++;
            else if (data.status === "Leave") leave++;

        }

    });

}

if (!found) {

    historyTable.innerHTML = `
<tr>
<td colspan="2">
No Attendance Records Found
</td>
</tr>
`;

}

workingDays.textContent = working;
presentDays.textContent = present;
absentDays.textContent = absent;
leaveDays.textContent = leave;

// Leave counts as approved attendance
const attendanceCount = present + leave;

const percent =
working === 0
? 0
: ((attendanceCount / working) * 100).toFixed(1);

percentage.textContent = percent + "%";

}
