// =====================================
// School Connect TN
// Transport Management
// =====================================

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================
// COLLECTIONS
// =====================================

const busesRef = collection(db, "transport_buses");
const driversRef = collection(db, "transport_drivers");
const routesRef = collection(db, "transport_routes");
const assignmentsRef = collection(db, "transport_assignments");


// =====================================
// DOM READY
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("=================================");
    console.log("School Connect TN");
    console.log("Transport Management Loaded");
    console.log("=================================");

    loadTransportData();

    setupForms();

});


// =====================================
// QUICK ACTION NAVIGATION
// =====================================

window.openSection = function(section) {

    const sectionMap = {

        bus: "busSection",

        driver: "driverSection",

        route: "routeSection",

        assignment: "assignmentSection"

    };

    const targetId = sectionMap[section];

    if (!targetId) {
        console.warn("Unknown section:", section);
        return;
    }

    const target = document.getElementById(targetId);

    if (!target) {
        console.warn("Section not found:", targetId);
        return;
    }

    target.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

};


// =====================================
// FORM SETUP
// =====================================

function setupForms() {

    const busForm =
        document.getElementById("busForm");

    const driverForm =
        document.getElementById("driverForm");

    const routeForm =
        document.getElementById("routeForm");

    const assignmentForm =
        document.getElementById("assignmentForm");


    // BUS
    if (busForm) {

        busForm.addEventListener(
            "submit",
            saveBus
        );

    }


    // DRIVER
    if (driverForm) {

        driverForm.addEventListener(
            "submit",
            saveDriver
        );

    }


    // ROUTE
    if (routeForm) {

        routeForm.addEventListener(
            "submit",
            saveRoute
        );

    }


    // ASSIGNMENT
    if (assignmentForm) {

        assignmentForm.addEventListener(
            "submit",
            saveAssignment
        );

    }

}


// =====================================
// SAVE BUS
// =====================================

async function saveBus(event) {

    event.preventDefault();

    const busNumber =
        document.getElementById("busNumber").value.trim();

    const registrationNumber =
        document.getElementById("registrationNumber").value.trim();

    const busCapacity =
        Number(
            document.getElementById("busCapacity").value
        );

    const busStatus =
        document.getElementById("busStatus").value;


    if (!busNumber ||
        !registrationNumber ||
        !busCapacity) {

        alert("Please enter all required bus details.");

        return;

    }


    try {

        await addDoc(busesRef, {

            busNumber: busNumber,

            registrationNumber:
                registrationNumber,

            capacity: busCapacity,

            status: busStatus,

            createdAt:
                serverTimestamp()

        });


        alert("Bus saved successfully.");

        document.getElementById("busForm").reset();

        await loadTransportData();

    }

    catch (error) {

        console.error(
            "Bus Save Error:",
            error
        );

        alert(
            "Unable to save bus. Please check Firebase."
        );

    }

}


// =====================================
// SAVE DRIVER
// =====================================

async function saveDriver(event) {

    event.preventDefault();

    const driverName =
        document.getElementById("driverName").value.trim();

    const driverPhone =
        document.getElementById("driverPhone").value.trim();

    const licenseNumber =
        document.getElementById("licenseNumber").value.trim();

    const driverStatus =
        document.getElementById("driverStatus").value;


    if (!driverName || !driverPhone) {

        alert("Please enter driver name and mobile number.");

        return;

    }


    try {

        await addDoc(driversRef, {

            driverName: driverName,

            phone: driverPhone,

            licenseNumber: licenseNumber,

            status: driverStatus,

            createdAt:
                serverTimestamp()

        });


        alert("Driver saved successfully.");

        document.getElementById("driverForm").reset();

        await loadTransportData();

    }

    catch (error) {

        console.error(
            "Driver Save Error:",
            error
        );

        alert(
            "Unable to save driver."
        );

    }

}


// =====================================
// SAVE ROUTE
// =====================================

async function saveRoute(event) {

    event.preventDefault();

    const routeName =
        document.getElementById("routeName").value.trim();

    const startPoint =
        document.getElementById("startPoint").value.trim();

    const endPoint =
        document.getElementById("endPoint").value.trim();

    const routeStatus =
        document.getElementById("routeStatus").value;

    const pickupPoints =
        document.getElementById("pickupPoints").value.trim();


    if (!routeName ||
        !startPoint ||
        !endPoint) {

        alert("Please enter route details.");

        return;

    }


    try {

        await addDoc(routesRef, {

            routeName: routeName,

            startPoint: startPoint,

            endPoint: endPoint,

            pickupPoints: pickupPoints,

            status: routeStatus,

            createdAt:
                serverTimestamp()

        });


        alert("Route saved successfully.");

        document.getElementById("routeForm").reset();

        await loadTransportData();

    }

    catch (error) {

        console.error(
            "Route Save Error:",
            error
        );

        alert(
            "Unable to save route."
        );

    }

}


// =====================================
// SAVE STUDENT ASSIGNMENT
// =====================================

