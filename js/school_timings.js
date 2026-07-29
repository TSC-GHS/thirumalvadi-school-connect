//==================================================
// School Connect TN
// School Timings
//==================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Save Button
//==================================================

const saveTimings = document.getElementById("saveTimings");

//==================================================
// Load Timings
//==================================================

async function loadTimings() {

    try {

        const docRef = doc(db, "school_settings", "timings");

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;

        const data = docSnap.data();

        document.getElementById("schoolStart").value = data.schoolStart || "";
        document.getElementById("schoolEnd").value = data.schoolEnd || "";

        data.periods.forEach(p => {

            switch (p.name) {

                case "Period 1":
                    p1Start.value = p.start;
                    p1End.value = p.end;
                    break;

                case "Period 2":
                    p2Start.value = p.start;
                    p2End.value = p.end;
                    break;

                case "Break":
                    breakStart.value = p.start;
                    breakEnd.value = p.end;
                    break;

                case "Period 3":
                    p3Start.value = p.start;
                    p3End.value = p.end;
                    break;

                case "Period 4":
                    p4Start.value = p.start;
                    p4End.value = p.end;
                    break;

                case "Lunch":
                    lunchStart.value = p.start;
                    lunchEnd.value = p.end;
                    break;

                case "Period 5":
                    p5Start.value = p.start;
                    p5End.value = p.end;
                    break;

                case "Period 6":
                    p6Start.value = p.start;
                    p6End.value = p.end;
                    break;

                case "Period 7":
                    p7Start.value = p.start;
                    p7End.value = p.end;
                    break;

            }

        });

    } catch (error) {

        console.error(error);

        alert("Unable to load school timings.");

    }

}

//==================================================
// Save Timings
//==================================================

saveTimings.addEventListener("click", saveSchoolTimings);

async function saveSchoolTimings() {

    try {

        const periods = [

            {
                name: "Period 1",
                start: p1Start.value,
                end: p1End.value
            },

            {
                name: "Period 2",
                start: p2Start.value,
                end: p2End.value
            },

            {
                name: "Break",
                start: breakStart.value,
                end: breakEnd.value
            },

            {
                name: "Period 3",
                start: p3Start.value,
                end: p3End.value
            },

            {
                name: "Period 4",
                start: p4Start.value,
                end: p4End.value
            },

            {
                name: "Lunch",
                start: lunchStart.value,
                end: lunchEnd.value
            },

            {
                name: "Period 5",
                start: p5Start.value,
                end: p5End.value
            },

            {
                name: "Period 6",
                start: p6Start.value,
                end: p6End.value
            },

            {
                name: "Period 7",
                start: p7Start.value,
                end: p7End.value
            }

        ];

        await setDoc(doc(db, "school_settings", "timings"), {

            schoolStart: schoolStart.value,
            schoolEnd: schoolEnd.value,
            periods: periods,
            updatedAt: new Date()

        });

        alert("✅ School timings saved successfully.");

    } catch (error) {

        console.error(error);

        alert("❌ Failed to save school timings.");

    }

}

//==================================================
// Start
//==================================================

loadTimings();
