// ==========================================================
// School Connect TN
// Fees Management
// Professional V1
// ==========================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


// ==========================================================
// COLLECTION
// ==========================================================

const FEES_COLLECTION = "fees";


// ==========================================================
// ELEMENTS
// ==========================================================

const studentSelect =
    document.getElementById("studentSelect");

const studentNameInput =
    document.getElementById("studentName");

const studentEmisInput =
    document.getElementById("studentEmis");

const studentClassInput =
    document.getElementById("studentClass");

const studentSectionInput =
    document.getElementById("studentSection");

const academicYearInput =
    document.getElementById("academicYear");

const feeTypeInput =
    document.getElementById("feeType");

const totalAmountInput =
    document.getElementById("totalAmount");

const dueDateInput =
    document.getElementById("dueDate");

const saveFeeButton =
    document.getElementById("saveFee");

const clearButton =
    document.getElementById("clearFee");

const searchInput =
    document.getElementById("feeSearch");

const statusFilter =
    document.getElementById("feeStatusFilter");

const feeTableBody =
    document.getElementById("feeTableBody");

const paymentHistoryBody =
    document.getElementById("paymentHistoryBody");


// ==========================================================
// DATA
// ==========================================================

let students = [];

let feeRecords = [];

let editingFeeId = null;


// ==========================================================
// INITIALIZE
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "======================================"
        );

        console.log(
            "School Connect TN"
        );

        console.log(
            "Fees Management V1"
        );

        console.log(
            "======================================"
        );


        await loadStudents();

        await loadFees();

        setupEvents();

    }
);


// ==========================================================
// EVENTS
// ==========================================================

function setupEvents() {

    if (studentSelect) {

        studentSelect.addEventListener(
            "change",
            handleStudentChange
        );

    }


    if (saveFeeButton) {

        saveFeeButton.addEventListener(
            "click",
            saveFee
        );

    }


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearForm
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderFees
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            renderFees
        );

    }

}


// ==========================================================
// LOAD STUDENTS
// ==========================================================

async function loadStudents() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        students = [];


        snapshot.forEach(
            docSnap => {

                students.push({

                    id:
                        docSnap.id,

                    ...docSnap.data()

                });

            }
        );


        console.log(
            "Students Loaded:",
            students.length
        );


        populateStudentDropdown();

    }

    catch (error) {

        console.error(
            "Student Loading Error:",
            error
        );

        showMessage(
            "Unable to load students: " +
            error.message,
            "error"
        );

    }

}


// ==========================================================
// POPULATE STUDENT DROPDOWN
// ==========================================================

function populateStudentDropdown() {

    if (!studentSelect) return;


    studentSelect.innerHTML = `

        <option value="">
            Select Student
        </option>

    `;


    students.forEach(
        student => {

            const option =
                document.createElement("option");


            const name =
                student.studentName ||
                student.name ||
                "-";


            const emis =
                student.emis ||
                student.emisNumber ||
                student.EMIS ||
                student.studentId ||
                "-";


            option.value =
                student.id;


            option.textContent =
                `${name} - ${emis}`;


            studentSelect.appendChild(
                option
            );

        }
    );

}


// ==========================================================
// STUDENT CHANGE
// ==========================================================

function handleStudentChange() {

    const studentId =
        studentSelect.value;


    if (!studentId) {

        clearStudentDetails();

        return;

    }


    const student =
        students.find(
            item =>
                item.id === studentId
        );


    if (!student) return;


    if (studentNameInput) {

        studentNameInput.value =
            student.studentName ||
            student.name ||
            "";

    }


    if (studentEmisInput) {

        studentEmisInput.value =
            student.emis ||
            student.emisNumber ||
            student.EMIS ||
            student.studentId ||
            "";

    }


    if (studentClassInput) {

        studentClassInput.value =
            student.className ||
            student.class ||
            student.standard ||
            "";

    }


    if (studentSectionInput) {

        studentSectionInput.value =
            student.section ||
            "";

    }

}


// ==========================================================
// CLEAR STUDENT DETAILS
// ==========================================================

function clearStudentDetails() {

    if (studentNameInput)
        studentNameInput.value = "";

    if (studentEmisInput)
        studentEmisInput.value = "";

    if (studentClassInput)
        studentClassInput.value = "";

    if (studentSectionInput)
        studentSectionInput.value = "";

}


