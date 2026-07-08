import { db } from "../firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

window.saveNotice = async function () {

  const title = document.getElementById("noticeTitle").value.trim();
  const message = document.getElementById("noticeMessage").value.trim();
  const priority = document.getElementById("priority").value;
  const publishDate = document.getElementById("publishDate").value;

  if (!title || !message || !priority || !publishDate) {
    alert("Please fill all fields");
    return;
  }
    await addDoc(collection(db, "notices"), {

    title: title,
    message: message,
    priority: priority,
    publishDate: publishDate,

    status: "Active",

    createdAt: new Date().toISOString()

  });

  alert("✅ Notice Saved Successfully");

  document.getElementById("noticeTitle").value = "";
  document.getElementById("noticeMessage").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("publishDate").value = "";

}
