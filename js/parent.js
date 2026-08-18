//==================================================
// School Connect TN
// Parent Dashboard
// Updated with Notification Badge
//==================================================

import { db } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


//==================================================
// Elements
//==================================================

const studentName =
    document.getElementById("studentName");

const studentClassName =
    document.getElementById("studentClass");

const studentEMIS =
    document.getElementById("studentEMIS");

const attendanceCount =
    document.getElementById("attendanceCount");

const homeworkCount =
    document.getElementById("homeworkCount");

const noticeCount =
    document.getElementById("noticeCount");

const resultCount =
    document.getElementById("resultCount");

const latestNotices =
    document.getElementById("latestNotices");

const recentHomework =
    document.getElementById("recentHomework");


//==================================================
// Notification Elements
//==================================================

const notificationBtn =
    document.getElementById("notificationBtn");

const notificationBadge =
    document.getElementById("notificationBadge");


//==================================================
// Parent Session
//==================================================

const parentEMIS =
    localStorage.getItem("parentEMIS") ||
    sessionStorage.getItem("parentEMIS");


if (!parentEMIS) {

    alert("Session Expired");

    location.href = "index.html";

}


//==================================================
// Notification Button
//==================================================

if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        () => {

            location.href =
                "parent_notifications.html";

        }
    );

}


//==================================================
// Student Details
//==================================================

let studentData = null;


async function loadStudent() {

    try {

        const q = query(
            collection(db, "students"),
            where("emis", "==", parentEMIS)
        );


        const snap =
            await getDocs(q);


        if (snap.empty) {

            alert(
                "Student Record Not Found"
            );

            location.href =
                "index.html";

            return false;

        }


        studentData =
            snap.docs[0].data();


        if (studentName) {

            studentName.textContent =
                studentData.name || "-";

        }


        if (studentEMIS) {

            studentEMIS.textContent =
                studentData.emis || "-";

        }


        if (studentClassName) {

            studentClassName.textContent =
                `${studentData.class || "-"}-${studentData.section || "-"}`;

        }


        return true;


    } catch (error) {

        console.error(
            "Student loading error:",
            error
        );


        alert(
            error.message
        );


        return false;

    }

}


//==================================================
// Load Attendance
//==================================================

async function loadAttendance() {

    try {

        const attendanceRef =
            collection(
                db,
                "attendance"
            );


        const attendanceDays =
            await getDocs(
                attendanceRef
            );


        let totalDays = 0;

        let presentDays = 0;


        for (
            const day of attendanceDays.docs
        ) {

            const studentRef =
                collection(
                    db,
                    "attendance",
                    day.id,
                    "students"
                );


            const studentSnap =
                await getDocs(
                    query(
                        studentRef,
                        where(
                            "emis",
                            "==",
                            parentEMIS
                        )
                    )
                );


            if (
                !studentSnap.empty
            ) {

                totalDays++;


                const data =
                    studentSnap
                        .docs[0]
                        .data();


                if (
                    data.status === "P"
                ) {

                    presentDays++;

                }

            }

        }


        const percentage =
            totalDays === 0
                ? 0
                : Math.round(
                    (
                        presentDays /
                        totalDays
                    ) * 100
                );


        if (attendanceCount) {

            attendanceCount.textContent =
                percentage + "%";

        }


    } catch (error) {

        console.error(
            "Attendance error:",
            error
        );


        if (attendanceCount) {

            attendanceCount.textContent =
                "-";

        }

    }

}


//==================================================
// Dashboard Summary
//==================================================

