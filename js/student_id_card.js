import { db } from "../firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const emis = params.get("emis");

async function loadStudent() {

  if (!emis) {
    alert("EMIS parameter missing");
    return;
  }

  try {

    const studentRef = doc(db, "students", emis);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      alert("Student not found");
      return;
    }

    const student = studentSnap.data();

    document.getElementById("name").textContent =
      student.name || "-";

    document.getElementById("emis").textContent =
      student.emis || emis;

    document.getElementById("class").textContent =
      student.class || "-";

    document.getElementById("section").textContent =
      student.section || "-";

    document.getElementById("father").textContent =
      student.father || "-";

    document.getElementById("mother").textContent =
      student.mother || "-";

    document.getElementById("mobile").textContent =
      student.mobile || "-";

  }

  catch (error) {

    console.log(error);

    alert(error.message);

  }

}

window.printCard = function () {

  window.print();

};

loadStudent();
