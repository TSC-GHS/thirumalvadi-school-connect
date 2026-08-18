// ==========================================================
// School Connect TN
// Fees Management
// UPDATED FULL VERSION
// ==========================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let students = [];
let feeRecords = [];

let selectedStudent = null;
let editingFeeId = null;


// ==========================================================
// DOM READY
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("====================================");
    console.log("School Connect TN");
    console.log("Fees Management Loaded");
    console.log("====================================");

    initializePage();

});


// ==========================================================
// INITIALIZE
// ==========================================================

async function initializePage() {

    try {

        setDefaultDueDate();

        await loadStudents();

        await loadFees();

        setupEvents();

        console.log("Fees Management Ready");

    } catch (error) {

        console.error("Initialization Error:", error);

        showMessage(
            "Unable to load Fees Management. Please refresh the page.",
            "error"
        );

    }

}


// ==========================================================
// LOAD STUDENTS
// ==========================================================

async function loadStudents() {

    try {

        const snapshot = await getDocs(
            collection(db, "students")
        );

        students = [];

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            students.push({

                docId: docSnap.id,

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

        });

        console.log(
            "Students Loaded:",
            students.length
        );

    } catch (error) {

        console.error(
            "Student Load Error:",
            error
        );

        throw error;

    }

}


// ==========================================================
// LOAD FEES
// ==========================================================

async function loadFees() {

    try {

        const snapshot = await getDocs(
            collection(db, "fees")
        );

        feeRecords = [];

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            feeRecords.push({

                id: docSnap.id,

                studentName:
                    data.studentName || "",

                studentId:
                    data.studentId || "",

                studentDocId:
                    data.studentDocId || "",

                studentEmis:
                    data.studentId ||
                    data.studentEmis ||
                    data.emis ||
                    data.emisNumber ||
                    "",

                studentClass:
                    data.studentClass ||
                    data.class ||
                    "",

                studentSection:
                    data.studentSection ||
                    data.section ||
                    "",

                academicYear:
                    data.academicYear || "",

                feeType:
                    data.feeType || "",

                totalFee:
                    Number(
                        data.totalFee ??
                        data.totalAmount ??
                        0
                    ),

                paidAmount:
                    Number(
                        data.paidAmount ??
                        data.paid ??
                        data.paidFee ??
                        0
                    ),

                pendingAmount:
                    Number(
                        data.pendingAmount ??
                        data.balance ??
                        0
                    ),

                dueDate:
                    data.dueDate || "",

                paymentMode:
                    data.paymentMode || "",

                paymentDate:
                    data.paymentDate || null,

                receiptNo:
                    data.receiptNo || "",

                remarks:
                    data.remarks || "",

                status:
                    data.status || "Pending",

                createdAt:
                    data.createdAt || null,

                createdBy:
                    data.createdBy || ""

            });

        });

        console.log(
            "Fee Records Loaded:",
            feeRecords.length
        );

        renderFees();

        updateSummary();

        renderPaymentHistory();

    } catch (error) {

        console.error(
            "Fee Load Error:",
            error
        );

        throw error;

    }

}


// ==========================================================
// EVENTS
// ==========================================================

function setupEvents() {

    // Student Search
    const studentSearch =
        document.getElementById("studentSearch");

    if (studentSearch) {

        studentSearch.addEventListener(
            "input",
            handleStudentSearch
        );

    }


    // Save Fee
    const saveButton =
        document.getElementById("saveFee");

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveFee
        );

    }


    // Clear
    const clearButton =
        document.getElementById("clearFee");

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearFeeForm
        );

    }


    // Fee Search
    const feeSearch =
        document.getElementById("feeSearch");

    if (feeSearch) {

        feeSearch.addEventListener(
            "input",
            renderFees
        );

    }


    // Status Filter
    const statusFilter =
        document.getElementById("feeStatusFilter");

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            renderFees
        );

    }

}


// ==========================================================
// STUDENT SEARCH
// ==========================================================

