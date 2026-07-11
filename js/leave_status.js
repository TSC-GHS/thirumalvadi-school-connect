import { db } from "../firebase.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const leaveList = document.getElementById("leaveList");

const params = new URLSearchParams(window.location.search);

let emis = params.get("emis");

if (!emis) {
  emis = localStorage.getItem("parentEMIS");
}

async function loadLeaveStatus() {

  if (!emis) {

    leaveList.innerHTML = `
    <div class="card">
      <h3 style="color:red;">EMIS Number Not Found</h3>
      <p>Please login again.</p>
    </div>`;

    return;
  }

  leaveList.innerHTML = "<p>Loading...</p>";

  try {

    const q = query(
      collection(db, "leave_requests"),
      where("emis", "==", String(emis))
    );

    const snap = await getDocs(q);

    leaveList.innerHTML = "";

    if (snap.empty) {

      leaveList.innerHTML = `
      <div class="card">
        <h3>No Leave Requests Found</h3>
      </div>`;

      return;
    }
        snap.forEach((leaveDoc) => {

      const leave = leaveDoc.data();

      let color = "#FB8C00";

      if (leave.status === "Approved") {
        color = "#2E7D32";
      }

      if (leave.status === "Rejected") {
        color = "#D32F2F";
      }

      const approvedDate =
        leave.approvedDate && leave.approvedDate.seconds
          ? new Date(
              leave.approvedDate.seconds * 1000
            ).toLocaleString()
          : "-";

      leaveList.innerHTML += `

      <div class="card">

      <h3>👨‍🎓 ${leave.studentName}</h3>

      <p><b>🆔 EMIS :</b> ${leave.emis}</p>

      <p><b>📅 Leave Date :</b> ${leave.leaveDate}</p>

      <p><b>📝 Reason :</b> ${leave.reason}</p>

      <p>
      <b>📌 Status :</b>
      <span style="
      color:${color};
      font-weight:bold;
      ">
      ${leave.status}
      </span>
      </p>

      <p><b>💬 Teacher Remark :</b><br>
      ${leave.teacherRemark || "No Remarks"}
      </p>

      <p><b>👨‍🏫 Approved By :</b>
      ${leave.approvedBy || "-"}
      </p>

      <p><b>🕒 Approved Date :</b>
      ${approvedDate}
      </p>

      </div>

      `;

    });
      } catch (error) {

    console.error(error);

    leaveList.innerHTML = `
    <div class="card">
      <h3 style="color:red;">Error</h3>
      <p>${error.message}</p>
    </div>`;

  }

}

loadLeaveStatus();
