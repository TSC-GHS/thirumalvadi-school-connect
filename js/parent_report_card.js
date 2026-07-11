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
    studentInfo.innerHTML =
      "<h3 style='color:red'>EMIS Number Not Found</h3>";
    return;
  }

  try {

    // Student Details
    const studentSnap = await getDoc(doc(db, "students", emis));

    if (!studentSnap.exists()) {
      studentInfo.innerHTML =
        "<h3 style='color:red'>Student Not Found</h3>";
      return;
    }

    const student = studentSnap.data();

    studentInfo.innerHTML = `
      <p><b>Name :</b> ${student.name || "-"}</p>
      <p><b>EMIS :</b> ${student.emis || emis}</p>
      <p><b>Class :</b> ${student.class || "-"}</p>
      <p><b>Section :</b> ${student.section || "-"}</p>
    `;

    // Unit Test Marks
    const markSnap = await getDoc(
      doc(db, "marks", "Unit Test", "students", emis)
    );

    reportBody.innerHTML = "";

    if (!markSnap.exists()) {

      reportBody.innerHTML = `
      <tr>
        <td colspan="3">No Report Card Available</td>
      </tr>
      `;

      return;
    }

    const m = markSnap.data();

    function grade(mark) {

      if (mark >= 90) return "A+";
      if (mark >= 80) return "A";
      if (mark >= 70) return "B+";
      if (mark >= 60) return "B";
      if (mark >= 50) return "C";
      if (mark >= 35) return "D";
      return "RA";

    }

    reportBody.innerHTML = `

<tr>
<td>Tamil</td>
<td>${m.tamil ?? "-"}</td>
<td>${grade(m.tamil)}</td>
</tr>

<tr>
<td>English</td>
<td>${m.english ?? "-"}</td>
<td>${grade(m.english)}</td>
</tr>

<tr>
<td>Maths</td>
<td>${m.maths ?? "-"}</td>
<td>${grade(m.maths)}</td>
</tr>

<tr>
<td>Science</td>
<td>${m.science ?? "-"}</td>
<td>${grade(m.science)}</td>
</tr>

<tr>
<td>Social</td>
<td>${m.social ?? "-"}</td>
<td>${grade(m.social)}</td>
</tr>

<tr style="background:#E3F2FD;font-weight:bold;">
<td>Total</td>
<td colspan="2">${m.total ?? "-"}</td>
</tr>

<tr style="background:#E3F2FD;font-weight:bold;">
<td>Percentage</td>
<td colspan="2">${m.percentage ?? "-"}%</td>
</tr>

<tr style="background:#E3F2FD;font-weight:bold;">
<td>Result</td>
<td colspan="2">${m.result ?? "-"}</td>
</tr>

`;

  } catch (error) {

    console.error(error);

    studentInfo.innerHTML =
      "<h3 style='color:red'>" + error.message + "</h3>";

  }

}

loadReportCard();
