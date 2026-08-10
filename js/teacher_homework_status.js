//==========================================
// School Connect TN
// Teacher Homework Status
// Production Version V2
// Teacher ID + Document ID Compatible
//==========================================

import { db } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


//==========================================
// Dashboard Elements
//==========================================

const totalHomework =
    document.getElementById("totalHomework");

const completedCount =
    document.getElementById("completedCount");

const pendingCount =
    document.getElementById("pendingCount");

const completedList =
    document.getElementById("completedList");

const pendingList =
    document.getElementById("pendingList");

const completedCard =
    document.getElementById("completedCard");

const pendingCard =
    document.getElementById("pendingCard");

const completedPopup =
    document.getElementById("completedPopup");

const pendingPopup =
    document.getElementById("pendingPopup");

const closeCompleted =
    document.getElementById("closeCompleted");

const closePending =
    document.getElementById("closePending");


//==========================================
// Teacher Session
//==========================================

const sessionTeacherId =
    localStorage.getItem("teacherId") ||
    sessionStorage.getItem("teacherId");

const teacherDocId =
    localStorage.getItem("teacherDocId") ||
    sessionStorage.getItem("teacherDocId");


if (!sessionTeacherId && !teacherDocId) {

    alert("Session Expired");

    location.href = "index.html";

}


//==========================================
// Load Teacher Information
//==========================================

async function loadTeacherInformation() {

    let teacher = null;

    // --------------------------------------
    // First try teacherDocId
    // --------------------------------------

    if (teacherDocId) {

        try {

            const teacherRef =
                doc(db, "teachers", teacherDocId);

            const teacherSnap =
                await getDoc(teacherRef);

            if (teacherSnap.exists()) {

                teacher = teacherSnap.data();

            }

        }
        catch (error) {

            console.log(
                "Teacher Document Load Failed:",
                error
            );

        }

    }


    // --------------------------------------
    // If teacherDocId not available,
    // search by teacherId
    // --------------------------------------

    if (!teacher && sessionTeacherId) {

        try {

            const q = query(
                collection(db, "teachers"),
                where("teacherId", "==", sessionTeacherId)
            );

            const snap = await getDocs(q);

            if (!snap.empty) {

                teacher = snap.docs[0].data();

            }

        }
        catch (error) {

            console.log(
                "Teacher ID Search Failed:",
                error
            );

        }

    }


    return teacher;

}


//==========================================
// Load Homework Status
//==========================================

