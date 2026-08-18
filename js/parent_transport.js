/* =====================================
   SCHOOL CONNECT TN
   PARENT TRANSPORT
   FULL UPDATED VERSION
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

const ASSIGNMENTS_COLLECTION =
    "transport_assignments";

const BUSES_COLLECTION =
    "transport_buses";

const ROUTES_COLLECTION =
    "transport_routes";

const STUDENTS_COLLECTION =
    "students";


/* =====================================
   HTML ELEMENTS
===================================== */

/* Student */

const studentNameEl =
    document.getElementById("studentName");

const studentEMISEl =
    document.getElementById("studentEMIS");

const studentClassEl =
    document.getElementById("studentClass");

const studentSectionEl =
    document.getElementById("studentSection");


/* Summary */

const busNumberEl =
    document.getElementById("busNumber");

const routeNameEl =
    document.getElementById("routeName");

const pickupPointEl =
    document.getElementById("pickupPoint");

const pickupTimeEl =
    document.getElementById("pickupTime");


/* Details */

const detailBusNumberEl =
    document.getElementById("detailBusNumber");

const registrationNumberEl =
    document.getElementById("registrationNumber");

const detailRouteEl =
    document.getElementById("detailRoute");

const startPointEl =
    document.getElementById("startPoint");

const endPointEl =
    document.getElementById("endPoint");

const detailPickupPointEl =
    document.getElementById("detailPickupPoint");

const detailPickupTimeEl =
    document.getElementById("detailPickupTime");

const dropTimeEl =
    document.getElementById("dropTime");

const transportStatusEl =
    document.getElementById("transportStatus");


/* No Transport */

