// ==========================================================
// School Connect TN
// Parent Fees
// Version V1
// ==========================================================

import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


// ==========================================================
// ELEMENTS
// ==========================================================

const studentNameEl =
    document.getElementById("studentName");

const studentEmisEl =
    document.getElementById("studentEmis");

const studentClassEl =
    document.getElementById("studentClass");

const studentSectionEl =
    document.getElementById("studentSection");

const studentWelcomeEl =
    document.getElementById("studentWelcome");

const totalFeeEl =
    document.getElementById("totalFee");

const paidAmountEl =
    document.getElementById("paidAmount");

const pendingAmountEl =
    document.getElementById("pendingAmount");

const feeStatusEl =
    document.getElementById("feeStatus");

const feeTableBody =
    document.getElementById("feeTableBody");

const paymentHistoryBody =
    document.getElementById("paymentHistoryBody");

const noFeeSection =
    document.getElementById("noFeeSection");


// ==========================================================
// SESSION
// ==========================================================

let parentStudentId = "";

let parentStudentEmis = "";

let studentData = null;

let feeRecords = [];


// ==========================================================
// GET PARENT SESSION
// ==========================================================

function getParentSession() {

    const possibleIds = [

        localStorage.getItem("studentId"),

        localStorage.getItem("studentDocId"),

        localStorage.getItem("emis"),

        localStorage.getItem("studentEmis"),

        sessionStorage.getItem("studentId"),

        sessionStorage.getItem("studentDocId"),

        sessionStorage.getItem("emis"),

        sessionStorage.getItem("studentEmis")

    ];


    const possibleEmis = [

        localStorage.getItem("emis"),

        localStorage.getItem("studentEmis"),

        localStorage.getItem("studentId"),

        sessionStorage.getItem("emis"),

        sessionStorage.getItem("studentEmis"),

        sessionStorage.getItem("studentId")

    ];


    parentStudentId =
        possibleIds.find(
            value =>
                value &&
                value.trim() !== ""
        ) || "";


    parentStudentEmis =
        possibleEmis.find(
            value =>
                value &&
                value.trim() !== ""
        ) || "";


    console.log(
        "Parent Student ID:",
        parentStudentId
    );

    console.log(
        "Parent EMIS:",
        parentStudentEmis
    );


    return (
        parentStudentId ||
        parentStudentEmis
    );

}


// ==========================================================
// LOAD STUDENT PROFILE
// ==========================================================

async function loadStudentProfile() {

    try {

        const snap =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        let foundStudent =
            null;


        snap.forEach(
            docSnap => {

                const student =
                    docSnap.data();


                const docId =
                    docSnap.id;


                const studentId =
                    String(
                        student.studentId ||
                        student.emis ||
                        student.emisNumber ||
                        student.EMIS ||
                        ""
                    );


                const storedId =
                    String(
                        parentStudentId ||
                        ""
                    );


                const storedEmis =
                    String(
                        parentStudentEmis ||
                        ""
                    );


                if (
                    docId === storedId ||
                    studentId === storedId ||
                    studentId === storedEmis
                ) {

                    foundStudent = {

                        docId,

                        ...student

                    };

                }

            }
        );


        if (!foundStudent) {

            console.warn(
                "Student profile not found."
            );

            return false;

        }


        studentData =
            foundStudent;


        displayStudentProfile();


        return true;

    }

    catch (error) {

        console.error(
            "Student Profile Error:",
            error
        );

        return false;

    }

}


// ==========================================================
// DISPLAY STUDENT PROFILE
// ==========================================================

function displayStudentProfile() {

    if (!studentData) return;


    const name =
        studentData.studentName ||
        studentData.name ||
        "Student";


    const emis =
        studentData.emis ||
        studentData.emisNumber ||
        studentData.EMIS ||
        studentData.studentId ||
        "-";


    const className =
        studentData.className ||
        studentData.class ||
        studentData.standard ||
        "-";


    const section =
        studentData.section ||
        "-";


    studentNameEl.textContent =
        name;


    studentEmisEl.textContent =
        emis;


    studentClassEl.textContent =
        className;


    studentSectionEl.textContent =
        section;


    studentWelcomeEl.textContent =
        `Fee details for ${name}`;

}


// ==========================================================
// LOAD FEES
// ==========================================================

