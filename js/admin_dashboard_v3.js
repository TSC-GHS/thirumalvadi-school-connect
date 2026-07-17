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

    const students = await getDocs(collection(db, "students"));
    document.getElementById("studentCount").textContent = students.size;

    const teachers = await getDocs(collection(db, "teachers"));
    document.getElementById("teacherCount").textContent = teachers.size;

    const homework = await getDocs(collection(db, "homework"));
    document.getElementById("homeworkCount").textContent = homework.size;

    let notices = 0;

    try {
      const noticeData = await getDocs(collection(db, "notices"));
      notices = noticeData.size;
    } catch {
      const noticeData = await getDocs(collection(db, "notice"));
      notices = noticeData.size;
    }

    document.getElementById("noticeCount").textContent = notices;

  } catch (error) {

    console.error("Dashboard Error:", error);
    alert("Unable to load dashboard data.");

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

    alert("Logout Failed");

  }

};

//==================================================
// Load
//==================================================

document.addEventListener("DOMContentLoaded", loadDashboard);
