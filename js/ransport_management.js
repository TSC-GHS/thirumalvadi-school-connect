// ==========================================================
// School Connect TN
// Transport Management
// Full V1
// ==========================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


// ==========================================================
// GLOBAL DATA
// ==========================================================

let buses = [];
let drivers = [];
let routes = [];
let students = [];
let assignments = [];

let selectedStudent = null;


// ==========================================================
// DOM READY
// ==========================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("====================================");
    console.log("School Connect TN");
    console.log("Transport Management");
    console.log("====================================");

    setupEvents();

    await loadAllData();

});


// ==========================================================
// SETUP EVENTS
// ==========================================================

function setupEvents() {

    const busForm =
        document.getElementById("busForm");

    const driverForm =
        document.getElementById("driverForm");

    const routeForm =
        document.getElementById("routeForm");

    const assignmentForm =
        document.getElementById("assignmentForm");

    const studentSearch =
        document.getElementById("studentSearch");


    if (busForm) {

        busForm.addEventListener(
            "submit",
            saveBus
        );

    }


    if (driverForm) {

        driverForm.addEventListener(
            "submit",
            saveDriver
        );

    }


    if (routeForm) {

        routeForm.addEventListener(
            "submit",
            saveRoute
        );

    }


    if (assignmentForm) {

        assignmentForm.addEventListener(
            "submit",
            saveAssignment
        );

    }


    if (studentSearch) {

        studentSearch.addEventListener(
            "input",
            searchStudent
        );

    }

}


// ==========================================================
// LOAD ALL DATA
// ==========================================================

async function loadAllData() {

    try {

        await Promise.all([
            loadBuses(),
            loadDrivers(),
            loadRoutes(),
            loadStudents(),
            loadAssignments()
        ]);

        updateSummary();

        populateBusDropdown();

        populateRouteDropdown();

        renderAssignments();

        console.log(
            "Transport Management Ready"
        );

    } catch (error) {

        console.error(
            "Transport Load Error:",
            error
        );

        showMessage(
            "Unable to load transport data.",
            "error"
        );

    }

}


// ==========================================================
// LOAD BUSES
// ==========================================================

async function loadBuses() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "buses"
            )
        );

    buses = [];

    snapshot.forEach(
        (docSnap) => {

            const data =
                docSnap.data();

            buses.push({

                id:
                    docSnap.id,

                busNumber:
                    data.busNumber || "",

                registrationNumber:
                    data.registrationNumber || "",

                capacity:
                    Number(
                        data.capacity ||
                        data.busCapacity ||
                        0
                    ),

                status:
                    data.status ||
                    "Active",

                driverId:
                    data.driverId ||
                    "",

                driverName:
                    data.driverName ||
                    ""

            });

        }
    );

    console.log(
        "Buses Loaded:",
        buses.length
    );

}


// ==========================================================
// LOAD DRIVERS
// ==========================================================

async function loadDrivers() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "drivers"
            )
        );

    drivers = [];

    snapshot.forEach(
        (docSnap) => {

            const data =
                docSnap.data();

            drivers.push({

                id:
                    docSnap.id,

                name:
                    data.name ||
                    data.driverName ||
                    "",

                phone:
                    data.phone ||
                    data.driverPhone ||
                    "",

                licenseNumber:
                    data.licenseNumber ||
                    "",

                status:
                    data.status ||
                    "Active"

            });

        }
    );

    console.log(
        "Drivers Loaded:",
        drivers.length
    );

}


// ==========================================================
// LOAD ROUTES
// ==========================================================

async function loadRoutes() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "transport_routes"
            )
        );

    routes = [];

    snapshot.forEach(
        (docSnap) => {

            const data =
                docSnap.data();

            routes.push({

                id:
                    docSnap.id,

                routeName:
                    data.routeName ||
                    "",

                startPoint:
                    data.startPoint ||
                    "",

                endPoint:
                    data.endPoint ||
                    "",

                pickupPoints:
                    data.pickupPoints ||
                    "",

                status:
                    data.status ||
                    "Active"

            });

        }
    );

    console.log(
        "Routes Loaded:",
        routes.length
    );

}