async function loadDashboard() {

    try {

        //============================
        // Homework Count
        //============================

        const homeworkSnap =
            await getDocs(
                collection(
                    db,
                    "homework"
                )
            );


        let count = 0;


        homeworkSnap.forEach(
            (item) => {

                const hw =
                    item.data();


                if (
                    hw.class ==
                        studentData.class
                    &&
                    hw.section ==
                        studentData.section
                ) {

                    count++;

                }

            }
        );


        if (homeworkCount) {

            homeworkCount.textContent =
                count;

        }


        //============================
        // Notice Count
        //============================

        const noticeSnap =
            await getDocs(
                collection(
                    db,
                    "notices"
                )
            );


        if (noticeCount) {

            noticeCount.textContent =
                noticeSnap.size;

        }


        //============================
        // Average Marks
        //============================

        const settingsDoc =
            await getDoc(
                doc(
                    db,
                    "settings",
                    "marks"
                )
            );


        if (
            !settingsDoc.exists()
        ) {

            if (resultCount) {

                resultCount.textContent =
                    "-";

            }

        } else {

            const latestExam =
                settingsDoc
                    .data()
                    .currentExam;


            if (!latestExam) {

                if (resultCount) {

                    resultCount.textContent =
                        "-";

                }

            } else {

                const markDoc =
                    await getDoc(
                        doc(
                            db,
                            "marks",
                            latestExam,
                            "students",
                            parentEMIS
                        )
                    );


                if (
                    !markDoc.exists()
                ) {

                    if (resultCount) {

                        resultCount.textContent =
                            "-";

                    }

                } else {

                    const markData =
                        markDoc.data();


                    if (resultCount) {

                        resultCount.textContent =
                            (
                                markData.percentage ||
                                0
                            ) + "%";

                    }

                }

            }

        }


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        if (homeworkCount) {

            homeworkCount.textContent =
                "-";

        }


        if (noticeCount) {

            noticeCount.textContent =
                "-";

        }


        if (resultCount) {

            resultCount.textContent =
                "-";

        }

    }

}


//==================================================
// Latest Notices
//==================================================

async function loadLatestNotices() {

    try {

        if (!latestNotices) {
            return;
        }


        const snap =
            await getDocs(
                collection(
                    db,
                    "notices"
                )
            );


        latestNotices.innerHTML =
            "";


        if (snap.empty) {

            latestNotices.innerHTML = `
                <div class="empty-card">
                    📢 No notices available
                </div>
            `;


            if (noticeCount) {

                noticeCount.textContent =
                    "0";

            }


            return;

        }


        if (noticeCount) {

            noticeCount.textContent =
                snap.docs.length;

        }


        snap.forEach(
            (item) => {

                const notice =
                    item.data();


                latestNotices.innerHTML += `

                    <div class="notice-item">

                        <div class="notice-title">

                            ${escapeHTML(
                                notice.title || "-"
                            )}

                        </div>

                        <p>

                            ${escapeHTML(
                                notice.description || "-"
                            )}

                        </p>

                    </div>

                `;

            }
        );


    } catch (error) {

        console.error(
            "Latest notices error:",
            error
        );


        if (latestNotices) {

            latestNotices.innerHTML =
                "<div class='empty-card'>📢 No notices available</div>";

        }

    }

}


//==================================================
// Recent Homework
//==================================================

async function loadRecentHomework() {

    try {

        if (!recentHomework) {
            return;
        }


        const snap =
            await getDocs(
                collection(
                    db,
                    "homework"
                )
            );


        recentHomework.innerHTML =
            "";


        if (snap.empty) {

            recentHomework.innerHTML = `
                <div class="empty-card">
                    📚 No homework available
                </div>
            `;

            return;

        }


        let found =
            false;


        snap.forEach(
            (item) => {

                const hw =
                    item.data();


                if (
                    hw.class !=
                        studentData.class
                    ||
                    hw.section !=
                        studentData.section
                ) {

                    return;

                }


                found = true;


                recentHomework.innerHTML += `

                    <div class="homework-item">

                        <div class="homework-sub">

                            ${escapeHTML(
                                hw.subject || "-"
                            )}

                        </div>

                        <p>

                            ${escapeHTML(
                                hw.title ||
                                hw.description ||
                                "-"
                            )}

                        </p>

                        <small>

                            Due :
                            ${escapeHTML(
                                hw.dueDate || "-"
                            )}

                        </small>

                    </div>

                `;

            }
        );


        if (!found) {

            recentHomework.innerHTML =
                "<p>No Homework Available</p>";

        }


    } catch (error) {

        console.error(
            "Homework error:",
            error
        );


        recentHomework.innerHTML =
            "<p>Unable to load homework</p>";

    }

}


//==================================================
// Upcoming Events
//==================================================

