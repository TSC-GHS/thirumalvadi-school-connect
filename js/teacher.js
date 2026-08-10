import { auth, db } from "../firebase.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


// =====================================
// School Connect TN
// Teacher Dashboard V6
// Developed by VTOOS
// =====================================


// =====================================
// DOM Elements
// =====================================

const teacherName =
    document.getElementById("teacherName");

const teacherRole =
    document.getElementById("teacherRole");

const attendanceCount =
    document.getElementById("attendanceCount");

const homeworkCount =
    document.getElementById("homeworkCount");

const noticeCount =
    document.getElementById("noticeCount");

const leaveCount =
    document.getElementById("leaveCount");

const leaveMenu =
    document.getElementById("leaveMenu");

const leaveCard =
    document.getElementById("leaveCard");

const logoutBtn =
    document.getElementById("logoutBtn");

const latestNotice =
    document.getElementById("latestNotice");

const recentHomework =
    document.getElementById("recentHomework");

const teacherWelcome =
    document.getElementById("teacherWelcome");


// =====================================
// Global
// =====================================

let currentTeacher = null;


// =====================================
// Load Teacher Profile
// =====================================

async function loadTeacher() {

    // ---------------------------------
    // Get Teacher ID
    // ---------------------------------

    let teacherId =
        localStorage.getItem("teacherId") ||
        sessionStorage.getItem("teacherId");


    // ---------------------------------
    // Try currentUser if teacherId missing
    // ---------------------------------

    if (!teacherId) {

        try {

            const currentUser =
                JSON.parse(
                    sessionStorage.getItem("currentUser") || "{}"
                );

            teacherId =
                currentUser.teacherId ||
                currentUser.id ||
                currentUser.emis ||
                "";

        } catch (error) {

            console.log("Current user session read failed");

        }

    }


    // ---------------------------------
    // No Teacher ID
    // ---------------------------------

    if (!teacherId) {

        alert("Session Expired");

        location.href = "index.html";

        return false;

    }


    console.log("Teacher ID:", teacherId);


    try {

        let teacherSnap = null;


        // =================================
        // Method 1
        // Firestore document ID
        // =================================

        const teacherRef =
            doc(db, "teachers", teacherId);

        const directSnap =
            await getDoc(teacherRef);


        if (directSnap.exists()) {

            teacherSnap = directSnap;

        }


        // =================================
        // Method 2
        // Search teacherId field
        // =================================

        if (!teacherSnap) {

            const q =
                query(
                    collection(db, "teachers"),
                    where("teacherId", "==", teacherId),
                    limit(1)
                );

            const snapshot =
                await getDocs(q);


            if (!snapshot.empty) {

                teacherSnap =
                    snapshot.docs[0];

            }

        }


        // =================================
        // Method 3
        // Search id field
        // =================================

        if (!teacherSnap) {

            const q =
                query(
                    collection(db, "teachers"),
                    where("id", "==", teacherId),
                    limit(1)
                );

            const snapshot =
                await getDocs(q);


            if (!snapshot.empty) {

                teacherSnap =
                    snapshot.docs[0];

            }

        }


        // =================================
        // Teacher Not Found
        // =================================

        if (!teacherSnap) {

            console.error(
                "Teacher profile not found:",
                teacherId
            );

            alert(
                "Teacher Profile Not Found.\nTeacher ID: " +
                teacherId
            );

            location.href = "index.html";

            return false;

        }


        // =================================
        // Load Teacher Data
        // =================================

        currentTeacher =
            teacherSnap.data();


        // Store actual Firestore ID
        // for future use

        const firestoreTeacherId =
            teacherSnap.id;


        localStorage.setItem(
            "teacherId",
            firestoreTeacherId
        );

        sessionStorage.setItem(
            "teacherId",
            firestoreTeacherId
        );


        // =================================
        // Display Teacher
        // =================================

        teacherName.textContent =
            currentTeacher.name ||
            currentTeacher.teacherName ||
            "Teacher";


        teacherRole.textContent =
            currentTeacher.teacherType ||
            currentTeacher.role ||
            "Teacher";


        // =================================
        // Greeting
        // =================================

        const hour =
            new Date().getHours();


        let greet =
            "Good Evening";


        if (hour < 12) {

            greet =
                "Good Morning";

        }
        else if (hour < 17) {

            greet =
                "Good Afternoon";

        }


        teacherWelcome.textContent =
            `${greet}, ${
                currentTeacher.name ||
                currentTeacher.teacherName ||
                "Teacher"
            }`;


        // =================================
        // Subject Teacher Restrictions
        // =================================

        if (
            currentTeacher.teacherType ===
            "Subject Teacher"
        ) {

            if (leaveMenu) {

                leaveMenu.style.display =
                    "none";

            }

            if (leaveCard) {

                leaveCard.style.display =
                    "none";

            }

        }


        console.log(
            "Teacher Profile Loaded:",
            currentTeacher
        );


        return true;

    }
    catch (error) {

        console.error(
            "Teacher Profile Error:",
            error
        );

        alert(
            "Unable to load Teacher Profile."
        );

        return false;

    }

}


// =====================================
// Dashboard Counts
// =====================================

