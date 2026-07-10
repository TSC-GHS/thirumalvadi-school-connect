import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

window.loginUser = async function () {

  let loginId = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const selectedRole = document.getElementById("role").value;

  if (loginId === "" || password === "") {
    alert("Please enter Login ID and Password");
    return;
  }

  // Parent Login
  if (selectedRole === "Parent") {
    loginId = loginId + "@schoolconnecttn.app";
  }

  // Student Login
  if (selectedRole === "Student") {
    loginId = loginId + "@student.schoolconnecttn.app";
  }

  try {

    await signInWithEmailAndPassword(auth, loginId, password);

    const userRef = doc(db, "users", loginId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User Record Not Found");
      await signOut(auth);
      return;
    }

    const user = userSnap.data();
        if (user.role !== selectedRole) {

      alert("Selected Role is Incorrect");

      await signOut(auth);

      return;

    }

    switch (user.role) {

      case "Admin":

        window.location.href = "admin_dashboard.html";

        break;

      case "Headmaster":

        localStorage.setItem("userRole", "Headmaster");

        window.location.href = "headmaster.html";

        break;

      case "Teacher":

        // Save Teacher Session

        localStorage.setItem("teacherId", user.teacherId || "");

        localStorage.setItem("teacherName", user.name || "");

        localStorage.setItem("userRole", "Teacher");

        sessionStorage.setItem("teacherId", user.teacherId || "");

        sessionStorage.setItem("teacherName", user.name || "");

        sessionStorage.setItem("userRole", "Teacher");

        window.location.href = "teacher.html";

        break;
              case "Parent":

        localStorage.setItem("parentEMIS", user.emis || "");
        localStorage.setItem("emis", user.emis || "");

        sessionStorage.setItem("parentEMIS", user.emis || "");
        sessionStorage.setItem("emis", user.emis || "");

        window.location.href = "parent.html";

        break;

      case "Student":

        localStorage.setItem("studentEMIS", user.emis || "");
        localStorage.setItem("emis", user.emis || "");

        sessionStorage.setItem("studentEMIS", user.emis || "");
        sessionStorage.setItem("emis", user.emis || "");

        window.location.href = "student.html";

        break;

      default:

        alert("Invalid User Role");

        await signOut(auth);

        return;

    }

  } catch (error) {

    console.error(error);

    alert("Login Failed\n\n" + error.message);

    try {

      await signOut(auth);

    } catch (e) {

      console.log(e);

    }

  }

};
