import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");

  if (!loginBtn) return;

  loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

      await signInWithEmailAndPassword(auth, email, password);

      alert("Login Successful");

      window.location.href = "dashboard.html";

    } catch (error) {

      alert(error.message);

    }

  });

});