function handleStudentSearch(event) {

    const value =
        event.target.value
            .trim()
            .toLowerCase();

    const resultBox =
        document.getElementById(
            "studentResults"
        );

    if (!resultBox) return;

    resultBox.innerHTML = "";

    selectedStudent = null;

    clearStudentFields();


    if (!value) {

        resultBox.style.display = "none";

        return;

    }


    const matches =
        students.filter((student) => {

            const name =
                String(
                    student.name || ""
                ).toLowerCase();

            const emis =
                String(
                    student.emis || ""
                ).toLowerCase();

            const id =
                String(
                    student.id || ""
                ).toLowerCase();

            return (
                name.includes(value) ||
                emis.includes(value) ||
                id.includes(value)
            );

        }).slice(0, 10);


    if (matches.length === 0) {

        resultBox.innerHTML =
            `<div class="noResult">
                No student found
            </div>`;

        resultBox.style.display = "block";

        return;

    }


    matches.forEach((student) => {

        const item =
            document.createElement("div");

        item.className =
            "studentResultItem";

        item.innerHTML = `
            <strong>
                ${escapeHtml(student.name || "-")}
            </strong>

            <span>
                EMIS:
                ${escapeHtml(student.emis || "-")}
            </span>

            <small>
                Class:
                ${escapeHtml(student.class || "-")}
                ${
                    student.section
                        ? " - " +
                          escapeHtml(student.section)
                        : ""
                }
            </small>
        `;


        item.addEventListener(
            "click",
            () => {

                selectStudent(student);

            }
        );


        resultBox.appendChild(item);

    });


    resultBox.style.display = "block";

}


// ==========================================================
// SELECT STUDENT
// ==========================================================

function selectStudent(student) {

    selectedStudent = student;

    const search =
        document.getElementById(
            "studentSearch"
        );

    if (search) {

        search.value =
            student.name || "";

    }


    setValue(
        "studentName",
        student.name
    );

    setValue(
        "studentEmis",
        student.emis
    );

    setValue(
        "studentClass",
        student.class
    );

    setValue(
        "studentSection",
        student.section
    );


    const resultBox =
        document.getElementById(
            "studentResults"
        );

    if (resultBox) {

        resultBox.innerHTML = "";

        resultBox.style.display =
            "none";

    }

}


// ==========================================================
// CLEAR STUDENT FIELDS
// ==========================================================

function clearStudentFields() {

    setValue(
        "studentName",
        ""
    );

    setValue(
        "studentEmis",
        ""
    );

    setValue(
        "studentClass",
        ""
    );

    setValue(
        "studentSection",
        ""
    );

}


// ==========================================================
// SAVE FEE
// ==========================================================

