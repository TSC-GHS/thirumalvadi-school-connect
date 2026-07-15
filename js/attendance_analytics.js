import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//============================
// Elements
//============================

const totalStudents = document.getElementById("totalStudents");
const presentStudents = document.getElementById("presentStudents");
const absentStudents = document.getElementById("absentStudents");
const attendancePercent = document.getElementById("attendancePercent");

const classAttendance = document.getElementById("classAttendance");

const highestClass = document.getElementById("highestClass");
const lowestClass = document.getElementById("lowestClass");

const boysAttendance = document.getElementById("boysAttendance");
const girlsAttendance = document.getElementById("girlsAttendance");

//============================

loadAttendanceAnalytics();

//============================

async function loadAttendanceAnalytics() {

  try {

    // Students

    const studentSnap = await getDocs(collection(db, "students"));

    const total = studentSnap.size;

    totalStudents.textContent = total;

    const studentGender = {};

    const classWise = {};

    let totalBoys = 0;
    let totalGirls = 0;

    studentSnap.forEach((doc) => {

      const s = doc.data();

      studentGender[s.emis] = (s.gender || "").toLowerCase();

      if (studentGender[s.emis] === "male") {

        totalBoys++;

      } else if (studentGender[s.emis] === "female") {

        totalGirls++;

      }

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

    let presentBoys = 0;
    let presentGirls = 0;

    attendanceSnap.forEach((doc) => {

      const data = doc.data();

      if (data.status === "Present") {

        present++;

        const gender = studentGender[data.emis];

        if (gender === "male") {

          presentBoys++;

        } else if (gender === "female") {

          presentGirls++;

        }

        const cls = `${data.class}-${data.section}`;

        if (classWise[cls]) {

          classWise[cls].present++;

        }

      }

    });

    // Summary

    presentStudents.textContent = present;

    absentStudents.textContent = total - present;

    const overallPercent = total === 0
      ? 0
      : ((present / total) * 100).toFixed(1);

    attendancePercent.textContent = overallPercent + "%";

    // Boys %

    const boysPercent = totalBoys === 0
      ? 0
      : ((presentBoys / totalBoys) * 100).toFixed(1);

    boysAttendance.textContent = boysPercent + "%";

    // Girls %

    const girlsPercent = totalGirls === 0
      ? 0
      : ((presentGirls / totalGirls) * 100).toFixed(1);

    girlsAttendance.textContent = girlsPercent + "%";

    // Class Wise

    let html = "";

    let high = -1;
    let low = 101;

    let highName = "-";
    let lowName = "-";

    Object.keys(classWise).sort().forEach((cls) => {

      const item = classWise[cls];

      const p = item.total === 0
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

          <div class="progressBar"

          style="width:${p}%">

          </div>

        </div>

      </div>

      `;

    });

    classAttendance.innerHTML = html;

    highestClass.textContent = `${highName} (${high}%)`;

    lowestClass.textContent = `${lowName} (${low}%)`;

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

}

console.log("Attendance Analytics Loaded");
