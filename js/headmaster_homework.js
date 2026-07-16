//==================================================
// School Connect TN
// Headmaster Homework Analytics
// Part 1
//==================================================

import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Elements
//==================================================

const totalHomework = document.getElementById("totalHomework");
const todayHomework = document.getElementById("todayHomework");
const teacherCount = document.getElementById("teacherCount");
const classCount = document.getElementById("classCount");

const teacherWise = document.getElementById("teacherWise");
const classWise = document.getElementById("classWise");
const latestHomework = document.getElementById("latestHomework");

//==================================================
// Load
//==================================================

loadHomeworkAnalytics();

async function loadHomeworkAnalytics() {

  try {

    const snap = await getDocs(
      query(
        collection(db, "homework"),
        orderBy("createdAt", "desc")
      )
    );

    if (snap.empty) {

      totalHomework.textContent = "0";
      todayHomework.textContent = "0";
      teacherCount.textContent = "0";
      classCount.textContent = "0";

      teacherWise.innerHTML =
        "<p style='text-align:center'>No Homework Available</p>";

      classWise.innerHTML =
        "<p style='text-align:center'>No Homework Available</p>";

      latestHomework.innerHTML =
        "<p style='text-align:center'>No Homework Available</p>";

      return;
    }

    const homework = [];

    snap.forEach((doc) => {

      homework.push(doc.data());

    });

    //====================================
    // Summary
    //====================================

    totalHomework.textContent = homework.length;

    const today =
      new Date().toISOString().split("T")[0];

    let todayCount = 0;

    const teacherMap = {};
    const classMap = {};

    homework.forEach((hw) => {

      const hwDate =
        hw.dueDate || hw.date || "";

      if (hwDate === today) {

        todayCount++;

      }

      const teacher =
        hw.teacherName || "Unknown";

      teacherMap[teacher] =
        (teacherMap[teacher] || 0) + 1;

      const cls =
        `${hw.className || hw.class || "-"}-${hw.section || "-"}`;

      classMap[cls] =
        (classMap[cls] || 0) + 1;

    });

    todayHomework.textContent = todayCount;
    teacherCount.textContent = Object.keys(teacherMap).length;
    classCount.textContent = Object.keys(classMap).length;

    //====================================
    // Teacher Wise
    //====================================

    let teacherHTML = "";

    Object.keys(teacherMap)
      .sort()
      .forEach((teacher) => {

        teacherHTML += `
<div class="item">
<span>👨‍🏫 ${teacher}</span>
<span>${teacherMap[teacher]} Homework</span>
</div>
`;

      });

    teacherWise.innerHTML = teacherHTML;
    //====================================
    // Class Wise
    //====================================

    let classHTML = "";

    Object.keys(classMap)
      .sort()
      .forEach((cls) => {

        classHTML += `
<div class="item">
<span>🏫 ${cls}</span>
<span>${classMap[cls]} Homework</span>
</div>
`;

      });

    classWise.innerHTML = classHTML;

    //====================================
    // Latest Homework
    //====================================

    let latestHTML = "";

    homework
      .sort((a, b) => {

        const t1 = a.createdAt?.seconds || 0;
        const t2 = b.createdAt?.seconds || 0;

        return t2 - t1;

      });

    homework.slice(0, 10).forEach((hw) => {

      latestHTML += `
<div class="item">

<div>
<b>${hw.subject || "-"}</b><br>

Class : ${hw.className || hw.class || "-"}-${hw.section || "-"}<br>

${hw.title || hw.description || "-"}
</div>

<div>
${hw.dueDate || hw.date || "-"}
</div>

</div>
`;

    });

    latestHomework.innerHTML = latestHTML;

    console.log("Homework Analytics Loaded Successfully");

  } catch (error) {

    console.error("Homework Analytics Error :", error);

    totalHomework.textContent = "0";
    todayHomework.textContent = "0";
    teacherCount.textContent = "0";
    classCount.textContent = "0";

    teacherWise.innerHTML =
      "<p style='text-align:center;color:red;'>Failed to load data</p>";

    classWise.innerHTML =
      "<p style='text-align:center;color:red;'>Failed to load data</p>";

    latestHomework.innerHTML =
      "<p style='text-align:center;color:red;'>Failed to load data</p>";

  }

}

//==================================================
// End
//==================================================

console.log("================================");
console.log("School Connect TN");
console.log("Headmaster Homework Analytics");
console.log("================================");
