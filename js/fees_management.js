// ==========================================================
// School Connect TN
// Fees Management V1
// Firebase + Firestore
// ==========================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";


// ==========================================================
// CONFIG
// ==========================================================

const FEES_COLLECTION = "fees";
const STUDENTS_COLLECTION = "students";

let students = [];
let selectedStudent = null;


// ==========================================================
// SESSION CHECK
// ==========================================================

const userRole = localStorage.getItem("userRole");

if (userRole !== "Admin") {

    window.location.href = "login.html";

}


// ==========================================================
// DOM READY
// ==========================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("====================================");
    console.log("School Connect TN");
    console.log("Fees Management V1");
    console.log("====================================");

    setupEvents();

    await loadStudents();

    await loadFeeRecords();

    await updateSummary();

    console.log("Fees Management Ready");

});


// ==========================================================
// SETUP EVENTS
// ==========================================================

function setupEvents() {

    // Student search
    const studentSearch =
        document.getElementById("studentSearch");

    if (studentSearch) {

        studentSearch.addEventListener(
            "input",
            handleStudentSearch
        );

    }


    // Save Fee
    const feeForm =
        document.getElementById("feeForm");

    if (feeForm) {

        feeForm.addEventListener(
            "submit",
            saveFee
        );

    }


    // Reset
    const resetBtn =
        document.getElementById("resetBtn");

    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            resetForm
        );

    }


    // Search fee records
    const feeRecordSearch =
        document.getElementById("feeRecordSearch");

    if (feeRecordSearch) {

        feeRecordSearch.addEventListener(
            "input",
            filterFeeRecords
        );

    }


    // Fee status filter
    const feeStatusFilter =
        document.getElementById("feeStatusFilter");

    if (feeStatusFilter) {

        feeStatusFilter.addEventListener(
            "change",
            filterFeeRecords
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
                    STUDENTS_COLLECTION
                )
            );

        students = [];

        snapshot.forEach(doc => {

            students.push({

                id: doc.id,

                ...doc.data()

            });

        });

        console.log(
            "Students Loaded :",
            students.length
        );

    } catch (error) {

        console.error(
            "Student Loading Error:",
            error
        );

    }

}


// ==========================================================
// STUDENT SEARCH
// ==========================================================

function handleStudentSearch(event) {

    const keyword =
        event.target.value
            .trim()
            .toLowerCase();

    const resultsBox =
        document.getElementById(
            "studentResults"
        );

    if (!resultsBox) return;


    selectedStudent = null;

    clearStudentFields();


    if (!keyword) {

        resultsBox.style.display = "none";

        resultsBox.innerHTML = "";

        return;

    }


    const results =
        students.filter(student => {

            const name =
                String(
                    student.name ||
                    student.studentName ||
                    ""
                ).toLowerCase();

            const emis =
                String(
                    student.emis ||
                    student.emisNumber ||
                    student.EMIS ||
                    ""
                ).toLowerCase();

            const rollNo =
                String(
                    student.rollNo ||
                    student.rollNumber ||
                    ""
                ).toLowerCase();

            return (
                name.includes(keyword) ||
                emis.includes(keyword) ||
                rollNo.includes(keyword)
            );

        }).slice(0, 10);


    if (results.length === 0) {

        resultsBox.innerHTML = `
            <div class="studentResultItem">
                <div class="studentResultName">
                    No student found
                </div>

                <div class="studentResultDetails">
                    Try EMIS number or student name
                </div>
            </div>
        `;

        resultsBox.style.display = "block";

        return;

    }


    resultsBox.innerHTML = "";


    results.forEach(student => {

        const item =
            document.createElement("div");

        item.className =
            "studentResultItem";


        const name =
            student.name ||
            student.studentName ||
            "Unknown Student";


        const emis =
            student.emis ||
            student.emisNumber ||
            student.EMIS ||
            "-";


        const studentClass =
            student.class ||
            student.className ||
            student.standard ||
            "-";


        item.innerHTML = `

            <div class="studentResultName">
                ${escapeHtml(name)}
            </div>

            <div class="studentResultDetails">
                EMIS: ${escapeHtml(String(emis))}
                &nbsp; | &nbsp;
                Class: ${escapeHtml(String(studentClass))}
            </div>

        `;


        item.addEventListener(
            "click",
            () => selectStudent(student)
        );


        resultsBox.appendChild(item);

    });


    resultsBox.style.display = "block";

}


