import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const form = document.getElementById("eventForm");
const eventList = document.getElementById("eventList");

// ==========================================
// Load Events
// ==========================================

async function loadEvents() {

    eventList.innerHTML = `
    <div class="eventCard">
        Loading Events...
    </div>
    `;

    try {

        const q = query(
            collection(db, "calendar"),
            orderBy("date", "desc")
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

        snap.forEach((docSnap) => {

            const data = docSnap.data();

            eventList.innerHTML += `

            <div class="eventCard">

                <div class="eventTitle">
                    📌 ${data.title}
                </div>

                <div class="eventDate">
                    📅 ${data.date}
                </div>

                <div class="eventType">
                    🏷️ ${data.type}
                </div>

                <div class="eventDesc">
                    ${data.description || "No Description"}
                </div>

            </div>

            `;

        });

    } catch (error) {

        console.error(error);

        eventList.innerHTML = `
        <div class="eventCard">
            Unable to load events.
        </div>
        `;

    }

}

loadEvents();

// ==========================================
// Save Event
// ==========================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title =
        document.getElementById("title").value.trim();

    const date =
        document.getElementById("date").value;

    const type =
        document.getElementById("type").value;

    const description =
        document.getElementById("description").value.trim();

    if (!title || !date) {

        alert("Please fill all required fields.");

        return;

    }

    try {

        // ===========================
        // Duplicate Check
        // ===========================

        const checkSnap =
            await getDocs(collection(db, "calendar"));

        let exists = false;

        checkSnap.forEach((doc) => {

            const d = doc.data();

            if (
                d.title === title &&
                d.date === date
            ) {

                exists = true;

            }

        });

        if (exists) {

            alert("Same event already exists.");

            return;

        }

        // ===========================
        // Save Event
        // ===========================

        await addDoc(
            collection(db, "calendar"),
            {

                title,

                date,

                type,

                description,

                status: "Active",

                createdBy: "Headmaster",

                createdAt: serverTimestamp(),

                updatedAt: serverTimestamp()

            }
        );

        alert("✅ Event Added Successfully");

        form.reset();

        await loadEvents();

    } catch (error) {

        console.error(error);

        alert("❌ Failed to save event.");

    }

});

console.log("================================");
console.log("School Connect TN");
console.log("Calendar Management");
console.log("Production Version V2");
console.log("Firebase Connected");
console.log("================================");
