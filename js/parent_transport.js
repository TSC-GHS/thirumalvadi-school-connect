/* =====================================
   School Connect TN
   Parent Transport
   Firebase V2
===================================== */

import { db } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


/* =====================================
   COLLECTIONS
===================================== */

const ASSIGNMENTS_COLLECTION = "transport_assignments";
const BUSES_COLLECTION = "transport_buses";
const ROUTES_COLLECTION = "transport_routes";
const STUDENTS_COLLECTION = "students";


/* =====================================
   ELEMENTS
===================================== */

const studentNameEl =
    document.getElementById("studentName");

const studentEMISEl =
    document.getElementById("studentEMIS");

const studentClassEl =
    document.getElementById("studentClass");

const studentSectionEl =
    document.getElementById("studentSection");


const busNumberEl =
    document.getElementById("busNumber");

const registrationNumberEl =
    document.getElementById("registrationNumber");

const routeNameEl =
    document.getElementById("routeName");

const startingPointEl =
    document.getElementById("startingPoint");

const endPointEl =
    document.getElementById("endPoint");

const pickupPointEl =
    document.getElementById("pickupPoint");

const pickupTimeEl =
    document.getElementById("pickupTime");

const dropTimeEl =
    document.getElementById("dropTime");

const transportStatusEl =
    document.getElementById("transportStatus");

const loadingEl =
    document.getElementById("loadingTransport");

const noTransportEl =
    document.getElementById("noTransport");


/* =====================================
   START
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "====================================="
        );

        console.log(
            "School Connect TN"
        );

        console.log(
            "Parent Transport V2"
        );

        console.log(
            "====================================="
        );

        loadParentTransport();

    }
);


/* =====================================
   GET PARENT EMIS
===================================== */

function getParentEMIS() {

    const keys = [
        "parentEMIS",
        "parentStudentId",
        "studentEMIS",
        "emis"
    ];

    for (const key of keys) {

        const value =
            localStorage.getItem(key);

        if (
            value &&
            String(value).trim() !== ""
        ) {

            console.log(
                "Parent EMIS:",
                value
            );

            return String(value).trim();

        }

    }

    return null;

}


/* =====================================
   LOAD TRANSPORT
===================================== */

async function loadParentTransport() {

    try {

        showLoading();

        const emis =
            getParentEMIS();


        if (!emis) {

            console.error(
                "Parent EMIS not found"
            );

            showNoTransport(
                "Student Login Required",
                "Please login again to view transport details."
            );

            return;

        }


        console.log(
            "Searching assignment using studentSearch:",
            emis
        );


        /* =====================================
           FIND ASSIGNMENT
        ===================================== */

        const assignmentsRef =
            collection(
                db,
                ASSIGNMENTS_COLLECTION
            );


        const assignmentQuery =
            query(
                assignmentsRef,
                where(
                    "studentSearch",
                    "==",
                    emis
                )
            );


        const assignmentSnapshot =
            await getDocs(
                assignmentQuery
            );


        console.log(
            "Transport Assignments:",
            assignmentSnapshot.size
        );


        if (
            assignmentSnapshot.empty
        ) {

            console.log(
                "No transport assignment found"
            );


            await loadStudentDetails(
                emis
            );


            showNoTransport(
                "No Transport Assigned",
                "School transport has not been assigned to this student yet."
            );

            return;

        }


        /*
         * Use first active assignment.
         */

        let assignment =
            null;


        assignmentSnapshot.forEach(
            (item) => {

                const data =
                    item.data();

                if (
                    !assignment &&
                    String(
                        data.status || ""
                    ).toLowerCase() === "active"
                ) {

                    assignment = {
                        id: item.id,
                        ...data
                    };

                }

            }
        );


        /*
         * If no active assignment,
         * use first record.
         */

        if (!assignment) {

            const firstDoc =
                assignmentSnapshot.docs[0];

            assignment = {
                id: firstDoc.id,
                ...firstDoc.data()
            };

        }


        console.log(
            "Assignment:",
            assignment
        );


        /* =====================================
           LOAD STUDENT
        ===================================== */

        await loadStudentDetails(
            emis
        );


        /* =====================================
           LOAD BUS
        ===================================== */

        let busData = {};


        if (assignment.busId) {

            busData =
                await loadDocumentById(
                    BUSES_COLLECTION,
                    assignment.busId
                );

        }


        console.log(
            "Bus Data:",
            busData
        );


        /* =====================================
           LOAD ROUTE
        ===================================== */

        let routeData = {};


        if (assignment.routeId) {

            routeData =
                await loadDocumentById(
                    ROUTES_COLLECTION,
                    assignment.routeId
                );

        }


        console.log(
            "Route Data:",
            routeData
        );


        /* =====================================
           DISPLAY
        ===================================== */

        displayTransport(
            assignment,
            busData,
            routeData
        );


    } catch (error) {

        console.error(
            "Parent Transport Error:",
            error
        );

        hideLoading();

        showNoTransport(
            "Unable to Load Transport",
            "Please try again later."
        );

    }

}


/* =====================================
   LOAD DOCUMENT BY ID
===================================== */

async function loadDocumentById(
    collectionName,
    documentId
) {

    try {

        const reference =
            doc(
                db,
                collectionName,
                documentId
            );


        const snapshot =
            await getDoc(
                reference
            );


        if (
            !snapshot.exists()
        ) {

            console.warn(
                "Document not found:",
                collectionName,
                documentId
            );

            return {};

        }


        return snapshot.data();

    } catch (error) {

        console.error(
            "Document loading error:",
            collectionName,
            error
        );

        return {};

    }

}