async function loadFees() {

    try {

        feeTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="emptyMessage">

                    Loading fee details...

                </td>

            </tr>

        `;


        const studentDocId =
            studentData?.docId ||
            "";


        const emis =
            String(
                studentData?.emis ||
                studentData?.emisNumber ||
                studentData?.EMIS ||
                studentData?.studentId ||
                parentStudentEmis ||
                ""
            );


        let records = [];


        // ==================================================
        // QUERY BY STUDENT DOCUMENT ID
        // ==================================================

        if (studentDocId) {

            try {

                const q =
                    query(
                        collection(
                            db,
                            "fees"
                        ),
                        where(
                            "studentDocId",
                            "==",
                            studentDocId
                        )
                    );


                const snap =
                    await getDocs(q);


                snap.forEach(
                    docSnap => {

                        records.push({

                            id:
                                docSnap.id,

                            ...docSnap.data()

                        });

                    }
                );

            }

            catch (error) {

                console.warn(
                    "StudentDocId query failed:",
                    error
                );

            }

        }


        // ==================================================
        // IF NOTHING FOUND, QUERY EMIS
        // ==================================================

        if (
            records.length === 0 &&
            emis
        ) {

            try {

                const q =
                    query(
                        collection(
                            db,
                            "fees"
                        ),
                        where(
                            "studentId",
                            "==",
                            String(emis)
                        )
                    );


                const snap =
                    await getDocs(q);


                snap.forEach(
                    docSnap => {

                        const data =
                            docSnap.data();


                        // Avoid duplicates

                        if (
                            !records.some(
                                item =>
                                    item.id ===
                                    docSnap.id
                            )
                        ) {

                            records.push({

                                id:
                                    docSnap.id,

                                ...data

                            });

                        }

                    }
                );

            }

            catch (error) {

                console.warn(
                    "EMIS query failed:",
                    error
                );

            }

        }


        // ==================================================
        // SORT
        // ==================================================

        records.sort(
            (a, b) => {

                const dateA =
                    String(
                        a.paymentDate ||
                        ""
                    );


                const dateB =
                    String(
                        b.paymentDate ||
                        ""
                    );


                return dateB.localeCompare(
                    dateA
                );

            }
        );


        feeRecords =
            records;


        renderFees();

        renderPaymentHistory();

        updateSummary();


    }

    catch (error) {

        console.error(
            "Parent Fees Error:",
            error
        );


        feeTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="emptyMessage">

                    Unable to load fee details.

                </td>

            </tr>

        `;

    }

}


// ==========================================================
// RENDER FEE TABLE
// ==========================================================