// ==========================================================
// SAVE FEE
// ==========================================================

async function saveFee() {

    try {

        // ----------------------------------------------
        // BASIC VALIDATION
        // ----------------------------------------------

        if (!studentSelect || !studentSelect.value) {

            showMessage(
                "Please select a student.",
                "error"
            );

            return;

        }


        const student =
            students.find(
                item =>
                    item.id ===
                    studentSelect.value
            );


        if (!student) {

            showMessage(
                "Student details not found.",
                "error"
            );

            return;

        }


        const totalFee =
            Number(
                totalAmountInput?.value
            );


        if (
            !Number.isFinite(totalFee) ||
            totalFee <= 0
        ) {

            showMessage(
                "Please enter a valid Total Amount.",
                "error"
            );

            return;

        }


        // ----------------------------------------------
        // GET STUDENT DETAILS
        // ----------------------------------------------

        const studentName =
            student.studentName ||
            student.name ||
            "";


        const studentId =
            String(
                student.emis ||
                student.emisNumber ||
                student.EMIS ||
                student.studentId ||
                ""
            );


        const studentClass =
            student.className ||
            student.class ||
            student.standard ||
            "";


        const studentSection =
            student.section ||
            "";


        // ----------------------------------------------
        // FORM VALUES
        // ----------------------------------------------

        const academicYear =
            academicYearInput?.value ||
            "";


        const feeType =
            feeTypeInput?.value ||
            "Tuition Fee";


        const dueDate =
            dueDateInput?.value ||
            "";


        // ----------------------------------------------
        // NEW FEE OBJECT
        // ----------------------------------------------

        const feeData = {

            academicYear:

                academicYear,

            balance:

                totalFee,

            createdBy:

                auth.currentUser?.email ||
                "Admin",

            feeType:

                feeType,

            paidAmount:

                0,

            paymentDate:

                null,

            paymentMode:

                "",

            remarks:

                "",

            status:

                "Pending",

            studentClass:

                studentClass,

            studentDocId:

                student.id,

            studentId:

                studentId,

            studentName:

                studentName,

            studentSection:

                studentSection,

            totalFee:

                totalFee,

            dueDate:

                dueDate,

            createdAt:

                serverTimestamp(),

            updatedAt:

                serverTimestamp()

        };


        // ----------------------------------------------
        // UPDATE
        // ----------------------------------------------

        if (editingFeeId) {

            const feeRef =
                doc(
                    db,
                    FEES_COLLECTION,
                    editingFeeId
                );


            await updateDoc(
                feeRef,
                {

                    ...feeData,

                    createdAt:
                        undefined,

                    updatedAt:
                        serverTimestamp()

                }
            );


            showMessage(
                "Fee updated successfully.",
                "success"
            );

        }

        // ----------------------------------------------
        // CREATE
        // ----------------------------------------------

        else {

            await addDoc(
                collection(
                    db,
                    FEES_COLLECTION
                ),
                feeData
            );


            showMessage(
                "Fee saved successfully.",
                "success"
            );

        }


        // ----------------------------------------------
        // RESET
        // ----------------------------------------------

        clearForm();

        editingFeeId = null;

        await loadFees();

    }

    catch (error) {

        console.error(
            "SAVE FEE ERROR:",
            error
        );


        showMessage(
            "Fee save failed: " +
            error.message,
            "error"
        );

    }

}


// ==========================================================
// LOAD FEES
// ==========================================================

async function loadFees() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    FEES_COLLECTION
                )
            );


        feeRecords = [];


        snapshot.forEach(
            docSnap => {

                feeRecords.push({

                    id:
                        docSnap.id,

                    ...docSnap.data()

                });

            }
        );


        console.log(
            "Fees Loaded:",
            feeRecords.length
        );


        // Newest first
        feeRecords.sort(
            (a, b) => {

                const timeA =
                    getTimestampMillis(
                        a.createdAt
                    );


                const timeB =
                    getTimestampMillis(
                        b.createdAt
                    );


                return timeB - timeA;

            }
        );


        renderFees();

        renderPaymentHistory();

    }

    catch (error) {

        console.error(
            "LOAD FEES ERROR:",
            error
        );


        if (feeTableBody) {

            feeTableBody.innerHTML = `

                <tr>

                    <td colspan="10">

                        Unable to load fee records.

                    </td>

                </tr>

            `;

        }

    }

}