async function loadUpcomingEvents() {

    try {

        const upcomingEvents =
            document.getElementById(
                "upcomingEvents"
            );


        if (!upcomingEvents) {
            return;
        }


        const snap =
            await getDocs(
                collection(
                    db,
                    "calendar"
                )
            );


        upcomingEvents.innerHTML =
            "";


        if (snap.empty) {

            upcomingEvents.innerHTML = `
                <div class="empty-card">
                    📅 No Upcoming Events
                </div>
            `;

            return;

        }


        snap.forEach(
            (item) => {

                const event =
                    item.data();


                upcomingEvents.innerHTML += `

                    <div class="notice-item">

                        <div class="notice-title">

                            ${escapeHTML(
                                event.title || "-"
                            )}

                        </div>

                        <p>

                            ${escapeHTML(
                                event.description || "-"
                            )}

                        </p>

                        <small>

                            📅
                            ${escapeHTML(
                                event.date || "-"
                            )}

                        </small>

                    </div>

                `;

            }
        );


    } catch (error) {

        console.error(
            "Upcoming events error:",
            error
        );


        const element =
            document.getElementById(
                "upcomingEvents"
            );


        if (element) {

            element.innerHTML =
                "<div class='empty-card'>No Events Available</div>";

        }

    }

}


//==================================================
// Notification Unread Count
//==================================================

async function loadNotificationBadge() {

    try {

        if (!parentEMIS) {

            hideNotificationBadge();

            return;

        }


        const notificationsRef =
            collection(
                db,
                "notifications"
            );


        //========================================
        // ALL PARENTS
        //========================================

        const allParentsQuery =
            query(
                notificationsRef,
                where(
                    "target",
                    "==",
                    "all_parents"
                )
            );


        //========================================
        // SPECIFIC PARENT
        //========================================

        const specificParentQuery =
            query(
                notificationsRef,
                where(
                    "target",
                    "==",
                    "parent"
                ),
                where(
                    "targetEMIS",
                    "==",
                    String(parentEMIS)
                )
            );


        const [
            allParentsSnapshot,
            specificParentSnapshot
        ] =
            await Promise.all([

                getDocs(
                    allParentsQuery
                ),

                getDocs(
                    specificParentQuery
                )

            ]);


        const notificationMap =
            new Map();


        //========================================
        // ALL PARENTS NOTIFICATIONS
        //========================================

        allParentsSnapshot.forEach(
            (item) => {

                notificationMap.set(
                    item.id,
                    item.data()
                );

            }
        );


        //========================================
        // SPECIFIC PARENT NOTIFICATIONS
        //========================================

        specificParentSnapshot.forEach(
            (item) => {

                notificationMap.set(
                    item.id,
                    item.data()
                );

            }
        );


        //========================================
        // COUNT UNREAD
        //========================================

        let unreadCount =
            0;


        notificationMap.forEach(
            (notification) => {

                if (
                    notification.isRead !== true
                ) {

                    unreadCount++;

                }

            }
        );


        console.log(
            "Unread notifications:",
            unreadCount
        );


        updateNotificationBadge(
            unreadCount
        );


    } catch (error) {

        console.error(
            "Notification badge error:",
            error
        );


        hideNotificationBadge();

    }

}


//==================================================
// Update Notification Badge
//==================================================

function updateNotificationBadge(
    count
) {

    if (!notificationBadge) {

        return;

    }


    if (
        count <= 0
    ) {

        hideNotificationBadge();

        return;

    }


    notificationBadge.style.display =
        "flex";


    if (
        count > 99
    ) {

        notificationBadge.textContent =
            "99+";

    } else {

        notificationBadge.textContent =
            count;

    }

}


//==================================================
// Hide Badge
//==================================================

function hideNotificationBadge() {

    if (!notificationBadge) {

        return;

    }


    notificationBadge.style.display =
        "none";

}


//==================================================
// Initialize Dashboard
//==================================================

async function initializeDashboard() {

    const loaded =
        await loadStudent();


    if (!loaded) {

        return;

    }


    await Promise.all([

        loadAttendance(),

        loadDashboard(),

        loadLatestNotices(),

        loadRecentHomework(),

        loadUpcomingEvents(),

        loadNotificationBadge()

    ]);

}


initializeDashboard();


//==================================================
// Bottom Menu
//==================================================

window.goHome = () => {

    location.href =
        "parent.html";

};


window.goAttendance = () => {

    location.href =
        "parent_attendance.html";

};


window.goReport = () => {

    location.href =
        "parent_report_card.html";

};


window.goProfile = () => {

    location.href =
        "student_profile.html";

};


//==================================================
// Logout
//==================================================