function renderFees() {

    if (!feeRecords.length) {

        feeTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="emptyMessage">

                    No fee records available.

                </td>

            </tr>

        `;

        if (noFeeSection) {
            noFeeSection.style.display = "block";
        }

        return;
    }

    if (noFeeSection) {
        noFeeSection.style.display = "none";
    }

    feeTableBody.innerHTML = "";

    feeRecords.forEach(fee => {

        const total =
            Number(fee.totalFee) || 0;

        const paid =
            Number(fee.paidAmount) || 0;

        // IMPORTANT:
        // Always calculate balance
        // instead of trusting Firebase balance field.

        const balance =
            Math.max(total - paid, 0);

        let status = "Pending";

        if (balance <= 0 && total > 0) {

            status = "Paid";

        }
        else if (paid > 0) {

            status = "Partial";

        }

        const row =
            document.createElement("tr");

        // Prefer dueDate for Fee Details.
        // Do NOT show raw payment timestamp here.

        const displayDate =
            fee.dueDate
                ? formatDate(fee.dueDate)
                : (
                    fee.paymentDate
                        ? formatDate(fee.paymentDate)
                        : "-"
                );

        row.innerHTML = `

            <td>
                ${escapeHtml(
                    fee.academicYear || "-"
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
                ₹${formatMoney(balance)}
            </td>

            <td>
                ${getStatusBadge(status)}
            </td>

            <td>
                ${escapeHtml(displayDate)}
            </td>

        `;

        feeTableBody.appendChild(row);

    });

}


// ==========================================================
// PAYMENT HISTORY
// ==========================================================

function renderPaymentHistory() {

    if (!feeRecords.length) {

        paymentHistoryBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="emptyMessage">

                    No payment history.

                </td>

            </tr>

        `;

        return;
    }

    paymentHistoryBody.innerHTML = "";

    feeRecords.forEach(fee => {

        const paid =
            Number(fee.paidAmount) || 0;

        if (paid <= 0) {
            return;
        }

        const row =
            document.createElement("tr");

        // Payment History should show
        // actual payment date.

        const paymentDate =
            fee.paymentDate
                ? formatDate(fee.paymentDate)
                : "-";

        const total =
            Number(fee.totalFee) || 0;

        const balance =
            Math.max(
                total - paid,
                0
            );

        let status = "Pending";

        if (balance <= 0 && total > 0) {

            status = "Paid";

        }
        else if (paid > 0) {

            status = "Partial";

        }

        row.innerHTML = `

            <td>
                ${escapeHtml(
                    paymentDate
                )}
            </td>

            <td>
                ${escapeHtml(
                    fee.feeType || "-"
                )}
            </td>

            <td>
                ₹${formatMoney(paid)}
            </td>

            <td>
                ${escapeHtml(
                    fee.paymentMode || "-"
                )}
            </td>

            <td>
                ${getStatusBadge(status)}
            </td>

        `;

        paymentHistoryBody.appendChild(row);

    });

    if (
        paymentHistoryBody.children.length === 0
    ) {

        paymentHistoryBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="emptyMessage">

                    No payment history.

                </td>

            </tr>

        `;

    }

}

// ==========================================================
// SUMMARY
// ==========================================================

function updateSummary() {

    let total = 0;

    let paid = 0;

    let balance = 0;


    feeRecords.forEach(fee => {

        const feeTotal =
            Number(fee.totalFee) || 0;

        const feePaid =
            Number(fee.paidAmount) || 0;

        total += feeTotal;

        paid += feePaid;

    });


    // ALWAYS calculate balance
    balance = Math.max(
        total - paid,
        0
    );


    totalFeeEl.textContent =
        `₹${formatMoney(total)}`;


    paidAmountEl.textContent =
        `₹${formatMoney(paid)}`;


    pendingAmountEl.textContent =
        `₹${formatMoney(balance)}`;


    let status = "No Fees";


    if (feeRecords.length > 0) {

        if (balance <= 0) {

            status = "Paid";

        }
        else if (paid > 0) {

            status = "Partial";

        }
        else {

            status = "Pending";

        }

    }


    feeStatusEl.textContent =
        status;

}

// ==========================================================
// STATUS BADGE
// ==========================================================

function getStatusBadge(status) {

    const value =
        status || "Pending";


    let className =
        "statusPending";


    if (value === "Paid") {

        className =
            "statusPaid";

    }

    else if (
        value === "Partial"
    ) {

        className =
            "statusPartial";

    }


    return `

        <span
            class="statusBadge ${className}">

            ${escapeHtml(value)}

        </span>

    `;

}
// ==========================================================
// DATE FORMAT
// ==========================================================

function formatDate(value) {

    if (!value) {
        return "-";
    }

    try {

        let date;

        // Firebase Timestamp
        if (value && typeof value.toDate === "function") {
            date = value.toDate();
        }

        // JS Date
        else if (value instanceof Date) {
            date = value;
        }

        // String / ISO date
        else {
            date = new Date(value);
        }

        if (isNaN(date.getTime())) {
            return "-";
        }

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const year =
            date.getFullYear();

        return `${day}-${month}-${year}`;

    }
    catch (error) {

        console.warn(
            "Date format error:",
            error
        );

        return "-";
    }
}

// ==========================================================
// MONEY FORMAT
// ==========================================================

function formatMoney(value) {

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

function escapeHtml(value) {

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
// INITIALIZE
// ==========================================================

async function initialize() {

    console.log(
        "===================================="
    );

    console.log(
        "School Connect TN"
    );

    console.log(
        "Parent Fees V1"
    );

    console.log(
        "===================================="
    );


    const session =
        getParentSession();


    if (!session) {

        alert(
            "Parent session expired. Please login again."
        );

        window.location.href =
            "index.html";

        return;

    }


    const profileLoaded =
        await loadStudentProfile();


    if (!profileLoaded) {

        alert(
            "Student profile not found."
        );

        return;

    }


    await loadFees();


    console.log(
        "Parent Fees Loaded"
    );

}


// ==========================================================
// AUTO REFRESH
// ==========================================================

setInterval(
    async () => {

        if (studentData) {

            await loadFees();

        }

    },
    60000
);


// ==========================================================
// START
// ==========================================================

initialize();