// ==========================================================
// RENDER FEES
// ==========================================================

function renderFees() {

    if (!feeTableBody) return;


    const searchText =
        (
            searchInput?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const selectedStatus =
        statusFilter?.value ||
        "";


    let records =
        [...feeRecords];


    // Search

    if (searchText) {

        records =
            records.filter(
                fee => {

                    const name =
                        String(
                            fee.studentName ||
                            ""
                        )
                        .toLowerCase();


                    const emis =
                        String(
                            fee.studentId ||
                            ""
                        )
                        .toLowerCase();


                    return (
                        name.includes(
                            searchText
                        ) ||
                        emis.includes(
                            searchText
                        )
                    );

                }
            );

    }


    // Status filter

    if (selectedStatus) {

        records =
            records.filter(
                fee =>
                    String(
                        fee.status ||
                        ""
                    ) === selectedStatus
            );

    }


    if (!records.length) {

        feeTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    style="text-align:center;padding:25px;">

                    No fee records found.

                </td>

            </tr>

        `;

        return;

    }


    feeTableBody.innerHTML = "";


    records.forEach(
        fee => {

            const total =
                Number(
                    fee.totalFee
                ) || 0;


            const paid =
                Number(
                    fee.paidAmount
                ) || 0;


            // Always calculate balance
            // instead of trusting old data

            const pending =
                Math.max(
                    total - paid,
                    0
                );


            const status =
                getFeeStatus(
                    total,
                    paid
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        fee.studentName ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        fee.studentId ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        fee.studentClass ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        fee.feeType ||
                        "-"
                    )}
                </td>

                <td>
                    ₹${formatMoney(total)}
                </td>

                <td>
                    ₹${formatMoney(paid)}
                </td>

                <td>
                    ₹${formatMoney(pending)}
                </td>

                <td>
                    ${statusBadge(status)}
                </td>

                <td>
                    ${formatDate(
                        fee.createdAt
                    )}
                </td>

                <td>

                    <button
                        class="editFeeBtn"
                        onclick="editFee('${fee.id}')">

                        ✏️

                    </button>

                    <button
                        class="deleteFeeBtn"
                        onclick="deleteFee('${fee.id}')">

                        🗑️

                    </button>

                </td>

            `;


            feeTableBody.appendChild(
                row
            );

        }
    );

}


// ==========================================================
// PAYMENT HISTORY
// ==========================================================

function renderPaymentHistory() {

    if (!paymentHistoryBody)
        return;


    const payments =
        feeRecords.filter(
            fee =>
                Number(
                    fee.paidAmount
                ) > 0
        );


    if (!payments.length) {

        paymentHistoryBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;padding:25px;">

                    No Payment History

                </td>

            </tr>

        `;

        return;

    }


    paymentHistoryBody.innerHTML =
        "";


    payments.forEach(
        fee => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${formatDate(
                        fee.paymentDate
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        fee.studentName ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        fee.studentId ||
                        "-"
                    )}
                </td>

                <td>
                    ₹${formatMoney(
                        fee.paidAmount
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        fee.paymentMode ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        fee.receiptNo ||
                        "-"
                    )}
                </td>

            `;


            paymentHistoryBody.appendChild(
                row
            );

        }
    );

}


// ==========================================================
// EDIT FEE
// ==========================================================

window.editFee =
    function (feeId) {

        const fee =
            feeRecords.find(
                item =>
                    item.id === feeId
            );


        if (!fee) return;


        editingFeeId =
            feeId;


        if (studentSelect) {

            studentSelect.value =
                fee.studentDocId ||
                "";

        }


        if (studentSelect) {

            handleStudentChange();

        }


        if (academicYearInput) {

            academicYearInput.value =
                fee.academicYear ||
                "";

        }


        if (feeTypeInput) {

            feeTypeInput.value =
                fee.feeType ||
                "Tuition Fee";

        }


        if (totalAmountInput) {

            totalAmountInput.value =
                fee.totalFee ||
                "";

        }


        if (dueDateInput) {

            dueDateInput.value =
                fee.dueDate ||
                "";

        }


        if (saveFeeButton) {

            saveFeeButton.textContent =
                "💾 Update Fee";

        }


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };


