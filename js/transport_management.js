import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    orderBy
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
            busNumberInput.value.trim();

        const registrationNumber =
            registrationNumberInput.value.trim();

        const capacity =
            Number(busCapacityInput.value);

        const status =
            busStatusInput.value || "Active";


        if (!busNumber) {

            alert("Please enter Bus Number.");

            busNumberInput.focus();

            return;
        }


        if (!registrationNumber) {

            alert(
                "Please enter Registration Number."
            );

            registrationNumberInput.focus();

            return;
        }


        if (!capacity || capacity <= 0) {

            alert(
                "Please enter valid Bus Capacity."
            );

            busCapacityInput.focus();

            return;
        }


        /* =====================================
           CHECK DUPLICATE REGISTRATION
        ===================================== */

        const existingSnapshot =
            await getDocs(
                collection(
                    db,
                    "transport_buses"
                )
            );


        const duplicate =
            existingSnapshot.docs.some(
                item => {

                    const data =
                        item.data();

                    return String(
                        data.registrationNumber || ""
                    )
                        .trim()
                        .toLowerCase()
                        ===
                        registrationNumber
                            .trim()
                            .toLowerCase();

                }
            );


        if (duplicate) {

            alert(
                "This Registration Number already exists."
            );

            return;
        }


        /* =====================================
           SAVE TO FIRESTORE
        ===================================== */

        const docRef =
            await addDoc(
                collection(
                    db,
                    "transport_buses"
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

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp()

                }
            );


        console.log(
            "Bus Saved:",
            docRef.id
        );


        alert(
            "✅ Bus saved successfully."
        );


        clearBusForm();

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
                collection(
                    db,
                    "transport_buses"
                )
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
            "Bus Count Error:",
            error
        );

    }

}


/* =====================================
   LOAD BUS LIST
===================================== */

async function loadBusList() {

    const busList =
        document.getElementById("busList");


    if (!busList) {

        console.log(
            "Bus list element not found."
        );

        return;
    }


    try {

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


        snapshot.forEach(
            item => {

                const data =
                    item.data();


                const row =
                    document.createElement(
                        "tr"
                    );


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
                        ${escapeHTML(
                            data.status || "Active"
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            data.createdAt
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="deleteBusBtn"
                            data-id="${item.id}">

                            🗑️ Delete

                        </button>

                    </td>

                `;


                busList.appendChild(row);

            }
        );


        /* =====================================
           DELETE BUTTON EVENTS
        ===================================== */

        document
            .querySelectorAll(
                ".deleteBusBtn"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteBus(
                            button.dataset.id
                        );

                    }
                );

            });


    } catch (error) {

        console.error(
            "Bus List Error:",
            error
        );

    }

}


/* =====================================
   DELETE BUS
===================================== */

async function deleteBus(id) {

    if (
        !confirm(
            "Are you sure you want to delete this bus?"
        )
    ) {

        return;

    }


    try {

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
   CLEAR FORM
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
   FORMAT DATE
===================================== */

function formatDate(timestamp) {

    if (!timestamp)
        return "-";


    try {

        return timestamp
            .toDate()
            .toLocaleDateString(
                "en-IN"
            );

    } catch {

        return "-";

    }

}


/* =====================================
   ESCAPE HTML
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

window.clearBusForm =
    clearBusForm;

window.deleteBus =
    deleteBus;


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
