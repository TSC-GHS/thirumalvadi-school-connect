/* =====================================
   School Connect TN
   Parent Transport
   Firebase Integration
===================================== */

import { db } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


/* =====================================
   CONFIG
===================================== */

const TRANSPORT_COLLECTION = "transport_assignments";


/* =====================================
   PAGE ELEMENTS
===================================== */

const studentNameEl = document.getElementById("studentName");
const studentEMISEl = document.getElementById("studentEMIS");
const studentClassEl = document.getElementById("studentClass");
const studentSectionEl = document.getElementById("studentSection");

const busNumberEl = document.getElementById("busNumber");
const routeNameEl = document.getElementById("routeName");
const pickupPointEl = document.getElementById("pickupPoint");
const pickupTimeEl = document.getElementById("pickupTime");
const transportStatusEl = document.getElementById("transportStatus");

const noTransportEl = document.getElementById("noTransport");

const loadingEl = document.getElementById("loadingTransport");


/* =====================================
   START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("=====================================");
    console.log("School Connect TN");
    console.log("Parent Transport");
    console.log("=====================================");

    loadParentTransport();

});


/* =====================================
   GET PARENT EMIS
===================================== */

function getParentEMIS() {

    const possibleKeys = [
        "parentEMIS",
        "parentStudentId",
        "studentEMIS",
        "emis"
    ];

    for (const key of possibleKeys) {

        const value = localStorage.getItem(key);

        if (value && value.trim() !== "") {

            console.log("Parent EMIS found:", value);

            return value.trim();

        }

    }

    return null;

}


/* =====================================
   LOAD PARENT TRANSPORT
===================================== */

async function loadParentTransport() {

    try {

        showLoading();

        const emis = getParentEMIS();

        if (!emis) {

            console.warn("Parent EMIS not found in localStorage");

            showNoTransport(
                "Student information not found",
                "Please login again to continue."
            );

            return;

        }


        console.log("Searching transport for EMIS:", emis);


        /* =====================================
           LOAD TRANSPORT ASSIGNMENT
        ===================================== */

        const transportRef =
            collection(db, TRANSPORT_COLLECTION);


        const q = query(
            transportRef,
            where("studentId", "==", emis)
        );


        const snapshot = await getDocs(q);


        console.log(
            "Transport records found:",
            snapshot.size
        );


        if (snapshot.empty) {

            /*
             * Sometimes studentId may be stored
             * as studentEMIS.
             */

            const q2 = query(
                transportRef,
                where("studentEMIS", "==", emis)
            );

            const snapshot2 = await getDocs(q2);


            if (snapshot2.empty) {

                console.log(
                    "No transport assignment found for:",
                    emis
                );

                await loadStudentOnly(emis);

                showNoTransport(
                    "No Transport Assigned",
                    "School transport has not been assigned to this student yet."
                );

                return;

            }


            const record =
                snapshot2.docs[0].data();

            await displayTransport(record, emis);

            return;

        }


        const record =
            snapshot.docs[0].data();


        await displayTransport(record, emis);


    } catch (error) {

        console.error(
            "Parent Transport Error:",
            error
        );

        showNoTransport(
            "Unable to load transport",
            "Please try again later."
        );

    }

}


/* =====================================
   DISPLAY TRANSPORT
===================================== */

