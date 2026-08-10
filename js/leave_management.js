// ======================================
// School Connect TN
// Leave Management V5
// Teacher ID Compatible
// ======================================

import { auth, db } from "../firebase.js";

import {
    collection,
    getDocs,
    updateDoc,
    doc,
    query,
    where,
    serverTimestamp,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


// ======================================
// Elements
// ======================================

const leaveList =
    document.getElementById("leaveList");

const pendingCount =
    document.getElementById("pendingCount");

const approvedCount =
    document.getElementById("approvedCount");

const rejectedCount =
    document.getElementById("rejectedCount");

const totalCount =
    document.getElementById("totalCount");

const searchStudent =
    document.getElementById("searchStudent");

const statusFilter =
    document.getElementById("statusFilter");

const classFilter =
    document.getElementById("classFilter");

const sectionFilter =
    document.getElementById("sectionFilter");

const selectAll =
    document.getElementById("selectAll");

const approveSelected =
    document.getElementById("approveSelected");

const rejectSelected =
    document.getElementById("rejectSelected");


let leaveRequests = [];

let currentTeacher = null;


// ======================================
// Teacher Session
// ======================================

const sessionTeacherId =
    localStorage.getItem("teacherId") ||
    sessionStorage.getItem("teacherId");

const sessionTeacherDocId =
    localStorage.getItem("teacherDocId") ||
    sessionStorage.getItem("teacherDocId");


// ======================================
// Load Teacher Profile
// ======================================

async function loadTeacher() {

    try {

        let teacher = null;


        console.log(
            "Session Teacher ID :",
            sessionTeacherId
        );

        console.log(
            "Session Teacher Doc ID :",
            sessionTeacherDocId
        );


        // ==================================
        // METHOD 1
        // Firebase Document ID
        // ==================================

        if (sessionTeacherDocId) {

            try {

                const teacherRef =
                    doc(
                        db,
                        "teachers",
                        sessionTeacherDocId
                    );

                const teacherSnap =
                    await getDoc(teacherRef);


                if (teacherSnap.exists()) {

                    teacher = {
                        docId: teacherSnap.id,
                        ...teacherSnap.data()
                    };

                }

            }
            catch (error) {

                console.log(
                    "Document ID lookup failed:",
                    error
                );

            }

        }


        // ==================================
        // METHOD 2
        // teacherId field
        // ==================================

        if (!teacher && sessionTeacherId) {

            try {

                const teacherQuery =
                    query(
                        collection(db, "teachers"),
                        where(
                            "teacherId",
                            "==",
                            sessionTeacherId
                        )
                    );

                const teacherSnap =
                    await getDocs(teacherQuery);


                if (!teacherSnap.empty) {

                    const teacherDoc =
                        teacherSnap.docs[0];

                    teacher = {
                        docId: teacherDoc.id,
                        ...teacherDoc.data()
                    };

                }

            }
            catch (error) {

                console.log(
                    "teacherId lookup failed:",
                    error
                );

            }

        }


        // ==================================
        // METHOD 3
        // id field
        // ==================================

        if (!teacher && sessionTeacherId) {

            try {

                const teacherQuery =
                    query(
                        collection(db, "teachers"),
                        where(
                            "id",
                            "==",
                            sessionTeacherId
                        )
                    );

                const teacherSnap =
                    await getDocs(teacherQuery);


                if (!teacherSnap.empty) {

                    const teacherDoc =
                        teacherSnap.docs[0];

                    teacher = {
                        docId: teacherDoc.id,
                        ...teacherDoc.data()
                    };

                }

            }
            catch (error) {

                console.log(
                    "id lookup failed:",
                    error
                );

            }

        }


        // ==================================
        // METHOD 4
        // currentUser session fallback
        // ==================================

        if (!teacher) {

            try {

                const currentUser =
                    sessionStorage.getItem(
                        "currentUser"
                    );


                if (currentUser) {

                    const user =
                        JSON.parse(currentUser);


                    if (
                        user.role === "Teacher" &&
                        user.teacherId
                    ) {

                        const teacherQuery =
                            query(
                                collection(db, "teachers"),
                                where(
                                    "teacherId",
                                    "==",
                                    user.teacherId
                                )
                            );


                        const teacherSnap =
                            await getDocs(
                                teacherQuery
                            );


                        if (!teacherSnap.empty) {

                            const teacherDoc =
                                teacherSnap.docs[0];

                            teacher = {
                                docId:
                                    teacherDoc.id,
                                ...teacherDoc.data()
                            };

                        }

                    }

                }

            }
            catch (error) {

                console.log(
                    "Current user fallback failed:",
                    error
                );

            }

        }


        // ==================================
        // No Teacher Found
        // ==================================

        if (!teacher) {

            console.error(
                "Teacher profile could not be found."
            );

            alert(
                "Teacher Profile Not Found"
            );

            location.href = "index.html";

            return false;

        }


        // ==================================
        // Save resolved teacher information
        // ==================================

        currentTeacher = teacher;


        if (currentTeacher.docId) {

            localStorage.setItem(
                "teacherDocId",
                currentTeacher.docId
            );

        }


        if (
            currentTeacher.teacherId &&
            !sessionTeacherId
        ) {

            localStorage.setItem(
                "teacherId",
                currentTeacher.teacherId
            );

        }


        console.log(
            "Teacher Profile Loaded:",
            currentTeacher
        );


        return true;

    }
    catch (error) {

        console.error(
            "Teacher Load Error:",
            error
        );

        alert(
            "Unable to load Teacher Profile"
        );

        return false;

    }

}


// ======================================
// Load Leave Requests
// ======================================

async function loadLeaveRequests() {

    try {

        const loaded =
            await loadTeacher();


        if (!loaded) {

            return;

        }


        leaveRequests = [];


        // ==================================
        // Subject Teacher
        // ==================================

        if (
            currentTeacher.teacherType ===
            "Subject Teacher"
        ) {

            leaveList.innerHTML = `
                <div style="
                    padding:20px;
                    text-align:center;
                    color:#666;
                ">
                    👨‍🏫 Subject Teachers do not
                    have Leave Approval permission.
                </div>
            `;

            pendingCount.textContent = "0";

            approvedCount.textContent = "-";

            rejectedCount.textContent = "-";

            totalCount.textContent = "0";

            return;

        }


        // ==================================
        // Get Class
        // ==================================

        const teacherClass =
            currentTeacher.className ||
            currentTeacher.class ||
            currentTeacher.teacherClass ||
            "";


        const teacherSection =
            currentTeacher.section ||
            currentTeacher.teacherSection ||
            "";


        console.log(
            "Teacher Class :",
            teacherClass
        );

        console.log(
            "Teacher Section :",
            teacherSection
        );


        // ==================================
        // Validate Class Teacher Data
        // ==================================

        if (!teacherClass || !teacherSection) {

            leaveList.innerHTML = `
                <div style="
                    padding:20px;
                    text-align:center;
                    color:#d32f2f;
                ">
                    ⚠️ Class and Section are not
                    assigned to this teacher.
                </div>
            `;

            pendingCount.textContent = "0";

            approvedCount.textContent = "0";

            rejectedCount.textContent = "0";

            totalCount.textContent = "0";

            return;

        }


        // ==================================
        // Pending Leave Query
        // ==================================

        const leaveQuery =
            query(
                collection(
                    db,
                    "leave_requests"
                ),

                where(
                    "class",
                    "==",
                    teacherClass
                ),

                where(
                    "section",
                    "==",
                    teacherSection
                ),

                where(
                    "status",
                    "==",
                    "Pending"
                )
            );


        const snap =
            await getDocs(leaveQuery);


        console.log(
            "Pending Leave Documents :",
            snap.size
        );


        snap.forEach(
            (docSnap) => {

                leaveRequests.push({

                    id: docSnap.id,

                    ...docSnap.data()

                });

            }
        );


        renderLeaveList();

    }
    catch (error) {

        console.error(
            "Leave Request Load Error:",
            error
        );

        leaveList.innerHTML = `
            <div style="
                padding:20px;
                text-align:center;
                color:#d32f2f;
            ">
                ❌ Unable to load Leave Requests.
            </div>
        `;

    }

}


// ======================================
// Render Leave List
// ======================================

function renderLeaveList() {

    const keyword =
        searchStudent
            ? searchStudent.value
                .trim()
                .toLowerCase()
            : "";


    const selectedClass =
        classFilter
            ? classFilter.value
            : "";


    const selectedSection =
        sectionFilter
            ? sectionFilter.value
            : "";


    leaveList.innerHTML = "";


    let visibleCount = 0;


    leaveRequests.forEach(
        (leave) => {

            // ==============================
            // Search
            // ==============================

            if (keyword) {

                const student =
                    (
                        leave.studentName ||
                        ""
                    )
                    .toLowerCase();


                const emis =
                    String(
                        leave.emis || ""
                    )
                    .toLowerCase();


                if (
                    !student.includes(keyword) &&
                    !emis.includes(keyword)
                ) {

                    return;

                }

            }


            // ==============================
            // Class Filter
            // ==============================

            if (
                selectedClass &&
                leave.class !== selectedClass
            ) {

                return;

            }


            // ==============================
            // Section Filter
            // ==============================

            if (
                selectedSection &&
                leave.section !== selectedSection
            ) {

                return;

            }


            visibleCount++;


            // ==============================
            // Leave Card
            // ==============================

            leaveList.innerHTML += `

                <div class="leaveCard">

                    <div class="leaveHeader">

                        <h3>
                            👨‍🎓
                            ${leave.studentName || "-"}
                        </h3>

                        <span>
                            ${leave.status || "Pending"}
                        </span>

                    </div>


                    <p>
                        <b>EMIS:</b>
                        ${leave.emis || "-"}
                    </p>


                    <p>
                        <b>Class:</b>
                        ${leave.class || "-"}
                        -
                        ${leave.section || "-"}
                    </p>


                    <p>
                        <b>Leave Type:</b>
                        ${leave.leaveType || "-"}
                    </p>


                    <p>
                        <b>From:</b>
                        ${leave.fromDate || "-"}
                    </p>


                    <p>
                        <b>To:</b>
                        ${leave.toDate || "-"}
                    </p>


                    <p>
                        <b>Reason:</b>
                        ${leave.reason || "-"}
                    </p>


                    <textarea
                        id="remark_${leave.id}"
                        placeholder="Teacher Remark"
                        class="teacherRemark"
                    ></textarea>


                    <div class="leaveActions">

                        <button
                            class="approveBtn"
                            onclick="approveLeave('${leave.id}')"
                        >
                            ✅ Approve
                        </button>


                        <button
                            class="rejectBtn"
                            onclick="rejectLeave('${leave.id}')"
                        >
                            ❌ Reject
                        </button>

                    </div>

                </div>

            `;

        }
    );


    // ==================================
    // No Results
    // ==================================

    if (visibleCount === 0) {

        leaveList.innerHTML = `
            <div style="
                padding:30px;
                text-align:center;
                color:#666;
            ">
                📭 No Pending Leave Requests
            </div>
        `;

    }


    // ==================================
    // Dashboard Counts
    // ==================================

    pendingCount.textContent =
        leaveRequests.length;

    approvedCount.textContent =
        "-";

    rejectedCount.textContent =
        "-";

    totalCount.textContent =
        leaveRequests.length;

}


// ======================================
// Approve Leave
// ======================================

window.approveLeave =
    async function(id) {

        const remarkElement =
            document.getElementById(
                `remark_${id}`
            );


        const remark =
            remarkElement
                ? remarkElement.value.trim()
                : "";


        try {

            await updateDoc(

                doc(
                    db,
                    "leave_requests",
                    id
                ),

                {

                    status: "Approved",

                    teacherRemark: remark,

                    approvedBy:
                        currentTeacher.name ||
                        "Teacher",

                    approvedDate:
                        serverTimestamp()

                }

            );


            leaveRequests =
                leaveRequests.filter(
                    (item) =>
                        item.id !== id
                );


            renderLeaveList();


            alert(
                "✅ Leave Approved Successfully"
            );

        }
        catch (error) {

            console.error(
                "Approve Leave Error:",
                error
            );

            alert(
                "Unable to Approve Leave"
            );

        }

    };


// ======================================
// Reject Leave
// ======================================

window.rejectLeave =
    async function(id) {

        const remarkElement =
            document.getElementById(
                `remark_${id}`
            );


        const remark =
            remarkElement
                ? remarkElement.value.trim()
                : "";


        try {

            await updateDoc(

                doc(
                    db,
                    "leave_requests",
                    id
                ),

                {

                    status: "Rejected",

                    teacherRemark: remark,

                    approvedBy:
                        currentTeacher.name ||
                        "Teacher",

                    approvedDate:
                        serverTimestamp()

                }

            );


            leaveRequests =
                leaveRequests.filter(
                    (item) =>
                        item.id !== id
                );


            renderLeaveList();


            alert(
                "❌ Leave Rejected"
            );

        }
        catch (error) {

            console.error(
                "Reject Leave Error:",
                error
            );

            alert(
                "Unable to Reject Leave"
            );

        }

    };


// ======================================
// Search
// ======================================

searchStudent?.addEventListener(
    "input",
    renderLeaveList
);


// ======================================
// Filters
// ======================================

statusFilter?.addEventListener(
    "change",
    renderLeaveList
);

classFilter?.addEventListener(
    "change",
    renderLeaveList
);

sectionFilter?.addEventListener(
    "change",
    renderLeaveList
);


// ======================================
// Select All
// ======================================

selectAll?.addEventListener(
    "change",
    () => {

        document
            .querySelectorAll(
                ".leaveCheck"
            )
            .forEach(
                (check) => {

                    check.checked =
                        selectAll.checked;

                }
            );

    }
);


// ======================================
// Bulk Actions
// ======================================

approveSelected?.addEventListener(
    "click",
    () => {

        alert(
            "Bulk Approve will be available in Version 2."
        );

    }
);


rejectSelected?.addEventListener(
    "click",
    () => {

        alert(
            "Bulk Reject will be available in Version 2."
        );

    }
);


// ======================================
// Auto Refresh
// ======================================

setInterval(
    async () => {

        try {

            await loadLeaveRequests();

        }
        catch (error) {

            console.error(
                "Leave Refresh Error:",
                error
            );

        }

    },
    60000
);


// ======================================
// Initialize
// ======================================

loadLeaveRequests();


// ======================================
// Version
// ======================================

console.log(
    "================================"
);

console.log(
    "School Connect TN"
);

console.log(
    "Leave Management V5"
);

console.log(
    "Teacher ID Compatible"
);

console.log(
    "Pending Workflow Enabled"
);

console.log(
    "================================"
);


// ======================================
// Global Error Handler
// ======================================

window.addEventListener(
    "error",
    (event) => {

        console.error(
            "Global Error :",
            event.error
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    (event) => {

        console.error(
            "Unhandled Promise :",
            event.reason
        );

    }
);
