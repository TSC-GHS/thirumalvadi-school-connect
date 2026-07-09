import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const leaveList = document.getElementById("leaveList");

async function loadLeaveRequests() {

  leaveList.innerHTML = "Loading Leave Requests...";

  try {

    const snap = await getDocs(collection(db, "leave_requests"));

    leaveList.innerHTML = "";

    if (snap.empty) {

      leaveList.innerHTML = `
      <div class="card">
        <h3>No Leave Requests</h3>
      </div>`;

      return;

    }

    snap.forEach((leaveDoc) => {

      const leave = leaveDoc.data();

      leaveList.innerHTML += `

      <div class="card">

        <h3>${leave.studentName}</h3>

        <p><b>EMIS :</b> ${leave.emis}</p>

        <p><b>Date :</b> ${leave.leaveDate}</p>

        <p><b>Reason :</b> ${leave.reason}</p>

        <p class="status">
          Status : ${leave.status}
        </p>

        <div class="actions">

          <button
          class="approve"
          onclick="approveLeave('${leaveDoc.id}')">

          ✅ Approve

          </button>

          <button
          class="reject"
          onclick="rejectLeave('${leaveDoc.id}')">

          ❌ Reject

          </button>

        </div>

      </div>

      `;

    });

  } catch (error) {

    console.log(error);

    alert(error.message);

  }

}

window.approveLeave = async function (id) {

  try {

    await updateDoc(doc(db, "leave_requests", id), {

      status: "Approved"

    });

    alert("Leave Approved");

    loadLeaveRequests();

  } catch (error) {

    alert(error.message);

  }

};

window.rejectLeave = async function (id) {

  try {

    await updateDoc(doc(db, "leave_requests", id), {

      status: "Rejected"

    });

    alert("Leave Rejected");

    loadLeaveRequests();

  } catch (error) {

    alert(error.message);

  }

};

loadLeaveRequests();
