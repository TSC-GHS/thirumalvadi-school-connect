//==================================================
// School Connect TN
// Admin Dashboard V3 Stable
//==================================================

import { db, auth } from "../firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

//==================================================
// Session Check
//==================================================

const role = localStorage.getItem("userRole");

if (role !== "Admin") {
  window.location.href = "login.html";
}

//==================================================
// Dashboard
//==================================================

async function loadDashboard() {

  try {

    // Students
    const studentSnap = await getDocs(collection(db, "students"));
    const studentEl = document.getElementById("studentCount");
    if (studentEl) {
      studentEl.textContent = studentSnap.size;
    }

    // Teachers
    const teacherSnap = await getDocs(collection(db, "teachers"));
    const teacherEl = document.getElementById("teacherCount");
    if (teacherEl) {
      teacherEl.textContent = teacherSnap.size;
    }

    // Homework
    const homeworkSnap = await getDocs(collection(db, "homework"));
    const homeworkEl = document.getElementById("homeworkCount");
    if (homeworkEl) {
      homeworkEl.textContent = homeworkSnap.size;
    }

    // Notices
    let noticeCount = 0;

    try {
      const noticeSnap = await getDocs(collection(db, "notices"));
      noticeCount = noticeSnap.size;
    } catch {
      const noticeSnap = await getDocs(collection(db, "notice"));
      noticeCount = noticeSnap.size;
    }

    const noticeEl = document.getElementById("noticeCount");
    if (noticeEl) {
      noticeEl.textContent = noticeCount;
    }

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

}

//==================================================
// Logout
//==================================================

window.logoutAdmin = async function () {

  try {

    await signOut(auth);

    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "login.html";

  } catch (error) {

    alert(error.message);

  }

};

//==================================================
// Load Dashboard
//==================================================

document.addEventListener("DOMContentLoaded", loadDashboard);
