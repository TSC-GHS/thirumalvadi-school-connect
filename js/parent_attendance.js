//==========================================
// School Connect TN
// Parent Attendance
//==========================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs
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

            studentSnap.forEach((studentDoc) => {

                const data = studentDoc.data();

                const firebaseEmis =
                String(data.emis || "").trim();

                if (firebaseEmis !== emis) return;

                if (
                    data.status === "P" ||
                    data.status === "Present"
                ) {

                    present++;

                } else {

                    absent++;

                }

                html += `
<tr>
<td>${day.id}</td>

<td class="${
data.status === "P" ||
data.status === "Present"
? "present"
: "absent"
}">
${
data.status === "P" ||
data.status === "Present"
? "Present"
: "Absent"
}
</td>

</tr>
`;

            });

        }

        const total = present + absent;

        const percentage =
        total === 0
        ? 0
        : Math.round((present / total) * 100);

        document.getElementById("presentCount").textContent =
        present;

        document.getElementById("absentCount").textContent =
        absent;

        document.getElementById("attendancePercent").textContent =
        percentage + "%";

        document.getElementById("attendanceTable").innerHTML =

        html ||

        `
<tr>
<td colspan="2" style="text-align:center;">
No Attendance Records Found
</td>
</tr>
`;

    }

    catch(error){

        console.error("Attendance Error :", error);

        document.getElementById("attendanceTable").innerHTML=

        `
<tr>
<td colspan="2"
style="text-align:center;color:red;">
Failed to Load Attendance
</td>
</tr>
`;

    }

}

//==========================================
// Initialize
//==========================================

window.addEventListener("DOMContentLoaded",()=>{

    loadAttendance();

});
