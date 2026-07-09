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
// Save Homework

saveBtn.addEventListener("click", async () => {

  const title = document.getElementById("homeworkTitle").value.trim();
  const description = document.getElementById("homeworkDescription").value.trim();
  const className = document.getElementById("className").value;
  const section = document.getElementById("section").value;
  const subject = document.getElementById("subject").value;
  const dueDate = document.getElementById("dueDate").value;

  if (
    !title ||
    !description ||
    !className ||
    !section ||
    !subject ||
    !dueDate
  ) {

    alert("Please fill all fields");

    return;

  }

  try {

    await addDoc(collection(db, "homework"), {

      title,
      description,
      className,
      section,
      subject,
      dueDate,
      status: "Active",
      createdAt: new Date().toISOString()

    });

    alert("✅ Homework Saved Successfully");

    document.getElementById("homeworkTitle").value = "";
    document.getElementById("homeworkDescription").value = "";
    document.getElementById("className").value = "";
    document.getElementById("section").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("dueDate").value = "";

    loadHomework();

  } catch (error) {

    console.error(error);

    alert("Failed to save homework.");

  }

});

// Delete Homework

window.deleteHomework = async function(id){

  if(!confirm("Delete this homework?")) return;

  try {

    await deleteDoc(doc(db, "homework", id));

    alert("✅ Homework Deleted");

    loadHomework();

  } catch (error) {

    console.error(error);

    alert("Failed to delete homework.");

  }

};
