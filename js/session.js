import { auth } from "../firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

window.checkSession = function () {

  onAuthStateChanged(auth, (user) => {

    if (!user) {

      alert("Please Login First");

      window.location.href = "roles.html";

    }

  });

};
window.logout = async function () {

  try {

    await auth.signOut();

    alert("Logged Out Successfully");

    window.location.href = "roles.html";

  }

  catch (error) {

    alert(error.message);

  }

};