// ==========================================================
// SELECT STUDENT
// ==========================================================

function selectStudent(student) {

    selectedStudent = student;


    const name =
        student.name ||
        student.studentName ||
        "";


    const emis =
        student.emis ||
        student.emisNumber ||
        student.EMIS ||
        "";


    const studentClass =
        student.class ||
        student.className ||
        student.standard ||
        "";


    setValue(
        "studentSearch",
        name
    );


    setValue(
        "studentId",
        emis
    );


    setValue(
        "studentName",
        name
    );


    setValue(
        "studentClass",
        studentClass
    );


    const resultsBox =
        document.getElementById(
            "studentResults"
        );


    if (resultsBox) {

        resultsBox.style.display =
            "none";

        resultsBox.innerHTML =
            "";

    }


    console.log(
        "Selected Student:",
        student
    );

}


// ==========================================================
// CLEAR STUDENT FIELDS
// ==========================================================

function clearStudentFields() {

    setValue(
        "studentId",
        ""
    );

    setValue(
        "studentName",
        ""
    );

    setValue(
        "studentClass",
        ""
    );

}


// ==========================================================
// SAVE FEE
// ==========================================================

async function saveFee(event) {

    event.preventDefault();


    try {

        if (!selectedStudent) {

            showMessage(
                "Please select a student.",
                "error"
            );

            return;

        }


        const feeType =
            getValue("feeType");


        const academicYear =
            getValue("academicYear");


        const totalFee =
            numberValue(
                getValue("totalFee")
            );


        const paidAmount =
            numberValue(
                getValue("paidAmount")
            );


        const paymentDate =
            getValue("paymentDate");


        const paymentMode =
            getValue("paymentMode");


        const remarks =
            getValue("remarks");


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (!feeType) {

            showMessage(
                "Please select fee type.",
                "error"
            );

            return;

        }


        if (!academicYear) {

            showMessage(
                "Please enter academic year.",
                "error"
            );

            return;

        }


        if (totalFee <= 0) {

            showMessage(
                "Please enter valid total fee.",
                "error"
            );

            return;

        }


        if (paidAmount < 0) {

            showMessage(
                "Paid amount cannot be negative.",
                "error"
            );

            return;

        }


        if (paidAmount > totalFee) {

            showMessage(
                "Paid amount cannot be greater than total fee.",
                "error"
            );

            return;

        }


        // ------------------------------------------
        // CALCULATION
        // ------------------------------------------

        const balance =
            totalFee - paidAmount;


        let status = "Pending";


        if (paidAmount >= totalFee) {

            status = "Paid";

        } else if (paidAmount > 0) {

            status = "Partial";

        }


        // ------------------------------------------
        // STUDENT DATA
        // ------------------------------------------

        const studentName =
            selectedStudent.name ||
            selectedStudent.studentName ||
            "";


        const emis =
            selectedStudent.emis ||
            selectedStudent.emisNumber ||
            selectedStudent.EMIS ||
            "";


        const studentClass =
            selectedStudent.class ||
            selectedStudent.className ||
            selectedStudent.standard ||
            "";


        // ------------------------------------------
        // FIRESTORE DATA
        // ------------------------------------------

        const feeData = {

            studentDocId:
                selectedStudent.id,

            studentId:
                String(emis),

            studentName:
                String(studentName),

            studentClass:
                String(studentClass),

            feeType:
                String(feeType),

            academicYear:
                String(academicYear),

            totalFee:
                totalFee,

            paidAmount:
                paidAmount,

            balance:
                balance,

            status:
                status,

            paymentDate:
                paymentDate || "",

            paymentMode:
                paymentMode || "",

            remarks:
                remarks || "",

            createdAt:
                serverTimestamp(),

            createdBy:
                "Admin"

        };


        // ------------------------------------------
        // SAVE
        // ------------------------------------------

        const docRef =
            await addDoc(
                collection(
                    db,
                    FEES_COLLECTION
                ),
                feeData
            );


        console.log(
            "Fee Saved:",
            docRef.id
        );


        showMessage(
            "Fee payment saved successfully.",
            "success"
        );


        resetForm();


        await loadFeeRecords();

        await updateSummary();


    } catch (error) {

        console.error(
            "Save Fee Error:",
            error
        );


        showMessage(
            error.message ||
            "Failed to save fee.",
            "error"
        );

    }

}