// ==========================================================
// LOAD STUDENTS
// ==========================================================

async function loadStudents() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "students"
            )
        );

    students = [];

    snapshot.forEach(
        (docSnap) => {

            const data =
                docSnap.data();

            students.push({

                docId:
                    docSnap.id,

                id:
                    data.studentId ||
                    data.emisNumber ||
                    data.emis ||
                    data.EMIS ||
                    "",

                name:
                    data.studentName ||
                    data.name ||
                    data.fullName ||
                    "",

                emis:
                    data.emisNumber ||
                    data.emis ||
                    data.EMIS ||
                    data.studentId ||
                    "",

                class:
                    data.class ||
                    data.studentClass ||
                    "",

                section:
                    data.section ||
                    data.studentSection ||
                    ""

            });

        }
    );

    console.log(
        "Students Loaded:",
        students.length
    );

}


// ==========================================================
// LOAD ASSIGNMENTS
// ==========================================================

async function loadAssignments() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "transport_assignments"
            )
        );

    assignments = [];

    snapshot.forEach(
        (docSnap) => {

            const data =
                docSnap.data();

            assignments.push({

                id:
                    docSnap.id,

                studentId:
                    data.studentId ||
                    "",

                studentDocId:
                    data.studentDocId ||
                    "",

                studentName:
                    data.studentName ||
                    "",

                studentEmis:
                    data.studentEmis ||
                    "",

                busId:
                    data.busId ||
                    "",

                busNumber:
                    data.busNumber ||
                    "",

                routeId:
                    data.routeId ||
                    "",

                routeName:
                    data.routeName ||
                    "",

                pickupPoint:
                    data.pickupPoint ||
                    "",

                pickupTime:
                    data.pickupTime ||
                    "",

                dropTime:
                    data.dropTime ||
                    "",

                status:
                    data.status ||
                    "Active"

            });

        }
    );

    console.log(
        "Assignments Loaded:",
        assignments.length
    );

}


// ==========================================================
// SAVE BUS
// ==========================================================

async function saveBus(event) {

    event.preventDefault();

    try {

        const busNumber =
            getValue("busNumber");

        const registrationNumber =
            getValue("registrationNumber");

        const capacity =
            Number(
                getValue("busCapacity")
            );

        const status =
            getValue("busStatus") ||
            "Active";


        if (!busNumber) {

            showMessage(
                "Please enter bus number.",
                "error"
            );

            return;

        }


        if (!registrationNumber) {

            showMessage(
                "Please enter registration number.",
                "error"
            );

            return;

        }


        if (!capacity || capacity <= 0) {

            showMessage(
                "Please enter valid bus capacity.",
                "error"
            );

            return;

        }


        await addDoc(

            collection(
                db,
                "buses"
            ),

            {

                busNumber:
                    busNumber,

                registrationNumber:
                    registrationNumber,

                capacity:
                    capacity,

                status:
                    status,

                driverId:
                    "",

                driverName:
                    "",

                createdAt:
                    serverTimestamp(),

                createdBy:
                    auth.currentUser?.uid ||
                    ""

            }

        );


        showMessage(
            "Bus saved successfully.",
            "success"
        );


        document
            .getElementById("busForm")
            ?.reset();


        await loadBuses();

        updateSummary();

        populateBusDropdown();


    } catch (error) {

        console.error(
            "Save Bus Error:",
            error
        );

        showMessage(
            "Unable to save bus: " +
            error.message,
            "error"
        );

    }

}


// ==========================================================
// SAVE DRIVER
// ==========================================================

async function saveDriver(event) {

    event.preventDefault();

    try {

        const name =
            getValue("driverName");

        const phone =
            getValue("driverPhone");

        const licenseNumber =
            getValue("licenseNumber");

        const status =
            getValue("driverStatus") ||
            "Active";


        if (!name) {

            showMessage(
                "Please enter driver name.",
                "error"
            );

            return;

        }


        if (!phone) {

            showMessage(
                "Please enter driver mobile number.",
                "error"
            );

            return;

        }


        await addDoc(

            collection(
                db,
                "drivers"
            ),

            {

                name:
                    name,

                phone:
                    phone,

                licenseNumber:
                    licenseNumber,

                status:
                    status,

                createdAt:
                    serverTimestamp(),

                createdBy:
                    auth.currentUser?.uid ||
                    ""

            }

        );


        showMessage(
            "Driver saved successfully.",
            "success"
        );


        document
            .getElementById("driverForm")
            ?.reset();


        await loadDrivers();

        updateSummary();


    } catch (error) {

        console.error(
            "Save Driver Error:",
            error
        );

        showMessage(
            "Unable to save driver: " +
            error.message,
            "error"
        );

    }

}