/* =====================================
   LOAD STUDENT DETAILS
===================================== */

async function loadStudentDetails(
    emis
) {

    try {

        const studentsRef =
            collection(
                db,
                STUDENTS_COLLECTION
            );


        /*
         * Try EMIS field.
         */

        const q1 =
            query(
                studentsRef,
                where(
                    "emis",
                    "==",
                    emis
                )
            );


        let snapshot =
            await getDocs(q1);


        /*
         * Some student records may use
         * studentEMIS instead.
         */

        if (
            snapshot.empty
        ) {

            const q2 =
                query(
                    studentsRef,
                    where(
                        "studentEMIS",
                        "==",
                        emis
                    )
                );


            snapshot =
                await getDocs(q2);

        }


        if (
            snapshot.empty
        ) {

            console.warn(
                "Student record not found:",
                emis
            );

            setText(
                studentEMISEl,
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


        console.log(
            "Student Details Loaded"
        );


    } catch (error) {

        console.error(
            "Student loading error:",
            error
        );

    }

}


/* =====================================
   DISPLAY TRANSPORT
===================================== */

function displayTransport(
    assignment,
    bus,
    route
) {

    /* =====================================
       BUS DATA
    ===================================== */

    const busNumber =
        bus.busNumber ||
        bus.busNo ||
        bus.number ||
        assignment.busNumber ||
        assignment.busNo ||
        assignment.bus ||
        "-";


    const registrationNumber =
        bus.registrationNumber ||
        bus.registrationNo ||
        bus.vehicleNumber ||
        assignment.registrationNumber ||
        "-";


    /* =====================================
       ROUTE DATA
    ===================================== */

    const routeName =
        route.routeName ||
        route.name ||
        route.route ||
        assignment.routeName ||
        assignment.route ||
        "-";


    const startingPoint =
        route.startingPoint ||
        route.startPoint ||
        route.from ||
        route.start ||
        assignment.startingPoint ||
        assignment.startPoint ||
        "-";


    const endPoint =
        route.endPoint ||
        route.endPointName ||
        route.to ||
        route.destination ||
        assignment.endPoint ||
        assignment.destination ||
        "-";


    /* =====================================
       ASSIGNMENT DATA
    ===================================== */

    const pickupPoint =
        assignment.pickupPoint ||
        "-";


    const pickupTime =
        formatTime(
            assignment.pickupTime
        );


    const dropTime =
        formatTime(
            assignment.dropTime
        );


    const status =
        assignment.status ||
        "Active";


    /* =====================================
       SUMMARY CARDS
    ===================================== */

    setText(
        document.getElementById("busCardValue"),
        busNumber
    );


    setText(
        document.getElementById("routeCardValue"),
        routeName
    );


    setText(
        document.getElementById("pickupCardValue"),
        pickupPoint
    );


    setText(
        document.getElementById("pickupTimeCardValue"),
        pickupTime
    );


    /* =====================================
       TRANSPORT DETAILS
    ===================================== */

    setText(
        busNumberEl,
        busNumber
    );


    setText(
        registrationNumberEl,
        registrationNumber
    );


    setText(
        routeNameEl,
        routeName
    );


    setText(
        startingPointEl,
        startingPoint
    );


    setText(
        endPointEl,
        endPoint
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
        dropTimeEl,
        dropTime
    );


    setText(
        transportStatusEl,
        status
    );


    /* =====================================
       STATUS
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

        } else if (statusLower === "inactive") {

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

    console.log(
        "Bus:",
        busNumber
    );

    console.log(
        "Registration:",
        registrationNumber
    );

    console.log(
        "Route:",
        routeName
    );

    console.log(
        "Starting Point:",
        startingPoint
    );

    console.log(
        "End Point:",
        endPoint
    );

    console.log(
        "Pickup Point:",
        pickupPoint
    );

    console.log(
        "Pickup Time:",
        pickupTime
    );

    console.log(
        "Drop Time:",
        dropTime
    );

    console.log(
        "Status:",
        status
    );

}

/* =====================================
   FORMAT TIME
===================================== */

function formatTime(
    value
) {

    if (!value) {

        return "-";

    }


    /*
     * Simple time:
     * 08:30
     */

    if (
        typeof value === "string" &&
        /^\d{1,2}:\d{2}$/.test(
            value
        )
    ) {

        const parts =
            value.split(":");


        let hour =
            parseInt(
                parts[0],
                10
            );


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
     * Firestore Timestamp
     */

    if (
        typeof value === "object" &&
        value !== null &&
        typeof value.toDate === "function"
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


    return String(value);

}


/* =====================================
   SAFE TEXT
===================================== */

function setText(
    element,
    value
) {

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


    const titleElement =
        noTransportEl.querySelector(
            "h2"
        );


    const messageElement =
        noTransportEl.querySelector(
            "p"
        );


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (messageElement) {

        messageElement.textContent =
            message;

    }

}


/* =====================================
   HIDE NO TRANSPORT
===================================== */

function hideNoTransport() {

    if (noTransportEl) {

        noTransportEl.style.display =
            "none";

    }

}


/* =====================================
   BACK TO DASHBOARD
===================================== */

window.goBackToDashboard =
    function () {

        window.location.href =
            "parent.html";

    };


/* =====================================
   REFRESH
===================================== */

window.refreshTransport =
    function () {

        loadParentTransport();

    };


console.log(
    "Parent Transport JS Loaded Successfully"
);
