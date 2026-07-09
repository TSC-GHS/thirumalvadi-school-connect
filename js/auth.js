import { auth } from "../firebase.js";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

window.login = async function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (!email || !password || !role) {
    alert("Please fill all fields");
    return;
  }

  try {

    await signInWithEmailAndPassword(auth, email, password);

    if (role === "headmaster") {
      location.href = "headmaster.html";
    } else if (role === "teacher") {
      location.href = "teacher.html";
    } else if (role === "parent") {
      location.href = "parent_dashboard_v2.html";
    }

  } catch (error) {

    alert("Login Failed\n\n" + error.message);

  }

};

window.forgotPassword = async function () {

  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Enter your email first");
    return;
  }

  try {

    await sendPasswordResetEmail(auth, email);

    alert("Password reset email sent successfully.");

  } catch (error) {

    alert(error.message);

  }

};
