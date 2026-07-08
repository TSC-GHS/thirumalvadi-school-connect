import { db } from "../firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const reportArea = document.getElementById("reportArea");

window.loadReport = async function () {

  const emis = document.getElementById("emis").value.trim();

  if (!emis) {
    alert("Please enter EMIS Number");
    return;
  }

  const reportRef = doc(db, "marks", "Unit Test 1", "students", emis);
  const reportSnap = await getDoc(reportRef);

  if (!reportSnap.exists()) {

    reportArea.innerHTML = `
      <h3 style="color:red;text-align:center;">
        No Report Found
      </h3>
    `;

    return;
  }

  const report = reportSnap.data();
    reportArea.innerHTML = `

  <div style="
    background:white;
    padding:20px;
    border-radius:10px;
    border:2px solid #1565C0;
  ">

    <h2 style="text-align:center;color:#1565C0;">
      Thirumalvadi Government High School
    </h2>

    <h3 style="text-align:center;">
      Student Report Card
    </h3>

    <hr>

    <p><b>EMIS :</b> ${report.emis}</p>
    <p><b>Name :</b> ${report.name}</p>
    <p><b>Class :</b> ${report.class} - ${report.section}</p>

    <table
      border="1"
      width="100%"
      cellspacing="0"
      cellpadding="8"
      style="margin-top:15px;border-collapse:collapse;">

      <tr>
        <th>Subject</th>
        <th>Mark</th>
      </tr>

      <tr><td>Tamil</td><td>${report.tamil}</td></tr>
      <tr><td>English</td><td>${report.english}</td></tr>
      <tr><td>Maths</td><td>${report.maths}</td></tr>
      <tr><td>Science</td><td>${report.science}</td></tr>
      <tr><td>Social</td><td>${report.social}</td></tr>

      <tr>
        <th>Total</th>
        <th>${report.total}</th>
      </tr>

      <tr>
        <th>Percentage</th>
        <th>${report.percentage}%</th>
      </tr>

      <tr>
        <th>Grade</th>
        <th>${report.grade}</th>
      </tr>

    </table>

  </div>

  `;

}
