import { auth, db } from "../firebase.js";

import {
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// =====================================
// Elements
// =====================================

const teacherIdElement = document.getElementById("teacherId");
const teacherNameElement = document.getElementById("teacherName");
const teacherTypeElement = document.getElementById("teacherType");
const subjectElement = document.getElementById("subject");
const classNameElement = document.getElementById("className");
const sectionElement = document.getElementById("section");
const emailElement = document.getElementById("email");
const mobileElement = document.getElementById("mobile");

const logoutBtn = document.getElementById("logoutBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");

let currentTeacher = null;

// =====================================
// Load Teacher Profile
// =====================================

async function loadTeacherProfile() {

  const teacherId =
    localStorage.getItem("teacherId") ||
    sessionStorage.getItem("teacherId");

  if (!teacherId) {
    alert("Teacher session expired");
    location.href = "index.html";
    return false;
  }

  const q = query(
    collection(db, "teachers"),
    where("id", "==", teacherId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    alert("Teacher Record Not Found");
    location.href = "index.html";
    return false;
  }

  currentTeacher = snapshot.docs[0].data();

  teacherIdElement.textContent = currentTeacher.id || "-";
  teacherNameElement.textContent = currentTeacher.name || "-";
  teacherTypeElement.textContent = currentTeacher.teacherType || "-";
  subjectElement.textContent = currentTeacher.subject || "-";
  classNameElement.textContent = currentTeacher.className || "-";
  sectionElement.textContent = currentTeacher.section || "-";
  emailElement.textContent = currentTeacher.email || "-";
  mobileElement.textContent = currentTeacher.mobile || "-";

  return true;
}

// =====================================
// Change Password
// =====================================

changePasswordBtn.addEventListener("click", async () => {

  if (!auth.currentUser) {
    alert("Please login again.");
    return;
  }

  try {

    await sendPasswordResetEmail(
      auth,
      auth.currentUser.email
    );

    alert("✅ Password reset email sent.");

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

});

// =====================================
// Logout
// =====================================

logoutBtn.addEventListener("click", async () => {

  if (!confirm("Are you sure you want to logout?")) return;

  try {
    await signOut(auth);
  } catch (e) {
    console.log(e);
  }

  localStorage.removeItem("teacherId");
  localStorage.removeItem("teacherName");
  localStorage.removeItem("userRole");

  sessionStorage.removeItem("teacherId");
  sessionStorage.removeItem("teacherName");
  sessionStorage.removeItem("userRole");

  location.href = "index.html";

});

// =====================================
// Initialize
// =====================================

(async () => {

  try {

    await loadTeacherProfile();
    console.log("Teacher Settings Loaded");

  } catch (error) {

    console.error(error);
    alert("Settings Loading Failed\n\n" + error.message);

  }

})();

// =====================================
// Global Error Handler
// =====================================

window.addEventListener("error", (event) => {
  console.error(event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error(event.reason);
});