async function saveFee() {

    try {

        const saveButton =
            document.getElementById(
                "saveFee"
            );


        // ------------------------------------------
        // VALIDATE STUDENT
        // ------------------------------------------

        if (!selectedStudent) {

            showMessage(
                "Please search and select a student.",
                "error"
            );

            return;

        }


        // ------------------------------------------
        // GET FORM VALUES
        // ------------------------------------------

        const studentName =
            getValue("studentName");

        const studentEmis =
            getValue("studentEmis");

        const studentClass =
            getValue("studentClass");

        const studentSection =
            getValue("studentSection");

        const academicYear =
            getValue("academicYear");

        const feeType =
            getValue("feeType");

        const totalAmount =
            Number(
                getValue("totalAmount")
            );

        const dueDate =
            getValue("dueDate");


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (!studentName) {

            showMessage(
                "Student name is missing.",
                "error"
            );

            return;

        }


        if (
            !totalAmount ||
            totalAmount <= 0
        ) {

            showMessage(
                "Please enter a valid fee amount.",
                "error"
            );

            return;

        }


        if (!dueDate) {

            showMessage(
                "Please select due date.",
                "error"
            );

            return;

        }


        // ------------------------------------------
        // DISABLE BUTTON
        // ------------------------------------------

        if (saveButton) {

            saveButton.disabled = true;

            saveButton.textContent =
                editingFeeId
                    ? "Updating..."
                    : "Saving...";

        }


        // ------------------------------------------
        // NEW FEE
        // ------------------------------------------

        if (!editingFeeId) {

            const feeData = {

                studentId:
                    selectedStudent.id || "",

                studentDocId:
                    selectedStudent.docId || "",

                studentName:
                    studentName,

                studentEmis:
                    studentEmis,

                studentClass:
                    studentClass,

                studentSection:
                    studentSection,

                academicYear:
                    academicYear,

                feeType:
                    feeType,

                totalFee:
                    totalAmount,

                paidAmount:
                    0,

                pendingAmount:
                    totalAmount,

                dueDate:
                    dueDate,

                paymentMode:
                    "",

                paymentDate:
                    null,

                receiptNo:
                    "",

                remarks:
                    "",

                status:
                    "Pending",

                createdAt:
                    serverTimestamp(),

                createdBy:
                    auth.currentUser?.uid || ""

            };


            const docRef =
                await addDoc(
                    collection(db, "fees"),
                    feeData
                );


            console.log(
                "Fee Saved:",
                docRef.id
            );


            showMessage(
                "Fee assigned successfully.",
                "success"
            );

        }


        // ------------------------------------------
        // UPDATE EXISTING FEE
        // ------------------------------------------

        else {

            const existing =
                feeRecords.find(
                    (fee) =>
                        fee.id ===
                        editingFeeId
                );


            if (!existing) {

                throw new Error(
                    "Fee record not found."
                );

            }


            const paid =
                Number(
                    existing.paidAmount || 0
                );


            const pending =
                Math.max(
                    totalAmount - paid,
                    0
                );


            let status =
                "Pending";


            if (paid >= totalAmount) {

                status = "Paid";

            } else if (paid > 0) {

                status = "Partial";

            }


            await updateDoc(

                doc(
                    db,
                    "fees",
                    editingFeeId
                ),

                {

                    studentId:
                        selectedStudent.id || "",

                    studentDocId:
                        selectedStudent.docId || "",

                    studentName:
                        studentName,

                    studentEmis:
                        studentEmis,

                    studentClass:
                        studentClass,

                    studentSection:
                        studentSection,

                    academicYear:
                        academicYear,

                    feeType:
                        feeType,

                    totalFee:
                        totalAmount,

                    pendingAmount:
                        pending,

                    dueDate:
                        dueDate,

                    status:
                        status,

                    updatedAt:
                        serverTimestamp()

                }

            );


            showMessage(
                "Fee updated successfully.",
                "success"
            );

        }


        // ------------------------------------------
        // RESET
        // ------------------------------------------

        clearFeeForm();

        await loadFees();


    } catch (error) {

        console.error(
            "Save Fee Error:",
            error
        );

        showMessage(
            "Unable to save fee: " +
            error.message,
            "error"
        );

    } finally {

        const saveButton =
            document.getElementById(
                "saveFee"
            );

        if (saveButton) {

            saveButton.disabled = false;

            saveButton.textContent =
                "💾 Save Fee";

        }

    }

}


// ==========================================================
// RENDER FEE TABLE
// ==========================================================

function renderFees() {

    const tbody =
        document.getElementById(
            "feeTableBody"
        );

    if (!tbody) return;


    const search =
        (
            getValue("feeSearch") || ""
        ).toLowerCase();


    const filter =
        getValue("feeStatusFilter") ||
        "All";


    let records =
        [...feeRecords];


    // Search
    if (search) {

        records =
            records.filter(
                (fee) => {

                    const name =
                        String(
                            fee.studentName ||
                            ""
                        ).toLowerCase();

                    const emis =
                        String(
                            fee.studentEmis ||
                            ""
                        ).toLowerCase();

                    return (
                        name.includes(search) ||
                        emis.includes(search)
                    );

                }
            );

    }


    // Status
    if (filter !== "All") {

        records =
            records.filter(
                (fee) =>
                    fee.status === filter
            );

    }


    tbody.innerHTML = "";


    if (records.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    class="emptyMessage">

                    No Fee Records Found

                </td>
            </tr>
        `;

        return;

    }


    records.forEach((fee) => {

        const total =
            Number(
                fee.totalFee || 0
            );

        const paid =
            Number(
                fee.paidAmount || 0
            );

        const pending =
            Math.max(
                total - paid,
                0
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHtml(
                    fee.studentName || "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    fee.studentEmis || "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    fee.studentClass || "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    fee.feeType || "-"
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
                <span class="statusBadge ${getStatusClass(fee.status)}">
                    ${escapeHtml(
                        fee.status || "Pending"
                    )}
                </span>
            </td>

            <td>

                <div class="actionButtons">

                    <button
                        type="button"
                        class="smallButton editButton"
                        onclick="editFee('${fee.id}')">

                        ✏️ Edit

                    </button>


                    <button
                        type="button"
                        class="smallButton paymentButton"
                        onclick="collectPayment('${fee.id}')">

                        💳 Payment

                    </button>


                    <button
                        type="button"
                        class="smallButton deleteButton"
                        onclick="deleteFee('${fee.id}')">

                        🗑 Delete

                    </button>

                </div>

            </td>

        `;


        tbody.appendChild(row);

    });

}