// ==========================================================
// SAVE ROUTE
// ==========================================================

async function saveRoute(event) {

    event.preventDefault();

    try {

        const routeName =
            getValue("routeName");

        const startPoint =
            getValue("startPoint");

        const endPoint =
            getValue("endPoint");

        const pickupPoints =
            getValue("pickupPoints");

        const status =
            getValue("routeStatus") ||
            "Active";


        if (!routeName) {

            showMessage(
                "Please enter route name.",
                "error"
            );

            return;

        }


        if (!startPoint) {

            showMessage(
                "Please enter starting point.",
                "error"
            );

            return;

        }


        if (!endPoint) {

            showMessage(
                "Please enter end point.",
                "error"
            );

            return;

        }


        await addDoc(

            collection(
                db,
                "transport_routes"
            ),

            {

                routeName:
                    routeName,

                startPoint:
                    startPoint,

                endPoint:
                    endPoint,

                pickupPoints:
                    pickupPoints,

                status:
                    status,

                createdAt:
                    serverTimestamp(),

                createdBy:
                    auth.currentUser?.uid ||
                    ""

            }

        );


        showMessage(
            "Route saved successfully.",
            "success"
        );


        document
            .getElementById("routeForm")
            ?.reset();


        await loadRoutes();

        updateSummary();

        populateRouteDropdown();


    } catch (error) {

        console.error(
            "Save Route Error:",
            error
        );

        showMessage(
            "Unable to save route: " +
            error.message,
            "error"
        );

    }

}


// ==========================================================
// STUDENT SEARCH
// ==========================================================

function searchStudent(event) {

    const value =
        event.target.value
            .trim()
            .toLowerCase();


    selectedStudent =
        null;


    if (!value) {

        return;

    }


    const matches =
        students.filter(
            student => {

                const name =
                    String(
                        student.name ||
                        ""
                    ).toLowerCase();

                const emis =
                    String(
                        student.emis ||
                        ""
                    ).toLowerCase();

                const id =
                    String(
                        student.id ||
                        ""
                    ).toLowerCase();

                return (
                    name.includes(value) ||
                    emis.includes(value) ||
                    id.includes(value)
                );

            }
        ).slice(0, 8);


    if (
        matches.length === 0
    ) {

        showMessage(
            "No student found.",
            "error"
        );

        return;

    }


    // If exact match
    if (
        matches.length === 1
    ) {

        selectStudent(
            matches[0]
        );

        return;

    }


    // Multiple matches
    const first =
        matches[0];

    selectStudent(first);


    showMessage(
        `${matches.length} students found. First matching student selected.`,
        "success"
    );

}


// ==========================================================
// SELECT STUDENT
// ==========================================================

function selectStudent(student) {

    selectedStudent =
        student;


    const searchInput =
        document.getElementById(
            "studentSearch"
        );


    if (searchInput) {

        searchInput.value =
            `${student.name} - ${student.emis}`;

    }


    console.log(
        "Selected Student:",
        student
    );

}


// ==========================================================
// POPULATE BUS DROPDOWN
// ==========================================================

function populateBusDropdown() {

    const select =
        document.getElementById(
            "assignmentBus"
        );


    if (!select) return;


    select.innerHTML = `

        <option value="">
            Select Bus
        </option>

    `;


    buses
        .filter(
            bus =>
                bus.status ===
                "Active"
        )
        .forEach(
            bus => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    bus.id;


                option.textContent =
                    `${bus.busNumber} - ${bus.registrationNumber}`;


                select.appendChild(
                    option
                );

            }
        );

}


// ==========================================================
// POPULATE ROUTE DROPDOWN
// ==========================================================