// ==========================================================
// LOAD FEE RECORDS
// ==========================================================

let allFeeRecords = [];


async function loadFeeRecords() {

    try {

        const tableBody =
            document.getElementById(
                "feeTableBody"
            );


        const snapshot =
            await getDocs(
                collection(
                    db,
                    FEES_COLLECTION
                )
            );


        allFeeRecords = [];


        snapshot.forEach(doc => {

            allFeeRecords.push({

                id: doc.id,

                ...doc.data()

            });

        });


        // Latest first
        allFeeRecords.sort(
            (a, b) => {

                const dateA =
                    a.createdAt?.seconds ||
                    0;

                const dateB =
                    b.createdAt?.seconds ||
                    0;

                return dateB - dateA;

            }
        );


        renderFeeRecords(
            allFeeRecords
        );


        console.log(
            "Fee Records :",
            allFeeRecords.length
        );


    } catch (error) {

        console.error(
            "Fee Records Error:",
            error
        );

    }

}


// ==========================================================
// RENDER FEE RECORDS
// ==========================================================

function renderFeeRecords(records) {

    const tableBody =
        document.getElementById(
            "feeTableBody"
        );


    if (!tableBody) return;


    tableBody.innerHTML = "";


    if (!records.length) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    class="emptyMessage">

                    No fee records found.

                </td>

            </tr>

        `;

        return;

    }


    records.forEach(record => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHtml(
                    record.studentId || "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    record.studentName || "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    record.studentClass || "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    record.feeType || "-"
                )}
            </td>

            <td>
                ₹${formatAmount(
                    record.totalFee
                )}
            </td>

            <td>
                ₹${formatAmount(
                    record.paidAmount
                )}
            </td>

            <td>
                ₹${formatAmount(
                    record.balance
                )}
            </td>

            <td>
                ${getStatusBadge(
                    record.status
                )}
            </td>

            <td>
                ${escapeHtml(
                    record.paymentDate || "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    record.paymentMode || "-"
                )}
            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ==========================================================
// STATUS BADGE
// ==========================================================

function getStatusBadge(status) {

    const safeStatus =
        status || "Pending";


    let className =
        "statusPending";


    if (safeStatus === "Paid") {

        className =
            "statusPaid";

    } else if (
        safeStatus === "Partial"
    ) {

        className =
            "statusPartial";

    }


    return `

        <span class="statusBadge ${className}">

            ${escapeHtml(safeStatus)}

        </span>

    `;

}


// ==========================================================
// FILTER FEE RECORDS
// ==========================================================

function filterFeeRecords() {

    const searchInput =
        document.getElementById(
            "feeRecordSearch"
        );


    const statusFilter =
        document.getElementById(
            "feeStatusFilter"
        );


    const keyword =
        (
            searchInput?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const status =
        statusFilter?.value ||
        "All";


    const filtered =
        allFeeRecords.filter(
            record => {

                const studentName =
                    String(
                        record.studentName ||
                        ""
                    ).toLowerCase();


                const studentId =
                    String(
                        record.studentId ||
                        ""
                    ).toLowerCase();


                const feeType =
                    String(
                        record.feeType ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    !keyword ||
                    studentName.includes(
                        keyword
                    ) ||
                    studentId.includes(
                        keyword
                    ) ||
                    feeType.includes(
                        keyword
                    );


                const matchesStatus =
                    status === "All" ||
                    record.status === status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    renderFeeRecords(
        filtered
    );

}


// ==========================================================
// SUMMARY
// ==========================================================

async function updateSummary() {

    try {

        let totalCollected = 0;

        let totalPending = 0;

        let totalRecords = 0;

        let paidRecords = 0;


        allFeeRecords.forEach(
            record => {

                totalCollected +=
                    numberValue(
                        record.paidAmount
                    );


                totalPending +=
                    numberValue(
                        record.balance
                    );


                totalRecords++;


                if (
                    record.status ===
                    "Paid"
                ) {

                    paidRecords++;

                }

            }
        );


        setText(
            "totalCollected",
            "₹" +
            formatAmount(
                totalCollected
            )
        );


        setText(
            "totalPending",
            "₹" +
            formatAmount(
                totalPending
            )
        );


        setText(
            "totalFeeRecords",
            totalRecords
        );


        setText(
            "paidRecords",
            paidRecords
        );


    } catch (error) {

        console.error(
            "Summary Error:",
            error
        );

    }

}


// ==========================================================
// RESET FORM
// ==========================================================

function resetForm() {

    const form =
        document.getElementById(
            "feeForm"
        );


    if (form) {

        form.reset();

    }


    selectedStudent = null;


    clearStudentFields();


    const resultsBox =
        document.getElementById(
            "studentResults"
        );


    if (resultsBox) {

        resultsBox.innerHTML =
            "";

        resultsBox.style.display =
            "none";

    }

}


// ==========================================================
// LOGOUT
// ==========================================================

window.logoutAdmin =
    async function () {

        try {

            await signOut(auth);

            localStorage.clear();

            sessionStorage.clear();

            window.location.href =
                "login.html";


        } catch (error) {

            console.error(
                "Logout Error:",
                error
            );

            alert(
                error.message ||
                "Logout failed."
            );

        }

    };


// ==========================================================
// DASHBOARD
// ==========================================================

window.goToDashboard =
    function () {

        window.location.href =
            "admin_dashboard.html";

    };


// ==========================================================
// HELPERS
// ==========================================================

function getValue(id) {

    const element =
        document.getElementById(id);

    if (!element) return "";

    return element.value.trim();

}


function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.value =
        value ?? "";

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.textContent =
        value ?? "0";

}


function numberValue(value) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;

}


function formatAmount(amount) {

    return numberValue(amount)
        .toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );

}


// ==========================================================
// MESSAGE
// ==========================================================

function showMessage(
    message,
    type = "success"
) {

    const element =
        document.getElementById(
            "message"
        );


    if (!element) {

        alert(message);

        return;

    }


    element.textContent =
        message;


    element.style.display =
        "block";


    if (type === "error") {

        element.style.background =
            "#ffebee";

        element.style.color =
            "#c62828";

    } else {

        element.style.background =
            "#e8f5e9";

        element.style.color =
            "#2e7d32";

    }


    setTimeout(() => {

        element.style.display =
            "none";

    }, 4000);

}


// ==========================================================
// HTML ESCAPE
// ==========================================================

function escapeHtml(value) {

    return String(value ?? "")
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
// AUTO BALANCE CALCULATION
// ==========================================================

const totalFeeInput =
    document.getElementById(
        "totalFee"
    );

const paidAmountInput =
    document.getElementById(
        "paidAmount"
    );

const balanceInput =
    document.getElementById(
        "balance"
    );


function calculateBalance() {

    const total =
        numberValue(
            totalFeeInput?.value
        );


    const paid =
        numberValue(
            paidAmountInput?.value
        );


    const balance =
        Math.max(
            total - paid,
            0
        );


    if (balanceInput) {

        balanceInput.value =
            balance;

    }

}


if (totalFeeInput) {

    totalFeeInput.addEventListener(
        "input",
        calculateBalance
    );

}


if (paidAmountInput) {

    paidAmountInput.addEventListener(
        "input",
        calculateBalance
    );

}