async function loadHomeworkStatus() {

    try {

        completedList.innerHTML =
            "Loading Completed Homework...";

        pendingList.innerHTML =
            "Loading Pending Homework...";


        // ----------------------------------
        // Load Teacher
        // ----------------------------------

        const teacher =
            await loadTeacherInformation();


        // ----------------------------------
        // Build all possible IDs
        // ----------------------------------

        const possibleIds = new Set();


        if (sessionTeacherId) {

            possibleIds.add(
                sessionTeacherId
            );

        }


        if (teacherDocId) {

            possibleIds.add(
                teacherDocId
            );

        }


        if (teacher) {

            if (teacher.teacherId) {

                possibleIds.add(
                    teacher.teacherId
                );

            }

            if (teacher.id) {

                possibleIds.add(
                    teacher.id
                );

            }

        }


        console.log(
            "Teacher Session ID :",
            sessionTeacherId
        );

        console.log(
            "Teacher Document ID :",
            teacherDocId
        );

        console.log(
            "Possible Teacher IDs :",
            [...possibleIds]
        );


        // ----------------------------------
        // Search Homework Submissions
        // using all possible IDs
        // ----------------------------------

        const matchedDocuments =
            new Map();


        for (const id of possibleIds) {

            if (!id) continue;


            const q = query(
                collection(
                    db,
                    "homework_submissions"
                ),
                where(
                    "teacherId",
                    "==",
                    id
                )
            );


            const snap =
                await getDocs(q);


            snap.forEach((docSnap) => {

                matchedDocuments.set(
                    docSnap.id,
                    docSnap
                );

            });

        }


        console.log(
            "Matched Docs :",
            matchedDocuments.size
        );


        // ----------------------------------
        // Reset
        // ----------------------------------

        let total = 0;

        let completed = 0;

        let pending = 0;


        completedList.innerHTML = "";

        pendingList.innerHTML = "";


        // ----------------------------------
        // No Data
        // ----------------------------------

        if (matchedDocuments.size === 0) {

            totalHomework.textContent = "0";

            completedCount.textContent = "0";

            pendingCount.textContent = "0";


            completedList.innerHTML =
                "<p>No Completed Homework</p>";

            pendingList.innerHTML =
                "<p>No Pending Homework</p>";

            return;

        }


        // ----------------------------------
        // Process Homework
        // ----------------------------------

        matchedDocuments.forEach(
            (docSnap) => {

                const hw =
                    docSnap.data();


                total++;


                // =================================
                // COMPLETED
                // =================================

                if (
                    hw.status === "Completed"
                ) {

                    completed++;


                    completedList.innerHTML += `

                        <div class="homeworkItem">

                            <h3>
                                📚 ${hw.title || "Homework"}
                            </h3>

                            <p>
                                <b>Subject:</b>
                                ${hw.subject || "-"}
                            </p>

                            <p>
                                <b>Class:</b>
                                ${hw.class || hw.className || "-"}
                                ${hw.section || ""}
                            </p>

                            <p>
                                <b>Student:</b>
                                ${hw.studentName || "-"}
                            </p>

                            <p>
                                <b>Status:</b>
                                ✅ Completed
                            </p>

                        </div>

                    `;

                }


                // =================================
                // PENDING
                // =================================

                else {

                    pending++;


                    pendingList.innerHTML += `

                        <div class="homeworkItem">

                            <h3>
                                📚 ${hw.title || "Homework"}
                            </h3>

                            <p>
                                <b>Subject:</b>
                                ${hw.subject || "-"}
                            </p>

                            <p>
                                <b>Class:</b>
                                ${hw.class || hw.className || "-"}
                                ${hw.section || ""}
                            </p>

                            <p>
                                <b>Student:</b>
                                ${hw.studentName || "-"}
                            </p>

                            <p>
                                <b>Due Date:</b>
                                ${hw.dueDate || "-"}
                            </p>

                            <p>
                                <b>Status:</b>
                                ⏳ Pending
                            </p>

                        </div>

                    `;

                }

            }
        );


        // ----------------------------------
        // Update Dashboard
        // ----------------------------------

        totalHomework.textContent =
            total;

        completedCount.textContent =
            completed;

        pendingCount.textContent =
            pending;


        // ----------------------------------
        // Empty Messages
        // ----------------------------------

        if (completed === 0) {

            completedList.innerHTML =
                "<p>No Completed Homework</p>";

        }


        if (pending === 0) {

            pendingList.innerHTML =
                "<p>No Pending Homework</p>";

        }


        console.log(
            "Homework Status Loaded Successfully"
        );

    }
    catch (error) {

        console.error(
            "Teacher Homework Status Error:",
            error
        );


        totalHomework.textContent = "0";

        completedCount.textContent = "0";

        pendingCount.textContent = "0";


        completedList.innerHTML =
            "<p>Unable to load homework.</p>";

        pendingList.innerHTML =
            "<p>Unable to load homework.</p>";

    }

}


//==========================================
// DOM Ready
//==========================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        loadHomeworkStatus();

    }
);


//==========================================
// Auto Refresh
//==========================================

setInterval(
    async () => {

        try {

            await loadHomeworkStatus();

        }
        catch (error) {

            console.error(
                "Homework Status Refresh Error:",
                error
            );

        }

    },
    30000
);


//==========================================
// Popup Events
//==========================================

if (completedCard) {

    completedCard.addEventListener(
        "click",
        () => {

            completedPopup.style.display =
                "flex";

        }
    );

}


if (pendingCard) {

    pendingCard.addEventListener(
        "click",
        () => {

            pendingPopup.style.display =
                "flex";

        }
    );

}


if (closeCompleted) {

    closeCompleted.addEventListener(
        "click",
        () => {

            completedPopup.style.display =
                "none";

        }
    );

}


if (closePending) {

    closePending.addEventListener(
        "click",
        () => {

            pendingPopup.style.display =
                "none";

        }
    );

}


window.addEventListener(
    "click",
    (event) => {

        if (
            event.target === completedPopup
        ) {

            completedPopup.style.display =
                "none";

        }


        if (
            event.target === pendingPopup
        ) {

            pendingPopup.style.display =
                "none";

        }

    }
);


//==========================================
// Version Information
//==========================================

console.log(
    "================================"
);

console.log(
    "School Connect TN"
);

console.log(
    "Teacher Homework Status"
);

console.log(
    "Production Version V2"
);

console.log(
    "Teacher ID Compatible"
);

console.log(
    "================================"
);
