//==================================================
// School Connect TN
// Timetable
//==================================================

import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Elements
//==================================================

const studentName = document.getElementById("studentName");
const studentClass = document.getElementById("studentClass");
const studentSection = document.getElementById("studentSection");
const studentPhoto = document.getElementById("studentPhoto");

const timetableBody = document.getElementById("timetableBody");
const currentPeriod = document.getElementById("currentPeriod");
const nextPeriod = document.getElementById("nextPeriod");

const dayButtons = document.querySelectorAll(".day");

//==================================================
// Student Details
//==================================================

const student = JSON.parse(localStorage.getItem("student"));

if (!student) {

    alert("Student details not found");

    location.href = "parent.html";

}

studentName.textContent = student.name;
studentClass.textContent = student.class;
studentSection.textContent = student.section;

if (student.photo) {

    studentPhoto.src = student.photo;

}

//==================================================
// Current Day
//==================================================

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

let selectedDay = days[new Date().getDay()];

// Sunday-na Monday default
if (selectedDay === "Sunday") {

    selectedDay = "Monday";

}

// Active Tab
dayButtons.forEach(btn => {

    if (btn.dataset.day === selectedDay) {

        btn.classList.add("active");

    }

});

//==================================================
// Load Timetable
//==================================================

async function loadTimetable(day) {

    timetableBody.innerHTML = "";

    currentPeriod.innerHTML = "-";
    nextPeriod.innerHTML = "-";

    const q = query(
        collection(db, "timetable"),
        where("class", "==", student.class),
        where("section", "==", student.section),
        where("day", "==", day)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        timetableBody.innerHTML =
        `<tr>
            <td colspan="3">
                No Timetable Available
            </td>
        </tr>`;

        return;

    }

    snapshot.forEach(doc => {

        const data = doc.data();

        const periods = data.periods;

        periods.forEach(period => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${period.period}</td>
                <td>${period.start} - ${period.end}</td>
                <td>${period.subject}</td>
            `;

            timetableBody.appendChild(row);

        });

        detectCurrentPeriod(periods);

    });

}

//==================================================
// Current Period
//==================================================

function detectCurrentPeriod(periods) {

    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

    let foundCurrent = false;

    for (let i = 0; i < periods.length; i++) {

        const p = periods[i];

        const start = convertMinutes(p.start);
        const end = convertMinutes(p.end);

        if (currentMinutes >= start &&
            currentMinutes <= end) {

            currentPeriod.innerHTML =
                `<b>${p.subject}</b><br>${p.start} - ${p.end}`;

            if (periods[i + 1]) {

                const next = periods[i + 1];

                nextPeriod.innerHTML =
                    `<b>${next.subject}</b><br>${next.start} - ${next.end}`;

            } else {

                nextPeriod.innerHTML =
                    "School Over";

            }

            timetableBody.rows[i].classList.add("current-row");

            foundCurrent = true;

            break;

        }

    }

    if (!foundCurrent) {

        currentPeriod.innerHTML = "No Active Period";

        nextPeriod.innerHTML = "-";

    }

}

//==================================================
// Convert Time
//==================================================

function convertMinutes(time) {

    const parts = time.split(":");

    return (
        Number(parts[0]) * 60 +
        Number(parts[1])
    );

}

//==================================================
// Day Click
//==================================================

dayButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        dayButtons.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        loadTimetable(btn.dataset.day);

    });

});

//==================================================
// Start
//==================================================

loadTimetable(selectedDay);
