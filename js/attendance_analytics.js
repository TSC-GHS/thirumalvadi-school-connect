import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Elements
const totalStudents = document.getElementById("totalStudents");
const presentStudents = document.getElementById("presentStudents");
const absentStudents = document.getElementById("absentStudents");
const attendancePercent = document.getElementById("attendancePercent");

const classAttendance = document.getElementById("classAttendance");

const highestClass = document.getElementById("highestClass");
const lowestClass = document.getElementById("lowestClass");

const boysAttendance = document.getElementById("boysAttendance");
const girlsAttendance = document.getElementById("girlsAttendance");

loadAttendanceAnalytics();

async function loadAttendanceAnalytics() {

  try {

    // Students
    const studentSnap = await getDocs(collection(db, "students"));

    const total = studentSnap.size;

    totalStudents.textContent = total;

    const classWise = {};

    // Build Class Strength
    studentSnap.forEach((doc) => {

      const s = doc.data();

      const cls = `${s.class}-${s.section}`;

      if (!classWise[cls]) {

        classWise[cls] = {
          total: 0,
          present: 0
        };

      }

      classWise[cls].total++;

    });

    // Today's Attendance

    const today = new Date().toISOString().split("T")[0];

    const attendanceSnap = await getDocs(

      query(
        collection(db, "attendance"),
        where("date", "==", today)
      )

    );

    let present = 0;

    attendanceSnap.forEach((doc) => {

      const data = doc.data();

      const cls = `${data.class}-${data.section}`;

      if (data.status === "Present") {

        present++;

        if (classWise[cls]) {

          classWise[cls].present++;

        }

      }

    });

    const absent = total - present;

    presentStudents.textContent = present;
    absentStudents.textContent = absent;

    const percent =
      total === 0
        ? 0
        : ((present / total) * 100).toFixed(1);

    attendancePercent.textContent = percent + "%";

    // Temporary (Later gender-wise analytics)

    boysAttendance.textContent = percent + "%";
    girlsAttendance.textContent = percent + "%";

    // Class Wise

    let html = "";

    let high = -1;
    let low = 101;

    let highName = "-";
    let lowName = "-";

    Object.keys(classWise)
      .sort()
      .forEach((cls) => {

        const item = classWise[cls];

        const p =
          item.total === 0
            ? 0
            : ((item.present / item.total) * 100).toFixed(1);

        if (Number(p) > high) {

          high = Number(p);
          highName = cls;

        }

        if (Number(p) < low) {

          low = Number(p);
          lowName = cls;

        }

        html += `

<div class="classItem">

<div class="classHeader">

<span>${cls}</span>

<span>${p}%</span>

</div>

<div class="progress">

<div class="progressBar" style="width:${p}%"></div>

</div>

</div>

`;

      });

    classAttendance.innerHTML = html;

    highestClass.textContent = `${highName} (${high}%)`;
    lowestClass.textContent = `${lowName} (${low}%)`;

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}

console.log("Attendance Analytics Loaded");
