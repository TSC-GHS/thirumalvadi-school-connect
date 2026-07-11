import { db } from "../firebase.js";

import {
  collection,
  query,
  where,
  orderBy,
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
      <p>Please Login Again.</p>
    </div>`;

    return;
  }

  leaveList.innerHTML = "<h3>Loading...</h3>";

  try {

    const q = query(
      collection(db, "leave_requests"),
      where("emis", "==", String(emis)),
      orderBy("createdAt", "desc")
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

      let approvedDate = "-";

      if (leave.approvedDate && leave.approvedDate.toDate) {
        approvedDate = leave.approvedDate
          .toDate()
          .toLocaleString("en-IN");
      }

      leaveList.innerHTML += `

      <div class="card">

        <h3 style="color:#1565C0;">
          ${leave.studentName}
        </h3>

        <p><b>EMIS :</b> ${leave.emis}</p>

        <p><b>Leave Date :</b> ${leave.leaveDate}</p>

        <p><b>Reason :</b> ${leave.reason}</p>

        <p>
          <b>Status :</b>
          <span style="color:${color};font-weight:bold;">
            ${leave.status}
          </span>
        </p>

        <p><b>Teacher Remark :</b>
          ${leave.teacherRemark || "-"}
        </p>

        <p><b>Approved By :</b>
          ${leave.approvedBy || "-"}
        </p>

        <p><b>Approved Date :</b>
          ${approvedDate}
        </p>

        <hr>

      </div>

      `;

    });
      } catch (error) {

    console.error(error);

    leaveList.innerHTML = `

    <div class="card">

      <h3 style="color:red;">Error Loading Leave Status</h3>

      <p>${error.message}</p>

    </div>

    `;

  }

}

// ===============================
// Load Leave Status
// ===============================

loadLeaveStatus();

// ===============================
// Auto Refresh Every 30 Seconds
// ===============================

setInterval(() => {

  loadLeaveStatus();

}, 30000);

console.log("================================");
console.log("School Connect TN");
console.log("Parent Leave Status");
console.log("Version : V2");
console.log("================================");
