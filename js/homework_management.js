import { db } from "../firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

window.saveHomework = async function () {

  const className = document.getElementById("classFilter").value;
  const section = document.getElementById("sectionFilter").value;
  const dueDate = document.getElementById("dueDate").value;
  const homework = document.getElementById("homeworkText").value.trim();

  if (!className || !section || !dueDate || !homework) {
    alert("Please fill all fields");
    return;
  }
    await addDoc(collection(db, "homework"), {

    class: className,
    section: section,
    dueDate: dueDate,
    homework: homework,

    status: "Active",

    createdAt: new Date().toISOString()

  });

  alert("✅ Homework Saved Successfully");

  document.getElementById("classFilter").value = "";
  document.getElementById("sectionFilter").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("homeworkText").value = "";

}
