import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const noticeTable = document.getElementById("noticeTable");

window.loadNotices = async function () {

  noticeTable.innerHTML = "";

  const q = query(
    collection(db, "notices"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  if (snap.empty) {

    noticeTable.innerHTML = `
      <tr>
        <td colspan="3">No Notices Found</td>
      </tr>
    `;

    return;
  }
    snap.forEach((docSnap) => {

    const notice = docSnap.data();

    noticeTable.innerHTML += `

      <tr>

        <td>${notice.title}</td>

        <td>${notice.priority}</td>

        <td>${notice.publishDate}</td>

      </tr>

    `;

  });

}

window.onload = loadNotices;
