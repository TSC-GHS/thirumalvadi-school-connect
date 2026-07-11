import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Parent EMIS
const emis = localStorage.getItem("parentEMIS");

// Auto Load Student Details
async function loadStudent() {

  if (!emis) return;

  document.getElementById("emis").value = emis;

  const snap = await getDoc(doc(db, "students", emis));

  if (snap.exists()) {

    const student = snap.data();

    document.getElementById("studentName").value =
      student.name || "";

  }

}

loadStudent();

// Submit Leave
window.submitLeave = async function () {

  const emis =
    document.getElementById("emis").value.trim();

  const studentName =
    document.getElementById("studentName").value.trim();

  const leaveDate =
    document.getElementById("leaveDate").value;

  const reason =
    document.getElementById("reason").value.trim();

  if (!emis || !studentName || !leaveDate || !reason) {

    alert("Please fill all fields");
    return;

  }

  try {

    await addDoc(collection(db, "leave_requests"), {

      emis,
      studentName,
      leaveDate,
      reason,
      status: "Pending",
      createdAt: serverTimestamp()

    });

    alert("✅ Leave Request Submitted");

    document.getElementById("leaveDate").value = "";
    document.getElementById("reason").value = "";

  } catch (e) {

    alert(e.message);

  }

};
