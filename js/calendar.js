import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const calendarList = document.getElementById("calendarList");

async function loadCalendar() {

  calendarList.innerHTML = "Loading Events...";

  try {

    const q = query(
      collection(db, "calendar"),
      orderBy("date", "asc")
    );

    const snap = await getDocs(q);

    calendarList.innerHTML = "";

    if (snap.empty) {

      calendarList.innerHTML = `
        <div class="eventCard">
          No Events Available
        </div>
      `;

      return;

    }

    snap.forEach((docSnap) => {

      const event = docSnap.data();

      calendarList.innerHTML += `
        <div class="eventCard">

          <div class="eventTitle">
            ${event.title}
          </div>

          <div class="eventDate">
            📅 ${event.date}
          </div>

          <div class="eventType">
            ${event.type}
          </div>

          <div class="eventDesc">
            ${event.description || ""}
          </div>

        </div>
      `;

    });

  } catch (error) {

    console.error(error);

    calendarList.innerHTML = `
      <div class="eventCard">
        Failed to load events.
      </div>
    `;

  }

}

loadCalendar();
