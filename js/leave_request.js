import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// =====================================
// Auto Load Parent Student
// =====================================

const emisInput = document.getElementById("emis");
const studentNameInput = document.getElementById("studentName");
const leaveDateInput = document.getElementById("leaveDate");
const reasonInput = document.getElementById("reason");

const parentEMIS = localStorage.getItem("parentEMIS");

if (parentEMIS) {
  emisInput.value = parentEMIS;
  emisInput.readOnly = true;
  loadStudent(parentEMIS);
}

async function loadStudent(emis) {

  try {

    const snap = await getDoc(doc(db, "students", emis));

    if (!snap.exists()) return;

    const student = snap.data();

    studentNameInput.value = student.name || "";
    studentNameInput.readOnly = true;

  } catch (e) {

    console.log(e);

  }

}

// =====================================
// Submit Leave
// =====================================

window.submitLeave = async function () {

  const emis = emisInput.value.trim();
  const leaveDate = leaveDateInput.value;
  const reason = reasonInput.value.trim();

  if (!emis || !leaveDate || !reason) {
    alert("Please fill all required fields.");
    return;
  }

  try {

    const studentSnap = await getDoc(doc(db, "students", emis));

    if (!studentSnap.exists()) {
      alert("Student Not Found");
      return;
    }

    const student = studentSnap.data();

    await addDoc(collection(db, "leave_requests"), {

      emis: student.emis,
      studentName: student.name,
      class: student.class,
      section: student.section,

      leaveDate: leaveDate,
      reason: reason,

      status: "Pending",
      teacherRemark: "",
      approvedBy: "",
      approvedDate: "",

      createdAt: serverTimestamp()

    });

    alert("✅ Leave Request Submitted Successfully");

    leaveDateInput.value = "";
    reasonInput.value = "";

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

};
