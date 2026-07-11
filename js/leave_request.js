import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
// ===============================
// Auto Load Student Details
// ===============================

const parentEMIS = localStorage.getItem("parentEMIS");

if (parentEMIS) {

  document.getElementById("emis").value = parentEMIS;
  document.getElementById("emis").readOnly = true;

  loadStudent(parentEMIS);

}

async function loadStudent(emis) {

  try {

    const studentSnap = await getDoc(doc(db, "students", emis));

    if (!studentSnap.exists()) return;

    const student = studentSnap.data();

    document.getElementById("studentName").value = student.name;
    document.getElementById("studentName").readOnly = true;

  } catch (e) {

    console.log(e);

  }

}
window.submitLeave = async function () {

  const emis = document.getElementById("emis").value.trim();
  const leaveDate = document.getElementById("leaveDate").value;
  const reason = document.getElementById("reason").value.trim();

  if (!emis || !leaveDate || !reason) {
    alert("Please fill all required fields.");
    return;
  }

  try {

    // Student Details
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

    document.getElementById("emis").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("leaveDate").value = "";
    document.getElementById("reason").value = "";

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

};
