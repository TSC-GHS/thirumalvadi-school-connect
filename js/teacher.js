import { auth, db } from "../firebase.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// =====================================
// Elements
// =====================================

const teacherName = document.getElementById("teacherName");
const teacherRole = document.getElementById("teacherRole");

const attendanceCount = document.getElementById("attendanceCount");
const homeworkCount = document.getElementById("homeworkCount");
const noticeCount = document.getElementById("noticeCount");
const leaveCount = document.getElementById("leaveCount");

const leaveMenu = document.getElementById("leaveMenu");
const leaveCard = document.getElementById("leaveCard");

const logoutBtn = document.getElementById("logoutBtn");

let currentTeacher = null;
// =====================================
// Load Teacher Profile
// =====================================

async function loadTeacher() {

const teacherId = localStorage.getItem("teacherId");

alert("Teacher ID : " + teacherId);

if (!teacherId) {

alert("Teacher session expired.");

location.href = "index.html";

return;

}

const teacherRef = doc(db, "teachers", teacherId);

const teacherSnap = await getDoc(teacherRef);

alert("Searching : teachers/" + teacherId);

alert("Document Exists : " + teacherSnap.exists());

if (!teacherSnap.exists()) {

alert("Teacher record not found.");

location.href = "index.html";

return;

}

currentTeacher = teacherSnap.data();

teacherName.textContent = currentTeacher.name || "Teacher";

teacherRole.textContent = currentTeacher.teacherType || "Teacher";

if (currentTeacher.teacherType === "Subject Teacher") {

leaveMenu.style.display = "none";

leaveCard.style.display = "none";

}

}
// =====================================
// Dashboard Counts
// =====================================

async function loadDashboard() {

  // Homework Count
  const homeworkSnap =
    await getDocs(collection(db, "homework"));
  homeworkCount.textContent = homeworkSnap.size;

  // Notice Count
  const noticeSnap =
    await getDocs(collection(db, "notices"));
  noticeCount.textContent = noticeSnap.size;

  // Attendance (Temporary)
  attendanceCount.textContent = "Today";

  // Leave Count
  if (currentTeacher.teacherType === "Class Teacher") {

    const leaveQuery = query(
      collection(db, "leave_requests"),
      where("status", "==", "Pending")
    );

    const leaveSnap = await getDocs(leaveQuery);

    let pending = 0;

    leaveSnap.forEach((docSnap) => {

      const leave = docSnap.data();

      if (
        leave.class === currentTeacher.className &&
        leave.section === currentTeacher.section
      ) {
        pending++;
      }

    });

    leaveCount.textContent = pending;

  } else {

    leaveCount.textContent = "-";

  }

}

// =====================================
// Initialize Dashboard
// =====================================

async function initializeDashboard() {

  try {

    await loadTeacher();

    if (!currentTeacher) return;

    await loadDashboard();

    console.log("Teacher Dashboard Loaded Successfully");

  } catch (error) {

    console.error(error);

    alert(
      "Dashboard Error\n\n" +
      error.code +
      "\n\n" +
      error.message
    );

  }

}
// =====================================
// Auto Refresh
// =====================================

setInterval(async () => {

  try {

    if (currentTeacher) {
      await loadDashboard();
    }

  } catch (error) {

    console.log("Dashboard Refresh Error", error);

  }

}, 60000);

// =====================================
// Logout
// =====================================

logoutBtn.addEventListener("click", async () => {

  if (!confirm("Are you sure you want to logout?")) return;

  try {

    await signOut(auth);

  } catch (error) {

    console.log(error);

  }

  localStorage.removeItem("teacherId");
  sessionStorage.clear();

  location.href = "index.html";

});

// =====================================
// Initialize
// =====================================

initializeDashboard();

// =====================================
// Version
// =====================================

console.log("================================");
console.log("School Connect TN");
console.log("Teacher Dashboard V3");
console.log("================================");

// =====================================
// Error Handler
// =====================================

window.addEventListener("error", (event) => {
  console.error(event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error(event.reason);
});
