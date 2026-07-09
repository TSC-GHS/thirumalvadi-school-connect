import { db } from "../firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

window.submitLeave = async function () {

  const emis = document.getElementById("emis").value.trim();
  const studentName = document.getElementById("studentName").value.trim();
  const leaveDate = document.getElementById("leaveDate").value;
  const reason = document.getElementById("reason").value.trim();

  if (!emis || !studentName || !leaveDate || !reason) {

    alert("Please fill all fields");

    return;

  }

  try {

    await addDoc(collection(db, "leave_requests"), {

      emis: emis,
      studentName: studentName,
      leaveDate: leaveDate,
      reason: reason,
      status: "Pending",
      teacherRemark: "",
      createdAt: new Date().toISOString()

    });

    alert("✅ Leave Request Submitted Successfully");

    document.getElementById("emis").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("leaveDate").value = "";
    document.getElementById("reason").value = "";

  } catch (error) {

    console.log(error);
    alert(error.message);

  }

};
