import { auth, db } from "../firebase.js";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

window.login = async function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {

    alert("Please enter Email and Password");

    return;

  }

  try {

    const userCredential = await signInWithEmailAndPassword(

      auth,

      email,

      password

    );

    const uid = userCredential.user.uid;
        const roleSnap = await getDoc(doc(db, "roles", uid));

    if (!roleSnap.exists()) {

      alert("Access Denied");

      return;

    }

    const role = roleSnap.data().role;

    if (role === "headmaster") {

      location.href = "headmaster.html";

    }

    else if (role === "teacher") {

      location.href = "teacher.html";

    }

    else if (role === "parent") {

      location.href = "parent_dashboard_v2.html";

    }

    else {

      alert("Invalid User Role");

    }

  }

  catch (error) {

    alert("Login Failed\n\n" + error.message);

  }

};

window.forgotPassword = async function () {

  const email = document.getElementById("email").value.trim();

  if (!email) {

    alert("Enter your email");

    return;

  }

  try {

    await sendPasswordResetEmail(auth, email);

    alert("Password Reset Email Sent Successfully");

  }

  catch (error) {

    alert(error.message);

  }

};