function populateRouteDropdown() {

    const select =
        document.getElementById(
            "assignmentRoute"
        );


    if (!select) return;


    select.innerHTML = `

        <option value="">
            Select Route
        </option>

    `;


    routes
        .filter(
            route =>
                route.status ===
                "Active"
        )
        .forEach(
            route => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    route.id;


                option.textContent =
                    route.routeName;


                select.appendChild(
                    option
                );

            }
        );

}


// ==========================================================
// SAVE ASSIGNMENT
// ==========================================================

async function saveAssignment(event) {

    event.preventDefault();


    try {

        if (!selectedStudent) {

            showMessage(
                "Please search and select a student.",
                "error"
            );

            return;

        }


        const busId =
            getValue(
                "assignmentBus"
            );

        const routeId =
            getValue(
                "assignmentRoute"
            );

        const pickupPoint =
            getValue(
                "pickupPoint"
            );

        const pickupTime =
            getValue(
                "pickupTime"
            );

        const dropTime =
            getValue(
                "dropTime"
            );


        if (!busId) {

            showMessage(
                "Please select a bus.",
                "error"
            );

            return;

        }


        if (!routeId) {

            showMessage(
                "Please select a route.",
                "error"
            );

            return;

        }


        if (!pickupPoint) {

            showMessage(
                "Please enter pickup point.",
                "error"
            );

            return;

        }


        const bus =
            buses.find(
                item =>
                    item.id ===
                    busId
            );


        const route =
            routes.find(
                item =>
                    item.id ===
                    routeId
            );


        await addDoc(

            collection(
                db,
                "transport_assignments"
            ),

            {

                studentId:
                    selectedStudent.id ||
                    "",

                studentDocId:
                    selectedStudent.docId ||
                    "",

                studentName:
                    selectedStudent.name ||
                    "",

                studentEmis:
                    selectedStudent.emis ||
                    "",

                studentClass:
                    selectedStudent.class ||
                    "",

                studentSection:
                    selectedStudent.section ||
                    "",

                busId:
                    busId,

                busNumber:
                    bus?.busNumber ||
                    "",

                routeId:
                    routeId,

                routeName:
                    route?.routeName ||
                    "",

                pickupPoint:
                    pickupPoint,

                pickupTime:
                    pickupTime,

                dropTime:
                    dropTime,

                status:
                    "Active",

                createdAt:
                    serverTimestamp(),

                createdBy:
                    auth.currentUser?.uid ||
                    ""

            }

        );


        showMessage(
            "Student transport assigned successfully.",
            "success"
        );


        document
            .getElementById(
                "assignmentForm"
            )
            ?.reset();


        selectedStudent =
            null;


        await loadAssignments();

        updateSummary();

        renderAssignments();


    } catch (error) {

        console.error(
            "Assignment Error:",
            error
        );

        showMessage(
            "Unable to assign transport: " +
            error.message,
            "error"
        );

    }

}


// ==========================================================
// UPDATE SUMMARY
// ==========================================================

function updateSummary() {

    const totalBuses =
        document.getElementById(
            "totalBuses"
        );

    const totalDrivers =
        document.getElementById(
            "totalDrivers"
        );

    const totalRoutes =
        document.getElementById(
            "totalRoutes"
        );

    const assignedStudents =
        document.getElementById(
            "assignedStudents"
        );


    if (totalBuses) {

        totalBuses.textContent =
            buses.filter(
                bus =>
                    bus.status ===
                    "Active"
            ).length;

    }


    if (totalDrivers) {

        totalDrivers.textContent =
            drivers.filter(
                driver =>
                    driver.status ===
                    "Active"
            ).length;

    }


    if (totalRoutes) {

        totalRoutes.textContent =
            routes.filter(
                route =>
                    route.status ===
                    "Active"
            ).length;

    }


    if (assignedStudents) {

        assignedStudents.textContent =
            assignments.filter(
                assignment =>
                    assignment.status ===
                    "Active"
            ).length;

    }

}


// ==========================================================
// RENDER ASSIGNMENTS
// ==========================================================

