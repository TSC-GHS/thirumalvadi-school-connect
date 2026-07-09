import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const saveBtn = document.getElementById("saveBtn");
const noticeList = document.getElementById("noticeList");

async function loadNotices() {

  const q = query(
    collection(db, "notices"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  noticeList.innerHTML = "";

  if (snap.empty) {
    noticeList.innerHTML = "<p>No Notices Available</p>";
    return;
  }

  snap.forEach((doc) => {

    const data = doc.data();

    noticeList.innerHTML += `

    <div class="noticeCard">

      <h3>${data.title}</h3>

      <p>${data.message}</p>

      <p><b>Priority:</b> ${data.priority}</p>

      <p><b>Target:</b> ${data.target}</p>

      <p><b>Publish:</b> ${data.publishDate}</p>

      <p><b>Expiry:</b> ${data.expiryDate}</p>

    </div>

    <hr>

    `;

  });

}

loadNotices();

saveBtn.addEventListener("click", async () => {

  const title = document.getElementById("noticeTitle").value.trim();
  const message = document.getElementById("noticeMessage").value.trim();
  const priority = document.getElementById("priority").value;
  const target = document.getElementById("target").value;
  const publishDate = document.getElementById("publishDate").value;
  const expiryDate = document.getElementById("expiryDate").value;

  if (!title || !message || !priority || !publishDate || !expiryDate) {

    alert("Please fill all fields");

    return;

  }

  await addDoc(collection(db, "notices"), {

    title,
    message,
    priority,
    target,
    publishDate,
    expiryDate,
    status: "Active",
    createdAt: new Date().toISOString()

  });

  alert("✅ Notice Saved Successfully");

  document.getElementById("noticeTitle").value = "";
  document.getElementById("noticeMessage").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("target").value = "All";
  document.getElementById("publishDate").value = "";
  document.getElementById("expiryDate").value = "";

  loadNotices();

});
