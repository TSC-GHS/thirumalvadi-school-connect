/* =====================================
   School Connect TN
   Parent Transport
   Firebase V3 - FINAL
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
   START
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("=====================================");
    console.log("School Connect TN");
    console.log("Parent Transport V3");
    console.log("=====================================");

    loadParentTransport();

});


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

        const value = localStorage.getItem(key);

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

        const emis = getParentEMIS();

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

            await loadStudentDetails(
                emis
            );

            showNoTransport(
                "No Transport Assigned",
                "School transport has not been assigned to this student yet."
            );

            return;

        }


        /* =====================================
           SELECT ACTIVE ASSIGNMENT
        ===================================== */

        let assignment = null;


        assignmentSnapshot.forEach(
            (item) => {

                const data = item.data();

                console.log(
                    "Assignment Record:",
                    data
                );


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


        /* =====================================
           FALLBACK FIRST RECORD
        ===================================== */

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

        if (!documentId) {
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


        if (!snapshot.exists()) {

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


        /* =====================================
           TRY emis
        ===================================== */

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


        /* =====================================
           TRY studentEMIS
        ===================================== */

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

            setElementText(
                [
                    "studentEMIS"
                ],
                emis
            );

            return;

        }


        const student =
            snapshot.docs[0].data();


        console.log(
            "Student Data:",
            student
        );


        setElementText(
            [
                "studentName"
            ],
            firstValue(
                student.studentName,
                student.name,
                "-"
            )
        );


        setElementText(
            [
                "studentEMIS"
            ],
            emis
        );


        setElementText(
            [
                "studentClass"
            ],
            firstValue(
                student.class,
                student.studentClass,
                "-"
            )
        );


        setElementText(
            [
                "studentSection"
            ],
            firstValue(
                student.section,
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

    console.log(
        "Assignment:",
        assignment
    );

    console.log(
        "Bus:",
        bus
    );

    console.log(
        "Route:",
        route
    );


    /* =====================================
       BUS NUMBER
    ===================================== */

    const busNumber =
        firstValue(

            /* Bus document */
            bus.busNumber,
            bus.busNo,
            bus.busNumberValue,
            bus.number,

            /* Assignment */
            assignment.busNumber,
            assignment.busNo,

            /* Common alternatives */
            assignment.vehicleNumber,

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
       ROUTE
    ===================================== */

    const routeName =
        firstValue(

            route.routeName,
            route.route,
            route.name,
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
                bus.pickupTime,
                route.pickupTime,
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
                bus.dropTime,
                route.dropTime,
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
       DEBUG
    ===================================== */

    console.log(
        "FINAL BUS NUMBER:",
        busNumber
    );

    console.log(
        "FINAL REGISTRATION:",
        registrationNumber
    );

    console.log(
        "FINAL ROUTE:",
        routeName
    );

    console.log(
        "FINAL START:",
        startingPoint
    );

    console.log(
        "FINAL END:",
        endPoint
    );

    console.log(
        "FINAL PICKUP:",
        pickupPoint
    );

    console.log(
        "FINAL PICKUP TIME:",
        pickupTime
    );

    console.log(
        "FINAL DROP TIME:",
        dropTime
    );

    console.log(
        "FINAL STATUS:",
        status
    );


    /* =====================================
       SUMMARY CARDS
    ===================================== */

    setElementText(
        [
            "busCardValue",
            "busValue",
            "transportBus"
        ],
        busNumber
    );


    setElementText(
        [
            "routeCardValue",
            "routeValue",
            "transportRoute"
        ],
        routeName
    );


    setElementText(
        [
            "pickupCardValue",
            "pickupValue",
            "transportPickup"
        ],
        pickupPoint
    );


    setElementText(
        [
            "pickupTimeCardValue",
            "pickupTimeValue",
            "transportPickupTime"
        ],
        pickupTime
    );


    /* =====================================
       DETAILS
    ===================================== */

    setElementText(
        [
            "busNumber",
            "busNumberDetails",
            "transportBusNumber"
        ],
        busNumber
    );


    setElementText(
        [
            "registrationNumber",
            "registrationNumberDetails",
            "transportRegistrationNumber"
        ],
        registrationNumber
    );


    setElementText(
        [
            "routeName",
            "routeNameDetails",
            "transportRouteName"
        ],
        routeName
    );


    setElementText(
        [
            "startingPoint",
            "startingPointDetails",
            "transportStartingPoint"
        ],
        startingPoint
    );


    setElementText(
        [
            "endPoint",
            "endPointDetails",
            "transportEndPoint"
        ],
        endPoint
    );


    setElementText(
        [
            "pickupPoint",
            "pickupPointDetails",
            "transportPickupPoint"
        ],
        pickupPoint
    );


    setElementText(
        [
            "pickupTime",
            "pickupTimeDetails",
            "transportPickupTime"
        ],
        pickupTime
    );


    setElementText(
        [
            "dropTime",
            "dropTimeDetails",
            "transportDropTime"
        ],
        dropTime
    );


    setElementText(
        [
            "transportStatus",
            "transportStatusDetails"
        ],
        status
    );


    /* =====================================
       STATUS CLASS
    ===================================== */

    const statusElements = [
        document.getElementById(
            "transportStatus"
        ),
        document.getElementById(
            "transportStatusDetails"
        )
    ];


    statusElements.forEach(
        (element) => {

            if (!element) {
                return;
            }


            element.classList.remove(
                "active",
                "inactive",
                "pending"
            );


            const lowerStatus =
                String(
                    status
                ).toLowerCase();


            if (
                lowerStatus === "active"
            ) {

                element.classList.add(
                    "active"
                );

            } else if (
                lowerStatus === "inactive"
            ) {

                element.classList.add(
                    "inactive"
                );

            } else {

                element.classList.add(
                    "pending"
                );

            }

        }
    );


    /* =====================================
       COMPLETE
    ===================================== */

    hideLoading();

    hideNoTransport();


    console.log(
        "====================================="
    );

    console.log(
        "Parent Transport Loaded Successfully"
    );

    console.log(
        "====================================="

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
   SET MULTIPLE POSSIBLE ELEMENT IDs
===================================== */

function setElementText(
    ids,
    value
) {

    if (!Array.isArray(ids)) {

        ids = [ids];

    }


    ids.forEach(
        (id) => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.textContent =
                    value ?? "-";

            }

        }
    );

}


/* =====================================
   FORMAT TIME
===================================== */

function formatTime(
    value
) {

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {

        return "-";

    }


    /* =====================================
       FIRESTORE TIMESTAMP
    ===================================== */

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


    /* =====================================
       HH:MM
    ===================================== */

    const text =
        String(value).trim();


    if (
        /^\d{1,2}:\d{2}$/.test(
            text
        )
    ) {

        const parts =
            text.split(":");


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


    /* =====================================
       HH:MM:SS
    ===================================== */

    if (
        /^\d{1,2}:\d{2}:\d{2}$/.test(
            text
        )
    ) {

        const parts =
            text.split(":");


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


    return text;

}


/* =====================================
   LOADING
===================================== */

function showLoading() {

    const element =
        document.getElementById(
            "loadingTransport"
        );


    if (element) {

        element.style.display =
            "flex";

    }

}


function hideLoading() {

    const element =
        document.getElementById(
            "loadingTransport"
        );


    if (element) {

        element.style.display =
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


    const element =
        document.getElementById(
            "noTransport"
        );


    if (!element) {
        return;
    }


    element.style.display =
        "block";


    const titleElement =
        element.querySelector(
            "h2"
        );


    const messageElement =
        element.querySelector(
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


function hideNoTransport() {

    const element =
        document.getElementById(
            "noTransport"
        );


    if (element) {

        element.style.display =
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


/* =====================================
   FINAL LOG
===================================== */

console.log(
    "Parent Transport JS V3 Loaded Successfully"
);