// ==========================================================
// DELETE FEE
// ==========================================================

window.deleteFee =
    async function (feeId) {

        const confirmed =
            confirm(
                "Delete this fee record?"
            );


        if (!confirmed)
            return;


        try {

            await deleteDoc(
                doc(
                    db,
                    FEES_COLLECTION,
                    feeId
                )
            );


            showMessage(
                "Fee deleted successfully.",
                "success"
            );


            await loadFees();

        }

        catch (error) {

            console.error(
                "DELETE FEE ERROR:",
                error
            );


            showMessage(
                "Delete failed: " +
                error.message,
                "error"
            );

        }

    };


// ==========================================================
// CLEAR FORM
// ==========================================================

function clearForm() {

    editingFeeId =
        null;


    if (studentSelect)
        studentSelect.value = "";


    clearStudentDetails();


    if (academicYearInput)
        academicYearInput.value =
            "2026 - 2027";


    if (feeTypeInput)
        feeTypeInput.value =
            "Tuition Fee";


    if (totalAmountInput)
        totalAmountInput.value = "";


    if (dueDateInput)
        dueDateInput.value = "";


    if (saveFeeButton)
        saveFeeButton.textContent =
            "💾 Save Fee";

}


// ==========================================================
// FEE STATUS
// ==========================================================

function getFeeStatus(
    total,
    paid
) {

    if (paid >= total && total > 0)
        return "Paid";


    if (paid > 0)
        return "Partial";


    return "Pending";

}


// ==========================================================
// STATUS BADGE
// ==========================================================

function statusBadge(
    status
) {

    let className =
        "pending";


    if (status === "Paid")
        className = "paid";


    if (status === "Partial")
        className = "partial";


    return `

        <span
            class="feeStatus ${className}">

            ${status}

        </span>

    `;

}


// ==========================================================
// TIMESTAMP CONVERSION
// ==========================================================

function getTimestampMillis(
    value
) {

    if (!value)
        return 0;


    // Firestore Timestamp

    if (
        typeof value.toMillis ===
        "function"
    ) {

        return value.toMillis();

    }


    // Timestamp object

    if (
        typeof value.seconds ===
        "number"
    ) {

        return (
            value.seconds * 1000
        ) +
        (
            Number(
                value.nanoseconds
            ) / 1000000
        );

    }


    // JS Date

    if (
        value instanceof Date
    ) {

        return value.getTime();

    }


    // String / number

    const parsed =
        new Date(value)
            .getTime();


    return Number.isNaN(parsed)
        ? 0
        : parsed;

}


// ==========================================================
// DATE FORMAT
// ==========================================================

function formatDate(
    value
) {

    if (!value)
        return "-";


    const millis =
        getTimestampMillis(
            value
        );


    if (!millis)
        return "-";


    const date =
        new Date(millis);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


// ==========================================================
// MONEY
// ==========================================================

function formatMoney(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );

}


// ==========================================================
// HTML ESCAPE
// ==========================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
    .replaceAll(
        "&",
        "&amp;"
    )
    .replaceAll(
        "<",
        "&lt;"
    )
    .replaceAll(
        ">",
        "&gt;"
    )
    .replaceAll(
        '"',
        "&quot;"
    )
    .replaceAll(
        "'",
        "&#039;"
    );

}


// ==========================================================
// MESSAGE
// ==========================================================

function showMessage(
    message,
    type
) {

    let box =
        document.getElementById(
            "feeMessage"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "feeMessage";


        document.body.prepend(
            box
        );

    }


    box.textContent =
        message;


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

    box.style.fontWeight =
        "600";

    box.style.fontSize =
        "14px";

    box.style.color =
        "#fff";


    box.style.background =
        type === "success"
            ? "#2e7d32"
            : "#d32f2f";


    clearTimeout(
        box._timer
    );


    box._timer =
        setTimeout(
            () => {

                box.remove();

            },
            3500
        );

}