async function saveAssignment(event) {

    event.preventDefault();


    const studentSearch =
        document.getElementById("studentSearch").value.trim();

    const busId =
        document.getElementById("assignmentBus").value;

    const routeId =
        document.getElementById("assignmentRoute").value;

    const pickupPoint =
        document.getElementById("pickupPoint").value.trim();

    const pickupTime =
        document.getElementById("pickupTime").value;

    const dropTime =
        document.getElementById("dropTime").value;


    if (!studentSearch ||
        !busId ||
        !routeId ||
        !pickupPoint) {

        alert(
            "Please complete all required assignment details."
        );

        return;

    }


    try {

        await addDoc(assignmentsRef, {

            studentSearch: studentSearch,

            busId: busId,

            routeId: routeId,

            pickupPoint: pickupPoint,

            pickupTime: pickupTime,

            dropTime: dropTime,

            status: "Active",

            createdAt:
                serverTimestamp()

        });


        alert(
            "Student transport assigned successfully."
        );


        document
            .getElementById("assignmentForm")
            .reset();


        await loadTransportData();

    }

    catch (error) {

        console.error(
            "Assignment Save Error:",
            error
        );

        alert(
            "Unable to save student assignment."
        );

    }

}


// =====================================
// LOAD ALL TRANSPORT DATA
// =====================================

async function loadTransportData() {

    try {

        const [
            busSnapshot,
            driverSnapshot,
            routeSnapshot,
            assignmentSnapshot
        ] = await Promise.all([

            getDocs(busesRef),

            getDocs(driversRef),

            getDocs(routesRef),

            getDocs(assignmentsRef)

        ]);


        const buses =
            busSnapshot.docs.map(item => ({

                id: item.id,
                ...item.data()

            }));


        const drivers =
            driverSnapshot.docs.map(item => ({

                id: item.id,
                ...item.data()

            }));


        const routes =
            routeSnapshot.docs.map(item => ({

                id: item.id,
                ...item.data()

            }));


        const assignments =
            assignmentSnapshot.docs.map(item => ({

                id: item.id,
                ...item.data()

            }));


        // SUMMARY

        document.getElementById(
            "totalBuses"
        ).textContent = buses.length;


        document.getElementById(
            "totalDrivers"
        ).textContent = drivers.length;


        document.getElementById(
            "totalRoutes"
        ).textContent = routes.length;


        document.getElementById(
            "assignedStudents"
        ).textContent = assignments.length;


        // DROPDOWNS

        populateBusDropdown(buses);

        populateRouteDropdown(routes);


        // TABLE

        renderTransportTable(
            assignments,
            buses,
            routes
        );


        console.log(
            "Transport Data Loaded",
            {
                buses: buses.length,
                drivers: drivers.length,
                routes: routes.length,
                assignments: assignments.length
            }
        );

    }

    catch (error) {

        console.error(
            "Transport Load Error:",
            error
        );

    }

}


// =====================================
// BUS DROPDOWN
// =====================================

function populateBusDropdown(buses) {

    const select =
        document.getElementById("assignmentBus");

    if (!select) return;


    select.innerHTML = `
        <option value="">
            Select Bus
        </option>
    `;


    buses.forEach(bus => {

        const option =
            document.createElement("option");


        option.value = bus.id;


        option.textContent =
            `${bus.busNumber} - ${bus.registrationNumber}`;


        select.appendChild(option);

    });

}


// =====================================
// ROUTE DROPDOWN
// =====================================

function populateRouteDropdown(routes) {

    const select =
        document.getElementById("assignmentRoute");

    if (!select) return;


    select.innerHTML = `
        <option value="">
            Select Route
        </option>
    `;


    routes.forEach(route => {

        const option =
            document.createElement("option");


        option.value = route.id;


        option.textContent =
            route.routeName;


        select.appendChild(option);

    });

}


// =====================================
// TRANSPORT TABLE
// =====================================

function renderTransportTable(
    assignments,
    buses,
    routes
) {

    const tbody =
        document.getElementById(
            "transportTableBody"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    if (assignments.length === 0) {

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


    assignments.forEach(assignment => {


        const bus =
            buses.find(
                item =>
                    item.id === assignment.busId
            );


        const route =
            routes.find(
                item =>
                    item.id === assignment.routeId
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHtml(
                    assignment.studentSearch || "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    bus?.busNumber || "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    route?.routeName || "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    assignment.pickupPoint || "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    assignment.pickupTime || "-"
                )}
            </td>

            <td>
                <span class="statusBadge">
                    ${escapeHtml(
                        assignment.status || "Active"
                    )}
                </span>
            </td>

            <td>

                <button
                    class="deleteButton"
                    data-id="${assignment.id}">

                    🗑️ Delete

                </button>

            </td>

        `;


        const deleteButton =
            row.querySelector(".deleteButton");


        deleteButton.addEventListener(
            "click",
            () => deleteAssignment(
                assignment.id
            )
        );


        tbody.appendChild(row);

    });

}


// =====================================
// DELETE ASSIGNMENT
// =====================================

async function deleteAssignment(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transport assignment?"
        );


    if (!confirmDelete) return;


    try {

        await deleteDoc(
            doc(
                db,
                "transport_assignments",
                id
            )
        );


        alert(
            "Transport assignment deleted."
        );


        await loadTransportData();

    }

    catch (error) {

        console.error(
            "Delete Error:",
            error
        );

        alert(
            "Unable to delete assignment."
        );

    }

}


// =====================================
// HTML SECURITY
// =====================================

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// =====================================
// GLOBAL ERROR LOG
// =====================================

window.addEventListener(
    "error",
    event => {

        console.error(
            "Transport Page Error:",
            event.error || event.message
        );

    }
);


console.log(
    "Transport Management JS Loaded Successfully"
);
