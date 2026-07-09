import { auth } from "../firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Check Login Session Automatically
onAuthStateChanged(auth, (user) => {

  if (!user) {

    alert("Please Login First");

    window.location.href = "roles.html";

  }

});

// Logout Function
window.logout = async function () {

  try {

    await signOut(auth);

    alert("Logged Out Successfully");

    window.location.href = "roles.html";

  }

  catch (error) {

    alert(error.message);

  }

};