// ==========================================================
// EDIT FEE
// ==========================================================

window.editFee = function (feeId) {

    const fee =
        feeRecords.find(
            (item) =>
                item.id === feeId
        );


    if (!fee) {

        showMessage(
            "Fee record not found.",
            "error"
        );

        return;

    }


    const student =
        students.find(
            (item) =>
                item.docId ===
                fee.studentDocId
        );


    selectedStudent =
        student || {

            docId:
                fee.studentDocId,

            id:
                fee.studentId,

            name:
                fee.studentName,

            emis:
                fee.studentEmis,

            class:
                fee.studentClass,

            section:
                fee.studentSection

        };


    setValue(
        "studentSearch",
        fee.studentName
    );

    setValue(
        "studentName",
        fee.studentName
    );

    setValue(
        "studentEmis",
        fee.studentEmis
    );

    setValue(
        "studentClass",
        fee.studentClass
    );

    setValue(
        "studentSection",
        fee.studentSection
    );

    setValue(
        "academicYear",
        fee.academicYear
    );

    setValue(
        "feeType",
        fee.feeType
    );

    setValue(
        "totalAmount",
        fee.totalFee
    );

    setValue(
        "dueDate",
        normalizeDate(fee.dueDate)
    );


    editingFeeId =
        feeId;


    const saveButton =
        document.getElementById(
            "saveFee"
        );

    if (saveButton) {

        saveButton.textContent =
            "💾 Update Fee";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    showMessage(
        "Fee loaded for editing.",
        "success"
    );

};


// ==========================================================
// COLLECT PAYMENT
// ==========================================================

window.collectPayment =
    async function (feeId) {

        const fee =
            feeRecords.find(
                (item) =>
                    item.id === feeId
            );


        if (!fee) {

            showMessage(
                "Fee record not found.",
                "error"
            );

            return;

        }


        const total =
            Number(
                fee.totalFee || 0
            );

        const paid =
            Number(
                fee.paidAmount || 0
            );

        const pending =
            Math.max(
                total - paid,
                0
            );


        if (pending <= 0) {

            showMessage(
                "This fee is already fully paid.",
                "error"
            );

            return;

        }


        const amountInput =
            prompt(
                `Student: ${fee.studentName}\n` +
                `Pending Amount: ₹${formatMoney(pending)}\n\n` +
                `Enter payment amount:`
            );


        if (
            amountInput === null
        ) {

            return;

        }


        const amount =
            Number(
                amountInput
            );


        if (
            !amount ||
            amount <= 0
        ) {

            showMessage(
                "Enter a valid payment amount.",
                "error"
            );

            return;

        }


        if (amount > pending) {

            showMessage(
                "Payment cannot be greater than pending amount.",
                "error"
            );

            return;

        }


        const paymentMode =
            prompt(
                "Payment Mode:\n" +
                "Cash / UPI / Bank / Card"
            ) || "Cash";


        const newPaid =
            paid + amount;


        const newPending =
            Math.max(
                total - newPaid,
                0
            );


        let status =
            "Pending";


        if (
            newPaid >= total
        ) {

            status = "Paid";

        } else if (
            newPaid > 0
        ) {

            status = "Partial";

        }


        const receiptNo =
            generateReceiptNo();


        await updateDoc(

            doc(
                db,
                "fees",
                feeId
            ),

            {

                paidAmount:
                    newPaid,

                pendingAmount:
                    newPending,

                status:
                    status,

                paymentMode:
                    paymentMode,

                paymentDate:
                    new Date()
                        .toISOString(),

                receiptNo:
                    receiptNo,

                updatedAt:
                    serverTimestamp()

            }

        );


        // ------------------------------------------
        // PAYMENT HISTORY
        // ------------------------------------------

        await addDoc(

            collection(
                db,
                "fee_payments"
            ),

            {

                feeId:
                    feeId,

                studentId:
                    fee.studentId || "",

                studentDocId:
                    fee.studentDocId || "",

                studentName:
                    fee.studentName || "",

                studentEmis:
                    fee.studentEmis || "",

                amount:
                    amount,

                paymentMode:
                    paymentMode,

                receiptNo:
                    receiptNo,

                paymentDate:
                    serverTimestamp(),

                createdBy:
                    auth.currentUser?.uid || ""

            }

        );


        showMessage(
            `Payment saved successfully. Receipt: ${receiptNo}`,
            "success"
        );


        await loadFees();

    };


// ==========================================================
// DELETE FEE
// ==========================================================

window.deleteFee =
    async function (feeId) {

        const fee =
            feeRecords.find(
                (item) =>
                    item.id === feeId
            );


        if (!fee) {

            showMessage(
                "Fee record not found.",
                "error"
            );

            return;

        }


        const confirmed =
            confirm(
                `Delete fee record for ${fee.studentName}?`
            );


        if (!confirmed) {

            return;

        }


        try {

            await deleteDoc(

                doc(
                    db,
                    "fees",
                    feeId
                )

            );


            showMessage(
                "Fee record deleted successfully.",
                "success"
            );


            await loadFees();


        } catch (error) {

            console.error(
                "Delete Error:",
                error
            );

            showMessage(
                "Unable to delete fee: " +
                error.message,
                "error"
            );

        }

    };


// ==========================================================
// PAYMENT HISTORY
// ==========================================================

async function renderPaymentHistory() {

    const tbody =
        document.getElementById(
            "paymentHistoryBody"
        );


    if (!tbody) return;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "fee_payments"
                )
            );


        const payments = [];


        snapshot.forEach(
            (docSnap) => {

                const data =
                    docSnap.data();


                payments.push({

                    id:
                        docSnap.id,

                    date:
                        data.paymentDate,

                    studentName:
                        data.studentName ||
                        "",

                    emis:
                        data.studentEmis ||
                        "",

                    amount:
                        Number(
                            data.amount || 0
                        ),

                    paymentMode:
                        data.paymentMode ||
                        "",

                    receiptNo:
                        data.receiptNo ||
                        ""

                });

            }
        );


        // Latest first
        payments.sort(
            (a, b) =>
                getTime(b.date) -
                getTime(a.date)
        );


        tbody.innerHTML = "";


        if (
            payments.length === 0
        ) {

            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="emptyMessage">

                        No Payment History

                    </td>
                </tr>
            `;

            return;

        }


        payments.forEach(
            (payment) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${formatDate(
                            payment.date
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            payment.studentName ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            payment.emis ||
                            "-"
                        )}
                    </td>

                    <td>
                        ₹${formatMoney(
                            payment.amount
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            payment.paymentMode ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            payment.receiptNo ||
                            "-"
                        )}
                    </td>

                `;


                tbody.appendChild(row);

            }
        );


    } catch (error) {

        console.error(
            "Payment History Error:",
            error
        );


        tbody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="emptyMessage">

                    No Payment History

                </td>
            </tr>
        `;

    }

}


// ==========================================================
// SUMMARY
// ==========================================================

function updateSummary() {

    let total =
        0;

    let collected =
        0;

    let pending =
        0;

    let paidStudents =
        0;


    feeRecords.forEach(
        (fee) => {

            const feeTotal =
                Number(
                    fee.totalFee || 0
                );

            const feePaid =
                Number(
                    fee.paidAmount || 0
                );

            const feePending =
                Math.max(
                    feeTotal -
                    feePaid,
                    0
                );


            total +=
                feeTotal;

            collected +=
                feePaid;

            pending +=
                feePending;


            if (
                feePaid >=
                feeTotal &&
                feeTotal > 0
            ) {

                paidStudents++;

            }

        }
    );


    setText(
        "totalFee",
        "₹" +
        formatMoney(total)
    );


    setText(
        "collectedFee",
        "₹" +
        formatMoney(collected)
    );


    setText(
        "pendingFee",
        "₹" +
        formatMoney(pending)
    );


    setText(
        "paidStudents",
        paidStudents
    );

}


// ==========================================================
// CLEAR FORM
// ==========================================================

function clearFeeForm() {

    selectedStudent =
        null;

    editingFeeId =
        null;


    setValue(
        "studentSearch",
        ""
    );

    setValue(
        "studentName",
        ""
    );

    setValue(
        "studentEmis",
        ""
    );

    setValue(
        "studentClass",
        ""
    );

    setValue(
        "studentSection",
        ""
    );

    setValue(
        "totalAmount",
        ""
    );

    setValue(
        "dueDate",
        getTodayDate()
    );


    const resultBox =
        document.getElementById(
            "studentResults"
        );

    if (resultBox) {

        resultBox.innerHTML =
            "";

        resultBox.style.display =
            "none";

    }


    const saveButton =
        document.getElementById(
            "saveFee"
        );

    if (saveButton) {

        saveButton.textContent =
            "💾 Save Fee";

    }

}


// ==========================================================
// DEFAULT DUE DATE
// ==========================================================

function setDefaultDueDate() {

    const dueDate =
        document.getElementById(
            "dueDate"
        );


    if (
        dueDate &&
        !dueDate.value
    ) {

        dueDate.value =
            getTodayDate();

    }

}


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


function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value =
            value ?? "";

    }

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


function getTodayDate() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return (
        `${year}-${month}-${day}`
    );

}


function normalizeDate(value) {

    if (!value) return "";

    if (
        typeof value ===
        "string"
    ) {

        return value.substring(
            0,
            10
        );

    }


    if (
        value?.toDate
    ) {

        const date =
            value.toDate();

        return formatInputDate(
            date
        );

    }


    return "";

}


function formatInputDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return (
        `${year}-${month}-${day}`
    );

}


// ==========================================================
// FORMAT MONEY
// ==========================================================

function formatMoney(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}


// ==========================================================
// FORMAT DATE
// ==========================================================

function formatDate(value) {

    if (!value) return "-";


    let date;


    if (
        typeof value ===
        "object" &&
        typeof value.toDate ===
        "function"
    ) {

        date =
            value.toDate();

    } else {

        date =
            new Date(value);

    }


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


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
// GET TIME
// ==========================================================

function getTime(value) {

    if (!value) return 0;


    if (
        typeof value ===
        "object" &&
        typeof value.toDate ===
        "function"
    ) {

        return value
            .toDate()
            .getTime();

    }


    const date =
        new Date(value);


    return isNaN(
        date.getTime()
    )
        ? 0
        : date.getTime();

}


// ==========================================================
// STATUS CLASS
// ==========================================================

function getStatusClass(status) {

    switch (status) {

        case "Paid":
            return "paid";

        case "Partial":
            return "partial";

        case "Pending":
        default:
            return "pending";

    }

}


// ==========================================================
// RECEIPT NUMBER
// ==========================================================

function generateReceiptNo() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const time =
        String(
            now.getTime()
        ).slice(-6);


    return (
        `SC-${year}${month}${day}-${time}`
    );

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
            "feeMessage"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "feeMessage";


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


    if (
        type === "error"
    ) {

        box.style.background =
            "#dc3545";

    } else {

        box.style.background =
            "#198754";

    }


    box.style.color =
        "#ffffff";


    box.style.display =
        "block";


    clearTimeout(
        window.__feeMessageTimer
    );


    window.__feeMessageTimer =
        setTimeout(
            () => {

                box.style.display =
                    "none";

            },
            3500
        );

}


// ==========================================================
// PREVENT CLICK OUTSIDE SEARCH RESULTS
// ==========================================================

document.addEventListener(
    "click",
    (event) => {

        const searchBox =
            document.getElementById(
                "studentSearch"
            );

        const resultBox =
            document.getElementById(
                "studentResults"
            );


        if (
            !searchBox ||
            !resultBox
        ) {

            return;

        }


        if (
            !searchBox.contains(
                event.target
            ) &&
            !resultBox.contains(
                event.target
            )
        ) {

            resultBox.style.display =
                "none";

        }

    }
);


// ==========================================================
// FINISH
// ==========================================================

console.log(
    "Fees Management JS Loaded Successfully"
);
