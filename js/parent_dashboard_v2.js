import { db } from "../firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const studentName = document.getElementById("studentName");
const attendanceValue = document.getElementById("attendanceValue");
const gradeValue = document.getElementById("gradeValue");
const noticeText = document.getElementById("noticeText");

// தற்போது test செய்வதற்காக EMIS
const emis = "6100000005";

async function loadDashboard() {

  const studentSnap = await getDoc(doc(db, "students", emis));

  if (studentSnap.exists()) {

    const student = studentSnap.data();

    studentName.textContent = student.name || "-";

  }

  const reportSnap = await getDoc(
    doc(db, "marks", "Unit Test", "students", emis)
  );

  if (reportSnap.exists()) {

    const report = reportSnap.data();

    gradeValue.textContent = report.grade || "-";

  }
  const attendanceSnap = await getDoc(
    doc(db, "students", emis)
  );

  if (attendanceSnap.exists()) {

    const student = attendanceSnap.data();

    // Attendance (Present / Absent / Leave)
    attendanceValue.textContent =
      student.attendance || "-";

  }

  const noticeSnap = await getDoc(
    doc(db, "notices", "latest")
  );

  if (noticeSnap.exists()) {

    const notice = noticeSnap.data();

    noticeText.textContent =
      notice.message || "No Notices";

  } else {

    noticeText.textContent = "No Notices";

  }

}

loadDashboard();
