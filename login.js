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
  const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();
const selectedRole = document.getElementById("role").value;

if (email === "" || password === "") {
    alert("Please enter Email and Password");
    return;
}

try {

    await signInWithEmailAndPassword(auth, email, password);

    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {

        alert("User role not found.");

        await signOut(auth);

        return;

    }

    const user = userSnap.data();

    if (user.role !== selectedRole) {

        alert("Selected role does not match your account.");

        await signOut(auth);

        return;

    }
  switch (user.role) {

    case "Admin":
        window.location.href = "admin_dashboard.html";
        break;

    case "Headmaster":
        window.location.href = "headmaster.html";
        break;

    case "Teacher":
        window.location.href = "teacher_dashboard.html";
        break;

    case "Parent":
        window.location.href = "parent_dashboard.html";
        break;

    case "Student":
        window.location.href = "student.html";
        break;

    default:
        alert("Invalid User Role");
        await signOut(auth);
        return;
  }
  } catch (error) {

    alert("Login Failed\n\n" + error.message);

}

}
