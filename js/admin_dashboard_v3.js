//==================================================
// School Connect TN
// Admin Dashboard V4
// Stable Session Version
//==================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";


//==================================================
// Session Check
//==================================================

function getUserRole() {

    return (
        localStorage.getItem("userRole") ||
        sessionStorage.getItem("userRole") ||
        ""
    );

}


const role = getUserRole();

console.log("================================");
console.log("School Connect TN");
console.log("Admin Dashboard V4");
console.log("User Role :", role);
console.log("================================");


//==================================================
// Admin Access Protection
//==================================================

if (role !== "Admin") {

    console.warn(
        "Admin access denied. Current role:",
        role
    );

    window.location.href = "index.html";

}


//==================================================
// Dashboard Elements
//==================================================

const studentEl =
    document.getElementById("studentCount");

const teacherEl =
    document.getElementById("teacherCount");

const homeworkEl =
    document.getElementById("homeworkCount");

const noticeEl =
    document.getElementById("noticeCount");


//==================================================
// Safe Count Helper
//==================================================

function setCount(element, value) {

    if (element) {

        element.textContent = value;

    }

}


//==================================================
// Load Students
//==================================================

async function loadStudents() {

    try {

        const studentSnap =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );

        setCount(
            studentEl,
            studentSnap.size
        );

        console.log(
            "Students :",
            studentSnap.size
        );

    } catch (error) {

        console.error(
            "Student Load Error :",
            error
        );

        setCount(
            studentEl,
            "-"
        );

    }

}


//==================================================
// Load Teachers
//==================================================

async function loadTeachers() {

    try {

        const teacherSnap =
            await getDocs(
                collection(
                    db,
                    "teachers"
                )
            );

        setCount(
            teacherEl,
            teacherSnap.size
        );

        console.log(
            "Teachers :",
            teacherSnap.size
        );

    } catch (error) {

        console.error(
            "Teacher Load Error :",
            error
        );

        setCount(
            teacherEl,
            "-"
        );

    }

}


//==================================================
// Load Homework
//==================================================

async function loadHomework() {

    try {

        const homeworkSnap =
            await getDocs(
                collection(
                    db,
                    "homework"
                )
            );

        setCount(
            homeworkEl,
            homeworkSnap.size
        );

        console.log(
            "Homework :",
            homeworkSnap.size
        );

    } catch (error) {

        console.error(
            "Homework Load Error :",
            error
        );

        setCount(
            homeworkEl,
            "-"
        );

    }

}


//==================================================
// Load Notices
//==================================================

async function loadNotices() {

    try {

        let noticeCount = 0;


        //==========================================
        // First try: notices
        //==========================================

        try {

            const noticeSnap =
                await getDocs(
                    collection(
                        db,
                        "notices"
                    )
                );

            noticeCount =
                noticeSnap.size;

        } catch (error) {

            console.warn(
                "notices collection unavailable. Trying notice..."
            );


            //======================================
            // Second try: notice
            //======================================

            try {

                const noticeSnap =
                    await getDocs(
                        collection(
                            db,
                            "notice"
                        )
                    );

                noticeCount =
                    noticeSnap.size;

            } catch (secondError) {

                console.error(
                    "Notice Load Error :",
                    secondError
                );

                noticeCount = 0;

            }

        }


        setCount(
            noticeEl,
            noticeCount
        );

        console.log(
            "Notices :",
            noticeCount
        );

    } catch (error) {

        console.error(
            "Notice Error :",
            error
        );

        setCount(
            noticeEl,
            "-"
        );

    }

}


//==================================================
// Load Complete Dashboard
//==================================================

async function loadDashboard() {

    console.log(
        "Loading Admin Dashboard..."
    );


    // Show loading state

    setCount(
        studentEl,
        "..."
    );

    setCount(
        teacherEl,
        "..."
    );

    setCount(
        homeworkEl,
        "..."
    );

    setCount(
        noticeEl,
        "..."
    );


    try {

        await Promise.all([

            loadStudents(),

            loadTeachers(),

            loadHomework(),

            loadNotices()

        ]);


        console.log(
            "Admin Dashboard Loaded Successfully"
        );

    } catch (error) {

        console.error(
            "Dashboard Load Error :",
            error
        );

    }

}


//==================================================
// Logout Admin
//==================================================

window.logoutAdmin = async function () {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    try {

        //==========================================
        // Firebase Logout
        //==========================================

        if (auth) {

            await signOut(auth);

        }


    } catch (error) {

        console.warn(
            "Firebase Logout Error :",
            error
        );

    }


    //==============================================
    // Remove only application session data
    //==============================================

    localStorage.removeItem(
        "userRole"
    );

    localStorage.removeItem(
        "userId"
    );

    localStorage.removeItem(
        "currentUser"
    );

    localStorage.removeItem(
        "teacherId"
    );

    localStorage.removeItem(
        "teacherDocId"
    );

    localStorage.removeItem(
        "teacherName"
    );


    sessionStorage.removeItem(
        "userRole"
    );

    sessionStorage.removeItem(
        "userId"
    );

    sessionStorage.removeItem(
        "currentUser"
    );

    sessionStorage.removeItem(
        "teacherId"
    );

    sessionStorage.removeItem(
        "teacherDocId"
    );

    sessionStorage.removeItem(
        "teacherName"
    );


    //==============================================
    // Redirect to Main Login
    //==============================================

    window.location.href =
        "index.html";

};


//==================================================
// DOM Ready
//==================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Admin Dashboard DOM Ready"
        );


        // Re-check session

        const currentRole =
            getUserRole();


        if (
            currentRole !== "Admin"
        ) {

            console.warn(
                "Invalid Admin Session"
            );

            window.location.href =
                "index.html";

            return;

        }


        // Load dashboard

        await loadDashboard();

    }
);


//==================================================
// Auto Refresh
//==================================================

setInterval(
    async function () {

        try {

            const currentRole =
                getUserRole();


            if (
                currentRole === "Admin"
            ) {

                await loadDashboard();

            }

        } catch (error) {

            console.error(
                "Dashboard Refresh Error :",
                error
            );

        }

    },
    60000
);


//==================================================
// Global Error Handler
//==================================================

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "Global Error :",
            event.error
        );

    }
);


//==================================================
// Promise Error Handler
//==================================================

window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "Unhandled Promise :",
            event.reason
        );

    }
);


//==================================================
// Final Log
//==================================================

console.log(
    "Admin Dashboard V4 Ready"
);
