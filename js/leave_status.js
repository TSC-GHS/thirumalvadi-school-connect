import { db } from "../firebase.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const emis = params.get("emis");

const leaveList = document.getElementById("leaveList");

async function loadLeaveStatus() {

  if (!emis) {
    leaveList.innerHTML = "<h3>EMIS Number Missing</h3>";
    return;
  }

  leaveList.innerHTML = "<h3>Loading...</h3>";

  try {

    const q = query(
      collection(db, "leave_requests"),
      where("emis", "==", emis)
    );

    const snap = await getDocs(q);

    leaveList.innerHTML = "";

    if (snap.empty) {
      leaveList.innerHTML = "<h3>No Leave Requests Found</h3>";
      return;
    }

    snap.forEach((doc) => {

      const leave = doc.data();

      let color = "#ff9800";

      if (leave.status === "Approved")
        color = "#2E7D32";

      if (leave.status === "Rejected")
        color = "#D32F2F";

      leaveList.innerHTML += `
      <div class="card">

        <h3>${leave.studentName}</h3>

        <p><b>Date :</b> ${leave.leaveDate}</p>

        <p><b>Reason :</b> ${leave.reason}</p>

        <p style="font-weight:bold;color:${color}">
          Status : ${leave.status}
        </p>

        <hr>

      </div>
      `;
    });

  } catch (error) {

    leaveList.innerHTML =
      "<h3>" + error.message + "</h3>";

  }

}

loadLeaveStatus();
