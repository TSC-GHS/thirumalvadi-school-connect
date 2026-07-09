import { db } from "../firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const studentInfo = document.getElementById("studentInfo");
const reportBody = document.getElementById("reportBody");

const params = new URLSearchParams(window.location.search);

let emis = params.get("emis");

if (!emis) {
  emis = localStorage.getItem("parentEMIS");
}

async function loadReportCard() {

  if (!emis) {
    studentInfo.innerHTML = "<h3 style='color:red'>EMIS Number Not Found</h3>";
    return;
  }

  try {

    const studentRef = doc(db, "students", String(emis));
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {

      studentInfo.innerHTML = "<h3>Student Not Found</h3>";
      return;

    }

    const student = studentSnap.data();

    studentInfo.innerHTML = `
      <p><b>Name :</b> ${student.name}</p>
      <p><b>EMIS :</b> ${student.emis}</p>
      <p><b>Class :</b> ${student.class}</p>
      <p><b>Section :</b> ${student.section}</p>
    `;

    const subjects = [
      "Tamil",
      "English",
      "Maths",
      "Science",
      "Social"
    ];

    reportBody.innerHTML = "";

    subjects.forEach(subject => {

      let mark = "-";

      if (student.marks && student.marks[subject] != null) {
        mark = student.marks[subject];
      }

      let grade = "-";

      if (mark !== "-") {

        if (mark >= 90) grade = "A+";
        else if (mark >= 80) grade = "A";
        else if (mark >= 70) grade = "B+";
        else if (mark >= 60) grade = "B";
        else if (mark >= 50) grade = "C";
        else grade = "RA";

      }

      reportBody.innerHTML += `
      <tr>
        <td>${subject}</td>
        <td>${mark}</td>
        <td>${grade}</td>
      </tr>
      `;

    });

  } catch (error) {

    console.log(error);

    studentInfo.innerHTML =
      "<h3 style='color:red'>" + error.message + "</h3>";

  }

}

loadReportCard();
