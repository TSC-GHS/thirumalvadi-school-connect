//==================================================
// School Connect TN
// Timetable Management
//==================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Subjects
//==================================================

const subjects = [
    "Tamil",
    "English",
    "Maths",
    "Science",
    "Social Science",
    "Computer",
    "PET",
    "Free Period"
];

//==================================================
// Dropdown Load
//==================================================

function loadSubjects() {

    for (let i = 1; i <= 7; i++) {

        const select = document.getElementById(`period${i}`);

        select.innerHTML = "";

        subjects.forEach(subject => {

            const option = document.createElement("option");

            option.value = subject;
            option.textContent = subject;

            select.appendChild(option);

        });

    }

}

loadSubjects();

//==================================================
// Elements
//==================================================

const academicYear = document.getElementById("academicYear");
const className = document.getElementById("class");
const section = document.getElementById("section");
const day = document.getElementById("day");

const saveBtn = document.getElementById("saveBtn");

//==================================================
// Document ID
//==================================================

function getDocumentId() {

    return `${academicYear.value}_${className.value}_${section.value}_${day.value}`;

}

//==================================================
// Auto Load
//==================================================

async function loadTimetable() {

    if (
        !academicYear.value ||
        !className.value ||
        !section.value ||
        !day.value
    ) return;

    try {

        const docRef = doc(db, "timetable", getDocumentId());

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {

            clearSubjects();

            return;

        }

        const data = docSnap.data();

        for (let i = 1; i <= 7; i++) {

            document.getElementById(`period${i}`).value =
                data.subjects[`Period${i}`] || "Free Period";

        }

    } catch (error) {

        console.error(error);

        alert("Unable to load timetable.");

    }

}

//==================================================
// Clear
//==================================================

function clearSubjects() {

    for (let i = 1; i <= 7; i++) {

        document.getElementById(`period${i}`).value = "Free Period";

    }

}

//==================================================
// Save
//==================================================

saveBtn.addEventListener("click", saveTimetable);

async function saveTimetable() {

    try {

        const timetable = {

            academicYear: academicYear.value,
            class: className.value,
            section: section.value,
            day: day.value,

            subjects: {

                Period1: period1.value,
                Period2: period2.value,
                Period3: period3.value,
                Period4: period4.value,
                Period5: period5.value,
                Period6: period6.value,
                Period7: period7.value

            },

            updatedAt: new Date()

        };

        await setDoc(
            doc(db, "timetable", getDocumentId()),
            timetable
        );

        alert("✅ Timetable Saved Successfully.");

    }

    catch (error) {

        console.error(error);

        alert("❌ Failed to save timetable.");

    }

}

//==================================================
// Auto Load Events
//==================================================

academicYear.addEventListener("change", loadTimetable);
className.addEventListener("change", loadTimetable);
section.addEventListener("change", loadTimetable);
day.addEventListener("change", loadTimetable);

//==================================================
// Initial Load
//==================================================

loadTimetable();