window.logout = () => {

    localStorage.removeItem(
        "parentEMIS"
    );

    sessionStorage.removeItem(
        "parentEMIS"
    );


    location.href =
        "index.html";

};


//==================================================
// Language Selector
//==================================================

const language = {

    ta: {

        dashboard:
            "முகப்பு",

        welcome:
            "👋 வரவேற்கிறோம்",

        attendance:
            "வருகை",

        average:
            "சராசரி",

        homework:
            "வீட்டுப்பாடம்",

        notice:
            "அறிவிப்புகள்",

        quick:
            "⚡ விரைவு செயல்கள்",

        latest:
            "📢 சமீபத்திய அறிவிப்புகள்",

        today:
            "📚 இன்றைய வீட்டுப்பாடம்",

        events:
            "📅 வரவிருக்கும் நிகழ்வுகள்"

    },


    en: {

        dashboard:
            "Parent Dashboard",

        welcome:
            "👋 Welcome Parent",

        attendance:
            "Attendance",

        average:
            "Average",

        homework:
            "Homework",

        notice:
            "Notices",

        quick:
            "⚡ Quick Actions",

        latest:
            "📢 Latest Notice",

        today:
            "📚 Today's Homework",

        events:
            "📅 Upcoming Events"

    },


    hi: {

        dashboard:
            "अभिभावक डैशबोर्ड",

        welcome:
            "👋 स्वागत है",

        attendance:
            "उपस्थिति",

        average:
            "औसत",

        homework:
            "गृहकार्य",

        notice:
            "सूचनाएँ",

        quick:
            "⚡ त्वरित कार्य",

        latest:
            "📢 नवीनतम सूचनाएँ",

        today:
            "📚 आज का गृहकार्य",

        events:
            "📅 आगामी कार्यक्रम"

    }

};


const languageSelect =
    document.getElementById(
        "languageSelect"
    );


if (languageSelect) {

    const savedLanguage =
        localStorage.getItem(
            "language"
        ) || "ta";


    const t =
        language[
            savedLanguage
        ];


    if (t) {

        const dashboardTitle =
            document.getElementById(
                "dashboardTitle"
            );

        const welcomeTitle =
            document.getElementById(
                "welcomeTitle"
            );

        const attendanceLabel =
            document.getElementById(
                "attendanceLabel"
            );

        const averageLabel =
            document.getElementById(
                "averageLabel"
            );

        const homeworkLabel =
            document.getElementById(
                "homeworkLabel"
            );

        const noticeLabel =
            document.getElementById(
                "noticeLabel"
            );

        const quickActionsTitle =
            document.getElementById(
                "quickActionsTitle"
            );

        const latestNoticeTitle =
            document.getElementById(
                "latestNoticeTitle"
            );

        const todayHomeworkTitle =
            document.getElementById(
                "todayHomeworkTitle"
            );

        const upcomingEventsTitle =
            document.getElementById(
                "upcomingEventsTitle"
            );


        if (dashboardTitle)
            dashboardTitle.textContent =
                t.dashboard;

        if (welcomeTitle)
            welcomeTitle.textContent =
                t.welcome;

        if (attendanceLabel)
            attendanceLabel.textContent =
                t.attendance;

        if (averageLabel)
            averageLabel.textContent =
                t.average;

        if (homeworkLabel)
            homeworkLabel.textContent =
                t.homework;

        if (noticeLabel)
            noticeLabel.textContent =
                t.notice;

        if (quickActionsTitle)
            quickActionsTitle.textContent =
                t.quick;

        if (latestNoticeTitle)
            latestNoticeTitle.textContent =
                t.latest;

        if (todayHomeworkTitle)
            todayHomeworkTitle.textContent =
                t.today;

        if (upcomingEventsTitle)
            upcomingEventsTitle.textContent =
                t.events;


        languageSelect.value =
            savedLanguage;


        languageSelect.addEventListener(
            "change",
            (e) => {

                localStorage.setItem(
                    "language",
                    e.target.value
                );

                location.reload();

            }
        );

    }

}


//==================================================
// HTML Escape
//==================================================

function escapeHTML(
    value
) {

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


//==================================================
// FINAL LOG
//==================================================

console.log(
    "================================"
);

console.log(
    "School Connect TN"
);

console.log(
    "Parent Dashboard"
);

console.log(
    "Notification Badge Enabled"
);

console.log(
    "================================"
);
