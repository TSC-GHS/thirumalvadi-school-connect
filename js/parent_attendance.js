//==========================================
// School Connect TN
// Parent Attendance
// Part 1
//==========================================

import { db } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const emis = String(localStorage.getItem("parentEMIS") || "").trim();

if (!emis) {

    alert("Session Expired");

    location.href = "login.html";

}

async function loadAttendance() {

    try {

        const attendanceDays = await getDocs(
            collection(db, "attendance")
        );

        let present = 0;
        let absent = 0;
        let html = "";

        for (const day of attendanceDays.docs) {

            const studentSnap = await getDocs(
                collection(
                    db,
                    "attendance",
                    day.id,
                    "students"
                )
            );

            studentSnap.forEach((docSnap) => {

                const data = docSnap.data();

                if (String(data.emis).trim() !== emis) return;

                if (data.status === "P") {

                    present++;

                } else {

                    absent++;

                }

                html += `
<tr>
<td>${day.id}</td>
<td class="${data.status === "P" ? "present" : "absent"}">
${data.status === "P" ? "Present" : "Absent"}
</td>
</tr>
`;

            });

        }

        const total = present + absent;

        const percent =
            total === 0
            ? 0
            : Math.round((present / total) * 100);

        document.getElementById("presentCount").textContent = present;
        document.getElementById("absentCount").textContent = absent;
        document.getElementById("attendancePercent").textContent = percent + "%";

        document.getElementById("attendanceTable").innerHTML =
            html || `
<tr>
<td colspan="2" style="text-align:center;">
No Attendance Records Found
</td>
</tr>`;

    } catch (error) {

        console.error(error);

    }

}
window.addEventListener("DOMContentLoaded", () => {

    loadAttendance();

});
