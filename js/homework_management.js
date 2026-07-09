import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const saveBtn = document.getElementById("saveHomework");
const homeworkList = document.getElementById("homeworkList");

async function loadHomework() {

  homeworkList.innerHTML = "Loading Homework...";

  try {

    const q = query(
      collection(db, "homework"),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    homeworkList.innerHTML = "";

    if (snap.empty) {

      homeworkList.innerHTML = "<p>No Homework Available</p>";

      return;

    }

    snap.forEach((docSnap) => {

      const data = docSnap.data();

      homeworkList.innerHTML += `

      <div class="homeworkCard">

      <h3>${data.title}</h3>

      <p>${data.description}</p>

      <p><b>Class :</b> ${data.className}-${data.section}</p>

      <p><b>Subject :</b> ${data.subject}</p>

      <p><b>Due Date :</b> ${data.dueDate}</p>

      <button onclick="deleteHomework('${docSnap.id}')">

      🗑 Delete

      </button>

      </div>

      <br>

      `;

    });

  } catch (e) {

    console.error(e);

    homeworkList.innerHTML = "Failed to Load Homework";

  }

}

loadHomework();
