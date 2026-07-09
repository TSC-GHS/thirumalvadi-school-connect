import { db, auth } from "../firebase.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

async function loadDashboard() {

  try {

    // Students
    const studentSnap = await getDocs(collection(db, "students"));
    document.getElementById("studentCount").textContent = studentSnap.size;

    // Teachers
    const teacherSnap = await getDocs(collection(db, "teachers"));
    document.getElementById("teacherCount").textContent = teacherSnap.size;

    // Pending Leave
    const leaveSnap = await getDocs(
      query(
        collection(db, "leave_requests"),
        where("status", "==", "Pending")
      )
    );

    document.getElementById("leaveCount").textContent = leaveSnap.size;

    // Attendance (Temporary)
    document.getElementById("attendanceCount").textContent = "95%";

    // Pass / Fail (Temporary)
    document.getElementById("passPercentage").textContent = "92%";
    document.getElementById("failPercentage").textContent = "8%";

    // Notice (Temporary)
    document.getElementById("noticeCount").textContent = "3";

  } catch (error) {

    console.error(error);

    alert("Dashboard data loading failed.");

  }

}

loadDashboard();

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {

  await signOut(auth);

  location.href = "index.html";

});