async function loadDashboard() {

    try {

        // =================================
        // Homework
        // =================================

        const homeworkSnap =
            await getDocs(
                query(
                    collection(db, "homework"),
                    orderBy("updatedAt", "desc"),
                    limit(5)
                )
            );


        homeworkCount.textContent =
            homeworkSnap.size;


        // =================================
        // Notices
        // =================================

        const noticeSnap =
            await getDocs(
                query(
                    collection(db, "notices"),
                    orderBy("createdAt", "desc"),
                    limit(5)
                )
            );


        noticeCount.textContent =
            noticeSnap.size;


        // =================================
        // Latest Notices
        // =================================

        let noticeHTML = "";


        noticeSnap.docs
            .slice(0, 5)
            .forEach((noticeDoc) => {

                const data =
                    noticeDoc.data();


                noticeHTML += `
                    <div class="noticeItem">

                        📢 <strong>
                        ${data.title || "Notice"}
                        </strong>

                        <br>

                        <small>
                        ${data.startDate || "-"}
                        </small>

                    </div>
                `;

            });


        latestNotice.innerHTML =
            noticeHTML ||
            "<p>No Notices</p>";


        // =================================
        // Recent Homework
        // =================================

        let hwHTML = "";


        homeworkSnap.docs
            .slice(0, 5)
            .forEach((homeworkDoc) => {

                const data =
                    homeworkDoc.data();


                hwHTML += `
                    <div class="homeworkItem">

                        📚 <strong>
                        ${data.subject || "-"}
                        </strong>

                        <br>

                        Class:
                        ${data.class || "-"}
                        ${data.section || ""}

                        <br>

                        Due:
                        ${data.dueDate || "-"}

                    </div>
                `;

            });


        recentHomework.innerHTML =
            hwHTML ||
            "<p>No Homework</p>";


        // =================================
        // Today's Attendance
        // =================================

        const today =
            new Date()
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-");


        const attendanceRef =
            doc(
                db,
                "attendance",
                today
            );


        const attendanceDoc =
            await getDoc(
                attendanceRef
            );


        if (attendanceDoc.exists()) {

            const students =
                await getDocs(
                    collection(
                        db,
                        "attendance",
                        today,
                        "students"
                    )
                );


            attendanceCount.textContent =
                students.size;

        }
        else {

            attendanceCount.textContent =
                "0";

        }


        // =================================
        // Leave Count
        // =================================

        if (
            currentTeacher &&
            currentTeacher.teacherType ===
            "Class Teacher"
        ) {

            const leaveSnap =
                await getDocs(
                    query(
                        collection(
                            db,
                            "leave_requests"
                        ),
                        where(
                            "status",
                            "==",
                            "Pending"
                        )
                    )
                );


            let pending = 0;


            leaveSnap.forEach(
                (leaveDoc) => {

                    const leave =
                        leaveDoc.data();


                    // -------------------------
                    // Assigned Classes
                    // -------------------------

                    if (
                        Array.isArray(
                            currentTeacher.assignedClasses
                        )
                    ) {

                        if (
                            currentTeacher
                                .assignedClasses
                                .includes(
                                    leave.class
                                )
                        ) {

                            pending++;

                        }

                    }
                    else {

                        // -------------------------
                        // Class + Section
                        // -------------------------

                        if (
                            leave.class ===
                                currentTeacher.className
                            &&
                            leave.section ===
                                currentTeacher.section
                        ) {

                            pending++;

                        }

                    }

                }
            );


            leaveCount.textContent =
                pending;

        }
        else {

            leaveCount.textContent =
                "-";

        }

    }
    catch (error) {

        console.error(
            "Dashboard Load Error:",
            error
        );


        homeworkCount.textContent =
            "-";

        noticeCount.textContent =
            "-";

        attendanceCount.textContent =
            "-";

        leaveCount.textContent =
            "-";

    }

}


// =====================================
// Initialize Dashboard
// =====================================

async function initializeDashboard() {

    const loaded =
        await loadTeacher();


    if (!loaded) {

        return;

    }


    await loadDashboard();


    console.log(
        "Teacher Dashboard Loaded Successfully"
    );

}


// =====================================
// Auto Refresh
// =====================================

setInterval(
    async () => {

        try {

            if (currentTeacher) {

                await loadDashboard();

            }

        }
        catch (error) {

            console.log(
                "Dashboard Refresh Failed:",
                error
            );

        }

    },
    60000
);


// =====================================
// Logout
// =====================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            const ok =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!ok) {

                return;

            }


            try {

                await signOut(auth);

            }
            catch (error) {

                console.log(
                    "Firebase Logout Error:",
                    error
                );

            }


            // Clear Local Storage

            localStorage.removeItem(
                "teacherId"
            );

            localStorage.removeItem(
                "teacherName"
            );

            localStorage.removeItem(
                "teacherType"
            );

            localStorage.removeItem(
                "teacherClass"
            );

            localStorage.removeItem(
                "teacherSection"
            );

            localStorage.removeItem(
                "teacherSubject"
            );

            localStorage.removeItem(
                "userRole"
            );


            // Clear Session Storage

            sessionStorage.removeItem(
                "teacherId"
            );

            sessionStorage.removeItem(
                "teacherName"
            );

            sessionStorage.removeItem(
                "teacherType"
            );

            sessionStorage.removeItem(
                "teacherClass"
            );

            sessionStorage.removeItem(
                "teacherSection"
            );

            sessionStorage.removeItem(
                "teacherSubject"
            );

            sessionStorage.removeItem(
                "userRole"
            );

            sessionStorage.removeItem(
                "currentUser"
            );


            location.href =
                "index.html";

        }
    );

}


// =====================================
// Initialize
// =====================================

initializeDashboard();


// =====================================
// Version Information
// =====================================

console.log(
    "================================"
);

console.log(
    "School Connect TN"
);

console.log(
    "Teacher Dashboard V6"
);

console.log(
    "Firebase Connected"
);

console.log(
    "================================"
);


// =====================================
// Global Error Handler
// =====================================

window.addEventListener(
    "error",
    (event) => {

        console.error(
            "Global Error:",
            event.error
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    (event) => {

        console.error(
            "Unhandled Promise:",
            event.reason
        );

    }
);
