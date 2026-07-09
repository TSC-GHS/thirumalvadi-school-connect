import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const form = document.getElementById("eventForm");
const eventList = document.getElementById("eventList");

// Load Events
async function loadEvents() {

  eventList.innerHTML = "Loading...";

  const q = query(
    collection(db, "calendar"),
    orderBy("date", "asc")
  );

  const snap = await getDocs(q);

  eventList.innerHTML = "";

  if (snap.empty) {

    eventList.innerHTML = `
      <div class="eventCard">
        No Events Available
      </div>
    `;

    return;

  }

  snap.forEach((doc) => {

    const data = doc.data();

    eventList.innerHTML += `

      <div class="eventCard">

        <div class="eventTitle">
          ${data.title}
        </div>

        <div class="eventDate">
          📅 ${data.date}
        </div>

        <div class="eventType">
          ${data.type}
        </div>

        <div class="eventDesc">
          ${data.description}
        </div>

      </div>

    `;

  });

}

loadEvents();
// Save Event

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const date = document.getElementById("date").value;
  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value.trim();

  if (!title || !date) {

    alert("Please fill all required fields.");

    return;

  }

  try {

    await addDoc(collection(db, "calendar"), {

      title,
      date,
      type,
      description,
      createdBy: "Headmaster",
      createdAt: serverTimestamp()

    });

    alert("✅ Event Added Successfully");

    form.reset();

    loadEvents();

  } catch (error) {

    console.error(error);

    alert("❌ Failed to save event.");

  }

});
