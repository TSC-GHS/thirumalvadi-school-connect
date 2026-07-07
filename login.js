import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

window.loginUser = async function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if(email === "" || password === ""){
    alert("Please enter Email and Password");
    return;
  }

  try {

    await signInWithEmailAndPassword(auth, email, password);

    switch(role){

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
        alert("Invalid Role");

    }

  } catch(error){

    alert("Login Failed\n\n" + error.message);

  }

}
