import {
    db
} from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    orderBy,
    query
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

console.log("=================================");
console.log("School Connect TN");
console.log("Transport Management");
console.log("=================================");


/* =====================================
   ELEMENTS
===================================== */

const busNumberInput =
    document.getElementById("busNumber");

const registrationNumberInput =
    document.getElementById("registrationNumber");

const busCapacityInput =
    document.getElementById("busCapacity");

const busStatusInput =
    document.getElementById("busStatus");

const busCount =
    document.getElementById("busCount");


/* =====================================
   SAVE BUS
===================================== */

async function saveBus() {

    try {

        const busNumber =
            busNumberInput?.value.trim();

        const registrationNumber =
            registrationNumberInput?.value.trim();

        const capacity =
            Number(busCapacityInput?.value);

        const status =
            busStatusInput?.value || "Active";


        /* Validation */

        if (!busNumber) {
            alert("Please enter Bus Number.");
            busNumberInput?.focus();
            return;
        }

        if (!registrationNumber) {
            alert("Please enter Registration Number.");
            registrationNumberInput?.focus();
            return;
        }

        if (!capacity || capacity <= 0) {
            alert("Please enter a valid Bus Capacity.");
            busCapacityInput?.focus();
            return;
        }


        /* Prevent duplicate registration */

        const existingSnapshot =
            await getDocs(
                collection(db, "transport_buses")
            );

        const duplicate =
            existingSnapshot.docs.some(doc => {

                const data = doc.data();

                return (
                    String(data.registrationNumber || "")
                        .toLowerCase()
                        .trim()
                    ===
                    registrationNumber
                        .toLowerCase()
                        .trim()
                );

            });


        if (duplicate) {

            alert(
                "This Registration Number already exists."
            );

            return;
        }


        /* Save */

        await addDoc(
            collection(db, "transport_buses"),
            {

                busNumber: busNumber,

                registrationNumber:
                    registrationNumber,

                capacity: capacity,

                status: status,

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()

            }
        );


        alert(
            "✅ Bus saved successfully."
        );


        /* Clear form */

        clearBusForm();


        /* Reload count */

        await loadBusCount();

        await loadBusList();


    } catch (error) {

        console.error(
            "Save Bus Error:",
            error
        );

        alert(
            "❌ Failed to save bus.\n\n" +
            error.message
        );

    }

}


/* =====================================
   LOAD BUS COUNT
===================================== */

async function loadBusCount() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "transport_buses")
            );

        if (busCount) {

            busCount.textContent =
                snapshot.size;

        }

        console.log(
            "Buses Loaded:",
            snapshot.size
        );


    } catch (error) {

        console.error(
            "Load Bus Count Error:",
            error
        );

    }

}


/* =====================================
   LOAD BUS LIST
===================================== */

async function loadBusList() {

    try {

        const busList =
            document.getElementById("busList");

        if (!busList) {
            return;
        }


        const q =
            query(
                collection(
                    db,
                    "transport_buses"
                ),
                orderBy(
                    "createdAt",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(q);


        busList.innerHTML = "";


        if (snapshot.empty) {

            busList.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center;">
                        No buses added yet.
                    </td>
                </tr>
            `;

            return;
        }


        snapshot.forEach(doc => {

            const data = doc.data();


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        data.busNumber || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        data.registrationNumber || "-"
                    )}
                </td>

                <td>
                    ${data.capacity || 0}
                </td>

                <td>
                    <span class="status-badge">
                        ${escapeHTML(
                            data.status || "Active"
                        )}
                    </span>
                </td>

                <td>
                    ${formatDate(
                        data.createdAt
                    )}
                </td>

                <td>
                    <button
                        type="button"
                        onclick="deleteBus('${doc.id}')">
                        🗑️ Delete
                    </button>
                </td>

            `;


            busList.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Load Bus List Error:",
            error
        );

    }

}


/* =====================================
   DELETE BUS
===================================== */

async function deleteBus(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this bus?"
        );

    if (!confirmDelete) {
        return;
    }


    try {

        const {
            deleteDoc,
            doc
        } =
        await import(
            "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"
        );


        await deleteDoc(
            doc(
                db,
                "transport_buses",
                id
            )
        );


        alert(
            "✅ Bus deleted successfully."
        );


        await loadBusCount();

        await loadBusList();


    } catch (error) {

        console.error(
            "Delete Bus Error:",
            error
        );

        alert(
            "❌ Failed to delete bus.\n\n" +
            error.message
        );

    }

}


/* =====================================
   CLEAR BUS FORM
===================================== */

function clearBusForm() {

    if (busNumberInput)
        busNumberInput.value = "";

    if (registrationNumberInput)
        registrationNumberInput.value = "";

    if (busCapacityInput)
        busCapacityInput.value = "";

    if (busStatusInput)
        busStatusInput.value = "Active";

}


/* =====================================
   DATE FORMAT
===================================== */

function formatDate(timestamp) {

    if (!timestamp) {
        return "-";
    }

    try {

        const date =
            timestamp.toDate();

        return date.toLocaleDateString(
            "en-IN"
        );

    } catch {

        return "-";

    }

}


/* =====================================
   HTML SECURITY
===================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =====================================
   GLOBAL FUNCTIONS
===================================== */

window.saveBus =
    saveBus;

window.deleteBus =
    deleteBus;

window.clearBusForm =
    clearBusForm;


/* =====================================
   PAGE LOAD
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Transport Management Ready"
        );

        await loadBusCount();

        await loadBusList();

    }
);
