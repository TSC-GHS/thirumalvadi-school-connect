import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const homeworkTable = document.getElementById("homeworkTable");

window.loadHomework = async function () {

  homeworkTable.innerHTML = "";

  const classFilter = document.getElementById("classFilter").value;
  const sectionFilter = document.getElementById("sectionFilter").value;

  const q = query(
    collection(db, "homework"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  if (snap.empty) {

    homeworkTable.innerHTML = `
      <tr>
        <td colspan="4">No Homework Found</td>
      </tr>
    `;

    return;
  }
  snap.forEach((docSnap) => {

    const data = docSnap.data();

    if (
      (classFilter === "" || data.class === classFilter) &&
      (sectionFilter === "" || data.section === sectionFilter)
    ) {

      homeworkTable.innerHTML += `
        <tr>
          <td>${data.class}</td>
          <td>${data.section}</td>
          <td>${data.dueDate}</td>
          <td>${data.homework}</td>
        </tr>
      `;
    }

  });

  if (homeworkTable.innerHTML === "") {

    homeworkTable.innerHTML = `
      <tr>
        <td colspan="4">
          No Homework Found
        </td>
      </tr>
    `;

  }

}
