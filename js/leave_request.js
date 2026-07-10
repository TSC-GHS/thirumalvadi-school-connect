import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ======================================
// Parent Leave Request
// ======================================

window.submitLeave = async function () {

  const emis =
    document.getElementById("emis").value.trim();

  const studentName =
    document.getElementById("studentName").value.trim();

  const className =
    document.getElementById("className")?.value.trim() || "";

  const section =
    document.getElementById("section")?.value.trim() || "";

  const leaveDate =
    document.getElementById("leaveDate").value;

  const reason =
    document.getElementById("reason").value.trim();

  if (
    !emis ||
    !studentName ||
    !leaveDate ||
    !reason
  ) {

    alert("Please fill all required fields.");

    return;

  }

  try {
        await addDoc(collection(db, "leave_requests"), {

      emis: emis,
      studentName: studentName,

      class: className,
      section: section,

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

    if(document.getElementById("className"))
      document.getElementById("className").value = "";

    if(document.getElementById("section"))
      document.getElementById("section").value = "";

    document.getElementById("leaveDate").value = "";
    document.getElementById("reason").value = "";
        console.log("Leave Request Submitted Successfully");

  } catch (error) {

    console.error("Leave Request Error:", error);

    alert(
      "Failed to submit leave request.\n\n" +
      error.message
    );

  }

};
