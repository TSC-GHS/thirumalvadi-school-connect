import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const emis = localStorage.getItem("parentEMIS");

if (!emis) {
    alert("Please Login Again");
    location.href = "login.html";
}

async function loadAttendance() {

    try {

        const attendanceRef = collection(db, "attendance");
        const attendanceSnap = await getDocs(attendanceRef);

        let present = 0;
        let absent = 0;

        let html = "";

        attendanceSnap.forEach((docSnap) => {

            const data = docSnap.data();

            if (data.emis === emis) {

                if (data.status === "Present") {
                    present++;
                } else {
                    absent++;
                }

                html += `
<tr>
<td>${data.date || "-"}</td>
<td class="${data.status === "Present" ? "present" : "absent"}">
${data.status}
</td>
</tr>
`;

            }

        });

        const total = present + absent;

        const percent =
            total === 0
            ? 0
            : Math.round((present / total) * 100);

        document.getElementById("attendancePercent").textContent =
            percent + "%";

        document.getElementById("presentCount").textContent =
            present;

        document.getElementById("absentCount").textContent =
            absent;
        document.getElementById("attendanceTable").innerHTML =
            html || `
<tr>
<td colspan="2" style="text-align:center;">
No Attendance Found
</td>
</tr>
`;

    } catch (error) {

        console.error("Attendance Error :", error);

        document.getElementById("attendanceTable").innerHTML = `
<tr>
<td colspan="2" style="text-align:center;color:red;">
Failed to Load Attendance
</td>
</tr>
`;

    }

}

window.addEventListener("DOMContentLoaded", () => {

    loadAttendance();

});