const noTransportEl =
    document.getElementById(
        "noTransportSection"
    );


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
            "Parent Transport"
        );

        console.log(
            "Firebase Transport Module Loaded"
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
   LOAD PARENT TRANSPORT
===================================== */

async function loadParentTransport() {

    try {

        hideNoTransport();


        const emis =
            getParentEMIS();


        /* ---------------------------------
           CHECK EMIS
        --------------------------------- */

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
            "Searching transport for EMIS:",
            emis
        );


        /* ---------------------------------
           LOAD ASSIGNMENT
        --------------------------------- */

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


        /* ---------------------------------
           NO ASSIGNMENT
        --------------------------------- */

        if (
            assignmentSnapshot.empty
        ) {

            await loadStudentDetails(
                emis
            );


            showNoTransport(
                "No Transport Assigned",
                "School transport has not been assigned to this student yet."
            );


            return;

        }


        /* ---------------------------------
           SELECT ACTIVE ASSIGNMENT
        --------------------------------- */

        let assignment = null;


        assignmentSnapshot.forEach(
            (item) => {

                const data =
                    item.data();


                const status =
                    String(
                        data.status || ""
                    ).toLowerCase();


                if (
                    !assignment &&
                    status === "active"
                ) {

                    assignment = {

                        id: item.id,

                        ...data

                    };

                }

            }
        );


        /* ---------------------------------
           FALLBACK FIRST RECORD
        --------------------------------- */

        if (!assignment) {

            const firstDoc =
                assignmentSnapshot.docs[0];


            assignment = {

                id: firstDoc.id,

                ...firstDoc.data()

            };

        }


        console.log(
            "Selected Assignment:",
            assignment
        );


        /* ---------------------------------
           LOAD STUDENT
        --------------------------------- */

        await loadStudentDetails(
            emis
        );


        /* ---------------------------------
           LOAD BUS
        --------------------------------- */

        let busData = {};


        if (
            assignment.busId
        ) {

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


        /* ---------------------------------
           LOAD ROUTE
        --------------------------------- */

        let routeData = {};


        if (
            assignment.routeId
        ) {

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


        /* ---------------------------------
           DISPLAY
        --------------------------------- */

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


        showNoTransport(
            "Unable to Load Transport",
            "Please try again later."
        );

    }

}


/* =====================================
   LOAD FIRESTORE DOCUMENT BY ID
===================================== */

async function loadDocumentById(
    collectionName,
    documentId
) {

    try {

        if (
            !documentId
        ) {

            return {};

        }


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
            documentId,
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


        /* ---------------------------------
           TRY emis
        --------------------------------- */

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


        /* ---------------------------------
           TRY studentEMIS
        --------------------------------- */

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


        /* ---------------------------------
           STUDENT NOT FOUND
        --------------------------------- */

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


        /* ---------------------------------
           STUDENT NAME
        --------------------------------- */

        setText(
            studentNameEl,
            firstValue(
                student.studentName,
                student.name,
                "-"
            )
        );


        /* ---------------------------------
           EMIS
        --------------------------------- */

        setText(
            studentEMISEl,
            emis
        );


        /* ---------------------------------
           CLASS
        --------------------------------- */

        setText(
            studentClassEl,
            firstValue(
                student.class,
                student.studentClass,
                "-"
            )
        );


        /* ---------------------------------
           SECTION
        --------------------------------- */

        setText(
            studentSectionEl,
            firstValue(
                student.section,
                student.studentSection,
                "-"
            )
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

    console.log(
        "====================================="
    );

    console.log(
        "DISPLAY TRANSPORT"
    );


    /* =====================================
       BUS NUMBER
    ===================================== */

    const busNumber =
        firstValue(

            bus.busNumber,

            bus.busNo,

            bus.number,

            bus.vehicleNumber,

            assignment.busNumber,

            assignment.busNo,

            assignment.bus,

            "-"

        );


    /* =====================================
       REGISTRATION NUMBER
    ===================================== */

    const registrationNumber =
        firstValue(

            bus.registrationNumber,

            bus.registrationNo,

            bus.vehicleRegistrationNumber,

            bus.vehicleNumber,

            assignment.registrationNumber,

            assignment.registrationNo,

            "-"

        );


    /* =====================================
       ROUTE NAME
    ===================================== */

    const routeName =
        firstValue(

            route.routeName,

            route.name,

            route.route,

            route.routeTitle,

            assignment.routeName,

            assignment.route,

            "-"

        );


    /* =====================================
       STARTING POINT
    ===================================== */

    const startingPoint =
        firstValue(

            route.startingPoint,

            route.startPoint,

            route.from,

            route.start,

            route.origin,

            assignment.startingPoint,

            assignment.startPoint,

            assignment.from,

            "-"

        );


    /* =====================================
       END POINT
    ===================================== */

    const endPoint =
        firstValue(

            route.endPoint,

            route.endPointName,

            route.to,

            route.destination,

            assignment.endPoint,

            assignment.destination,

            assignment.to,

            "-"

        );


    /* =====================================
       PICKUP POINT
    ===================================== */

    const pickupPoint =
        firstValue(

            assignment.pickupPoint,

            assignment.pickupLocation,

            assignment.pickup,

            route.pickupPoint,

            "-"

        );


    /* =====================================
       PICKUP TIME
    ===================================== */

    const pickupTime =
        formatTime(

            firstValue(

                assignment.pickupTime,

                assignment.pickup_time,

                route.pickupTime,

                bus.pickupTime,

                ""

            )

        );


    /* =====================================
       DROP TIME
    ===================================== */

    const dropTime =
        formatTime(

            firstValue(

                assignment.dropTime,

                assignment.drop_time,

                route.dropTime,

                bus.dropTime,

                ""

            )

        );


    /* =====================================
       STATUS
    ===================================== */

    const status =
        firstValue(

            assignment.status,

            "Active"

        );


    /* =====================================
       SUMMARY CARDS
    ===================================== */

    setText(
        busNumberEl,
        busNumber
    );


    setText(
        routeNameEl,
        routeName
    );


    setText(
        pickupPointEl,
        pickupPoint
    );


    setText(
        pickupTimeEl,
        pickupTime
    );


    /* =====================================
       TRANSPORT DETAILS
    ===================================== */

    setText(
        detailBusNumberEl,
        busNumber
    );


    setText(
        registrationNumberEl,
        registrationNumber
    );


    setText(
        detailRouteEl,
        routeName
    );


    setText(
        startPointEl,
        startingPoint
    );


    setText(
        endPointEl,
        endPoint
    );


    setText(
        detailPickupPointEl,
        pickupPoint
    );


    setText(
        detailPickupTimeEl,
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
       STATUS COLOR
    ===================================== */

    if (
        transportStatusEl
    ) {

        transportStatusEl.classList.remove(
            "active",
            "inactive",
            "pending"
        );


        const statusLower =
            String(
                status
            ).toLowerCase();


        if (
            statusLower === "active"
        ) {

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


    /* =====================================
       HIDE NO TRANSPORT
    ===================================== */

    hideNoTransport();


    console.log(
        "-------------------------------------"
    );

    console.log(
        "FINAL TRANSPORT DATA"
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

    console.log(
        "-------------------------------------"
    );

}


/* =====================================
   FIRST VALID VALUE
===================================== */

function firstValue(
    ...values
) {

    for (
        const value of values
    ) {

        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        ) {

            return value;

        }

    }


    return "-";

}


/* =====================================
   FORMAT TIME
===================================== */

function formatTime(
    value
) {

    if (
        !value ||
        value === "-"
    ) {

        return "-";

    }


    /* ---------------------------------
       STRING TIME
       Example: 08:30
    --------------------------------- */

    if (
        typeof value === "string" &&
        /^\d{1,2}:\d{2}$/.test(
            value.trim()
        )
    ) {

        const parts =
            value
                .trim()
                .split(":");


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


    /* ---------------------------------
       STRING WITH AM / PM
    --------------------------------- */

    if (
        typeof value === "string"
    ) {

        const cleaned =
            value.trim();


        if (
            /\b(am|pm)\b/i.test(
                cleaned
            )
        ) {

            return cleaned
                .toUpperCase();

        }

    }


    /* ---------------------------------
       FIRESTORE TIMESTAMP
    --------------------------------- */

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
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        );

    }


    /* ---------------------------------
       JAVASCRIPT DATE
    --------------------------------- */

    if (
        value instanceof Date
    ) {

        return value.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
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

    if (
        !element
    ) {

        return;

    }


    element.textContent =
        value === undefined ||
        value === null ||
        String(value).trim() === ""
            ? "-"
            : value;

}


/* =====================================
   SHOW NO TRANSPORT
===================================== */

function showNoTransport(
    title,
    message
) {

    if (
        !noTransportEl
    ) {

        console.warn(
            "noTransportSection not found"
        );

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


    if (
        titleElement
    ) {

        titleElement.textContent =
            title;

    }


    if (
        messageElement
    ) {

        messageElement.textContent =
            message;

    }

}


/* =====================================
   HIDE NO TRANSPORT
===================================== */

function hideNoTransport() {

    if (
        noTransportEl
    ) {

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
   REFRESH TRANSPORT
===================================== */

window.refreshTransport =
    function () {

        loadParentTransport();

    };


/* =====================================
   FINAL LOG
===================================== */

console.log(
    "Parent Transport JS Loaded Successfully"
);