function renderAssignments() {

    const tbody =
        document.getElementById(
            "transportTableBody"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    if (
        assignments.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="emptyMessage">

                    No transport assignments found.

                </td>

            </tr>

        `;

        return;

    }


    assignments.forEach(
        assignment => {

            const row =
                document.createElement(
                    "tr"
                );


            const statusClass =
                getStatusClass(
                    assignment.status
                );


            row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHtml(
                            assignment.studentName ||
                            "-"
                        )}
                    </strong>

                    <br>

                    <small>
                        ${escapeHtml(
                            assignment.studentEmis ||
                            "-"
                        )}
                    </small>

                </td>


                <td>
                    ${escapeHtml(
                        assignment.busNumber ||
                        "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        assignment.routeName ||
                        "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        assignment.pickupPoint ||
                        "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        assignment.pickupTime ||
                        "-"
                    )}
                </td>


                <td>

                    <span
                        class="statusBadge ${statusClass}">

                        ${escapeHtml(
                            assignment.status ||
                            "Active"
                        )}

                    </span>

                </td>


                <td>

                    <button
                        type="button"
                        class="smallAction deleteAction"
                        onclick="deleteAssignment('${assignment.id}')">

                        🗑 Delete

                    </button>

                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );

}


// ==========================================================
// DELETE ASSIGNMENT
// ==========================================================

window.deleteAssignment =
    async function(id) {

        const assignment =
            assignments.find(
                item =>
                    item.id === id
            );


        if (!assignment) {

            return;

        }


        const confirmed =
            confirm(
                `Remove transport assignment for ${assignment.studentName}?`
            );


        if (!confirmed) {

            return;

        }


        try {

            await deleteDoc(

                doc(
                    db,
                    "transport_assignments",
                    id
                )

            );


            showMessage(
                "Transport assignment removed.",
                "success"
            );


            await loadAssignments();

            updateSummary();

            renderAssignments();


        } catch (error) {

            console.error(
                "Delete Assignment Error:",
                error
            );

            showMessage(
                "Unable to delete assignment.",
                "error"
            );

        }

    };


// ==========================================================
// QUICK ACTION SCROLL
// ==========================================================

window.openSection =
    function(section) {

        let elementId = "";


        switch(section) {

            case "bus":

                elementId =
                    "busSection";

                break;


            case "driver":

                elementId =
                    "driverSection";

                break;


            case "route":

                elementId =
                    "routeSection";

                break;


            case "assignment":

                elementId =
                    "assignmentSection";

                break;

        }


        const element =
            document.getElementById(
                elementId
            );


        if (element) {

            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    };


// ==========================================================
// HELPERS
// ==========================================================

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";

}


// ==========================================================
// STATUS CLASS
// ==========================================================

function getStatusClass(status) {

    if (
        status === "Inactive"
    ) {

        return "statusInactive";

    }


    if (
        status === "Maintenance"
    ) {

        return "statusMaintenance";

    }


    return "statusActive";

}


// ==========================================================
// HTML ESCAPE
// ==========================================================

function escapeHtml(value) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


// ==========================================================
// MESSAGE
// ==========================================================

function showMessage(
    message,
    type = "success"
) {

    let box =
        document.getElementById(
            "transportMessage"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "transportMessage";


        box.style.position =
            "fixed";

        box.style.top =
            "20px";

        box.style.right =
            "20px";

        box.style.zIndex =
            "99999";

        box.style.padding =
            "14px 20px";

        box.style.borderRadius =
            "10px";

        box.style.fontSize =
            "14px";

        box.style.fontWeight =
            "600";

        box.style.boxShadow =
            "0 5px 20px rgba(0,0,0,.2)";


        document.body.appendChild(
            box
        );

    }


    box.textContent =
        message;


    box.style.background =
        type === "error"
            ? "#dc3545"
            : "#198754";


    box.style.color =
        "#ffffff";


    box.style.display =
        "block";


    clearTimeout(
        window.__transportMessageTimer
    );


    window.__transportMessageTimer =
        setTimeout(
            () => {

                box.style.display =
                    "none";

            },
            3500
        );

}


// ==========================================================
// FINISH
// ==========================================================

console.log(
    "Transport Management JS Loaded Successfully"
);