async function displayTransport(data, emis) {

    console.log(
        "Transport Assignment:",
        data
    );


    /* =====================================
       STUDENT DETAILS
    ===================================== */

    const studentName =
        data.studentName ||
        data.name ||
        "Student";


    const studentClass =
        data.studentClass ||
        data.class ||
        "-";


    const section =
        data.section ||
        "-";


    setText(
        studentNameEl,
        studentName
    );


    setText(
        studentEMISEl,
        emis
    );


    setText(
        studentClassEl,
        studentClass
    );


    setText(
        studentSectionEl,
        section
    );


    /* =====================================
       TRANSPORT DETAILS
    ===================================== */

    const busNumber =
        data.busNumber ||
        data.bus ||
        data.vehicleNumber ||
        "-";


    const route =
        data.routeName ||
        data.route ||
        "-";


    const pickupPoint =
        data.pickupPoint ||
        data.pickup ||
        data.pickupLocation ||
        "-";


    const pickupTime =
        formatTime(
            data.pickupTime
        );


    const status =
        data.status ||
        "Active";


    setText(
        busNumberEl,
        busNumber
    );


    setText(
        routeNameEl,
        route
    );


    setText(
        pickupPointEl,
        pickupPoint
    );


    setText(
        pickupTimeEl,
        pickupTime
    );


    setText(
        transportStatusEl,
        status
    );


    /* =====================================
       STATUS STYLE
    ===================================== */

    if (transportStatusEl) {

        transportStatusEl.classList.remove(
            "active",
            "inactive",
            "pending"
        );


        const statusLower =
            String(status).toLowerCase();


        if (statusLower === "active") {

            transportStatusEl.classList.add(
                "active"
            );

        } else if (
            statusLower === "inactive"
        ) {

            transportStatusEl.classList.add(
                "inactive"
            );

        } else {

            transportStatusEl.classList.add(
                "pending"
            );

        }

    }


    hideLoading();

    hideNoTransport();


    console.log(
        "Parent Transport Loaded Successfully"
    );

}


/* =====================================
   LOAD STUDENT DETAILS
===================================== */

async function loadStudentOnly(emis) {

    try {

        const studentsRef =
            collection(db, "students");


        const q = query(
            studentsRef,
            where("emis", "==", emis)
        );


        const snapshot =
            await getDocs(q);


        if (snapshot.empty) {

            console.log(
                "Student not found:",
                emis
            );

            return;

        }


        const student =
            snapshot.docs[0].data();


        setText(
            studentNameEl,
            student.studentName ||
            student.name ||
            "-"
        );


        setText(
            studentEMISEl,
            emis
        );


        setText(
            studentClassEl,
            student.class ||
            student.studentClass ||
            "-"
        );


        setText(
            studentSectionEl,
            student.section ||
            "-"
        );


    } catch (error) {

        console.error(
            "Student loading error:",
            error
        );

    }

}


/* =====================================
   FORMAT TIME
===================================== */

function formatTime(value) {

    if (!value) {

        return "-";

    }


    /* Firestore Timestamp */

    if (
        typeof value === "object" &&
        value.toDate
    ) {

        const date =
            value.toDate();

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        );

    }


    /* String time */

    if (
        typeof value === "string"
    ) {

        /*
         * Already simple time
         * Example: 08:30
         */

        if (
            /^\d{1,2}:\d{2}$/.test(value)
        ) {

            const parts =
                value.split(":");

            let hour =
                parseInt(parts[0], 10);

            const minute =
                parts[1];

            const suffix =
                hour >= 12
                    ? "PM"
                    : "AM";

            hour =
                hour % 12 || 12;

            return `${hour}:${minute} ${suffix}`;

        }


        /*
         * ISO / Date string
         */

        const date =
            new Date(value);


        if (!isNaN(date.getTime())) {

            return date.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }
            );

        }

    }


    return String(value);

}


/* =====================================
   SAFE TEXT
===================================== */

function setText(element, value) {

    if (!element) {

        return;

    }

    element.textContent =
        value ?? "-";

}


/* =====================================
   LOADING
===================================== */

function showLoading() {

    if (loadingEl) {

        loadingEl.style.display =
            "flex";

    }

}


function hideLoading() {

    if (loadingEl) {

        loadingEl.style.display =
            "none";

    }

}


/* =====================================
   NO TRANSPORT
===================================== */

function showNoTransport(
    title,
    message
) {

    hideLoading();


    if (!noTransportEl) {

        return;

    }


    noTransportEl.style.display =
        "block";


    const titleEl =
        noTransportEl.querySelector(
            "h2"
        );


    const messageEl =
        noTransportEl.querySelector(
            "p"
        );


    if (titleEl) {

        titleEl.textContent =
            title;

    }


    if (messageEl) {

        messageEl.textContent =
            message;

    }

}


function hideNoTransport() {

    if (noTransportEl) {

        noTransportEl.style.display =
            "none";

    }

}


/* =====================================
   BACK TO DASHBOARD
===================================== */

window.goBackToDashboard = function () {

    window.location.href =
        "parent.html";

};


/* =====================================
   REFRESH TRANSPORT
===================================== */

window.refreshTransport = function () {

    loadParentTransport();

};


console.log(
    "Parent Transport JS Loaded Successfully"
);
