/* =====================================
   School Connect TN
   Parent Notifications
   Firebase Integration
===================================== */

import { db } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


/* =====================================
   COLLECTION
===================================== */

const NOTIFICATIONS_COLLECTION =
    "notifications";


/* =====================================
   ELEMENTS
===================================== */

const notificationList =
    document.getElementById(
        "notificationList"
    );

const loadingCard =
    document.getElementById(
        "loadingCard"
    );

const emptyCard =
    document.getElementById(
        "emptyCard"
    );

const searchInput =
    document.getElementById(
        "notificationSearch"
    );

const filterSelect =
    document.getElementById(
        "notificationFilter"
    );

const markAllReadButton =
    document.getElementById(
        "markAllReadButton"
    );


/* SUMMARY */

const totalNotificationsEl =
    document.getElementById(
        "totalNotifications"
    );

const unreadNotificationsEl =
    document.getElementById(
        "unreadNotifications"
    );

const importantNotificationsEl =
    document.getElementById(
        "importantNotifications"
    );

const todayNotificationsEl =
    document.getElementById(
        "todayNotifications"
    );


/* =====================================
   DATA
===================================== */

let notifications = [];


/* =====================================
   START
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "====================================="
        );

        console.log(
            "School Connect TN"
        );

        console.log(
            "Parent Notifications"
        );

        console.log(
            "Firebase Notification Module Loaded"
        );

        console.log(
            "====================================="
        );


        setupEvents();

        loadParentNotifications();

    }
);


/* =====================================
   EVENTS
===================================== */

function setupEvents() {


    /* SEARCH */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderNotifications
        );

    }


    /* FILTER */

    if (filterSelect) {

        filterSelect.addEventListener(
            "change",
            renderNotifications
        );

    }


    /* MARK ALL */

    if (markAllReadButton) {

        markAllReadButton.addEventListener(
            "click",
            markAllAsRead
        );

    }

}


/* =====================================
   GET PARENT EMIS
===================================== */

function getParentEMIS() {

    const keys = [

        "parentEMIS",

        "parentStudentId",

        "studentEMIS",

        "emis"

    ];


    for (
        const key of keys
    ) {

        const value =
            localStorage.getItem(
                key
            );


        if (
            value &&
            String(value).trim() !== ""
        ) {

            return String(
                value
            ).trim();

        }

    }


    return null;

}


/* =====================================
   LOAD PARENT NOTIFICATIONS
===================================== */

async function loadParentNotifications() {

    try {

        showLoading();


        const emis =
            getParentEMIS();


        console.log(
            "Parent EMIS:",
            emis
        );


        /* ---------------------------------
           LOGIN CHECK
        --------------------------------- */

        if (!emis) {

            console.warn(
                "Parent EMIS not found."
            );


            hideLoading();


            showEmpty(
                "Login Required",
                "Please login again to view notifications."
            );


            updateSummary();


            return;

        }


        /* ---------------------------------
           LOAD ALL PARENT NOTIFICATIONS
        --------------------------------- */

        const notificationsRef =
            collection(
                db,
                NOTIFICATIONS_COLLECTION
            );


        const allParentsQuery =
            query(
                notificationsRef,
                where(
                    "target",
                    "==",
                    "all_parents"
                )
            );


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
                    emis
                )
            );


        /* ---------------------------------
           FIRESTORE QUERIES
        --------------------------------- */

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


        console.log(
            "All Parent Notifications:",
            allParentsSnapshot.size
        );


        console.log(
            "Specific Parent Notifications:",
            specificParentSnapshot.size
        );


        /* ---------------------------------
           COMBINE
        --------------------------------- */

        notifications = [];


        const notificationIds =
            new Set();


        allParentsSnapshot.forEach(
            (item) => {

                if (
                    notificationIds.has(
                        item.id
                    )
                ) {

                    return;

                }


                notificationIds.add(
                    item.id
                );


                notifications.push({

                    id: item.id,

                    ...item.data()

                });

            }
        );


        specificParentSnapshot.forEach(
            (item) => {

                if (
                    notificationIds.has(
                        item.id
                    )
                ) {

                    return;

                }


                notificationIds.add(
                    item.id
                );


                notifications.push({

                    id: item.id,

                    ...item.data()

                });

            }
        );


        /* ---------------------------------
           SORT NEWEST FIRST
        --------------------------------- */

        notifications.sort(
            (a, b) => {

                return (
                    getMillis(
                        b.createdAt
                    ) -
                    getMillis(
                        a.createdAt
                    )
                );

            }
        );


        console.log(
            "Total Parent Notifications:",
            notifications.length
        );


        hideLoading();


        updateSummary();

        renderNotifications();


    } catch (error) {

        console.error(
            "Parent notification loading error:",
            error
        );


        hideLoading();


        showEmpty(
            "Unable to Load Notifications",
            "Please try again later."
        );

    }

}


/* =====================================
   RENDER
===================================== */

function renderNotifications() {

    if (!notificationList) {

        return;

    }


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filter =
        filterSelect
            ? filterSelect.value
            : "all";


    let filtered =
        notifications.filter(
            (item) => {


                /* ---------------------------------
                   SEARCH
                --------------------------------- */

                const searchable =
                    [

                        item.title,

                        item.message,

                        item.type,

                        item.priority

                    ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                if (
                    searchText &&
                    !searchable.includes(
                        searchText
                    )
                ) {

                    return false;

                }


                /* ---------------------------------
                   FILTER
                --------------------------------- */

                if (
                    filter === "unread"
                ) {

                    if (
                        item.isRead === true
                    ) {

                        return false;

                    }

                }


                if (
                    filter === "important"
                ) {

                    if (
                        item.priority !==
                        "important" &&
                        item.priority !==
                        "urgent"
                    ) {

                        return false;

                    }

                }


                if (
                    filter !== "all" &&
                    filter !== "unread" &&
                    filter !== "important"
                ) {

                    if (
                        item.type !==
                        filter
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    /* ---------------------------------
       EMPTY
    --------------------------------- */

    if (
        filtered.length === 0
    ) {

        showEmpty(
            "No Notifications",
            "You don't have any notifications matching your selection."
        );


        return;

    }


    hideEmpty();


    notificationList.innerHTML =
        filtered
            .map(
                createNotificationCard
            )
            .join("");


    /* ---------------------------------
       MARK READ BUTTONS
    --------------------------------- */

    notificationList
        .querySelectorAll(
            ".markReadButton"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        markNotificationAsRead(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


/* =====================================
   CREATE NOTIFICATION CARD
===================================== */

function createNotificationCard(
    item
) {

    const isRead =
        item.isRead === true;


    const priority =
        item.priority ||
        "normal";


    const type =
        item.type ||
        "notice";


    const icon =
        getNotificationIcon(
            type
        );


    const typeLabel =
        getTypeLabel(
            type
        );


    const priorityLabel =
        getPriorityLabel(
            priority
        );


    const date =
        formatDate(
            item.createdAt
        );


    const cardClass =
        [

            "notificationCard",

            isRead
                ? "read"
                : "unread",

            priority

        ]
        .join(" ");


    return `

        <article
            class="${cardClass}"
        >

            <div class="notificationTop">


                <div class="notificationTitleArea">


                    <div class="notificationIcon">

                        ${icon}

                    </div>


                    <div>

                        <div class="notificationTitle">

                            ${escapeHTML(
                                item.title ||
                                "Notification"
                            )}

                        </div>

                    </div>


                </div>


                <div class="notificationDate">

                    ${escapeHTML(
                        date
                    )}

                </div>


            </div>



            <div class="notificationMessage">

                ${escapeHTML(
                    item.message ||
                    ""
                )}

            </div>



            <div class="notificationBottom">


                <div class="notificationBadges">


                    <span class="typeBadge">

                        ${escapeHTML(
                            typeLabel
                        )}

                    </span>


                    ${priorityLabel}


                    ${
                        !isRead
                        ?
                        `
                        <span class="unreadBadge">
                            🔵 Unread
                        </span>
                        `
                        :
                        ""
                    }


                </div>


                ${
                    !isRead
                    ?
                    `
                    <button
                        type="button"
                        class="markReadButton"
                        data-id="${escapeHTML(
                            item.id
                        )}"
                    >

                        ✓ Mark as Read

                    </button>
                    `
                    :
                    ""
                }


            </div>


        </article>

    `;

}


/* =====================================
   MARK ONE AS READ
===================================== */

async function markNotificationAsRead(
    notificationId
) {

    if (!notificationId) {

        return;

    }


    try {

        const notificationRef =
            doc(
                db,
                NOTIFICATIONS_COLLECTION,
                notificationId
            );


        await updateDoc(
            notificationRef,
            {
                isRead: true
            }
        );


        /* ---------------------------------
           LOCAL UPDATE
        --------------------------------- */

        notifications =
            notifications.map(
                (item) => {

                    if (
                        item.id ===
                        notificationId
                    ) {

                        return {

                            ...item,

                            isRead: true

                        };

                    }


                    return item;

                }
            );


        updateSummary();

        renderNotifications();


    } catch (error) {

        console.error(
            "Mark read error:",
            error
        );


        alert(
            "Unable to update notification."
        );

    }

}


/* =====================================
   MARK ALL AS READ
===================================== */

async function markAllAsRead() {

    const unread =
        notifications.filter(
            (item) => {

                return (
                    item.isRead !== true
                );

            }
        );


    if (
        unread.length === 0
    ) {

        alert(
            "All notifications are already read."
        );

        return;

    }


    const confirmed =
        confirm(
            "Mark all notifications as read?"
        );


    if (!confirmed) {

        return;

    }


    try {

        if (markAllReadButton) {

            markAllReadButton.disabled =
                true;

            markAllReadButton.textContent =
                "⏳ Updating...";

        }


        const batch =
            writeBatch(
                db
            );


        unread.forEach(
            (item) => {

                const reference =
                    doc(
                        db,
                        NOTIFICATIONS_COLLECTION,
                        item.id
                    );


                batch.update(
                    reference,
                    {
                        isRead: true
                    }
                );

            }
        );


        await batch.commit();


        /* ---------------------------------
           LOCAL UPDATE
        --------------------------------- */

        notifications =
            notifications.map(
                (item) => {

                    return {

                        ...item,

                        isRead: true

                    };

                }
            );


        updateSummary();

        renderNotifications();


    } catch (error) {

        console.error(
            "Mark all read error:",
            error
        );


        alert(
            "Unable to mark all notifications as read."
        );


    } finally {

        if (markAllReadButton) {

            markAllReadButton.disabled =
                false;

            markAllReadButton.textContent =
                "✓ Mark All Read";

        }

    }

}


/* =====================================
   SUMMARY
===================================== */

function updateSummary() {

    const total =
        notifications.length;


    const unread =
        notifications.filter(
            (item) => {

                return (
                    item.isRead !== true
                );

            }
        ).length;


    const important =
        notifications.filter(
            (item) => {

                return (
                    item.priority ===
                    "important" ||

                    item.priority ===
                    "urgent"
                );

            }
        ).length;


    const today =
        notifications.filter(
            (item) => {

                return isToday(
                    item.createdAt
                );

            }
        ).length;


    setText(
        totalNotificationsEl,
        total
    );


    setText(
        unreadNotificationsEl,
        unread
    );


    setText(
        importantNotificationsEl,
        important
    );


    setText(
        todayNotificationsEl,
        today
    );

}


/* =====================================
   ICON
===================================== */

function getNotificationIcon(
    type
) {

    const icons = {

        notice: "📢",

        attendance: "📅",

        fee: "💰",

        homework: "📚",

        exam: "📝",

        transport: "🚌",

        leave: "📋",

        event: "🎉"

    };


    return (
        icons[type] ||
        "🔔"
    );

}


/* =====================================
   TYPE LABEL
===================================== */

function getTypeLabel(
    type
) {

    const labels = {

        notice:
            "General Notice",

        attendance:
            "Attendance",

        fee:
            "Fee Reminder",

        homework:
            "Homework",

        exam:
            "Exam / Result",

        transport:
            "Transport",

        leave:
            "Leave",

        event:
            "Event"

    };


    return (
        labels[type] ||
        type ||
        "Notification"
    );

}


/* =====================================
   PRIORITY LABEL
===================================== */

function getPriorityLabel(
    priority
) {

    if (
        priority ===
        "urgent"
    ) {

        return `

            <span
                class="priorityBadge urgent"
            >
                🚨 Urgent
            </span>

        `;

    }


    if (
        priority ===
        "important"
    ) {

        return `

            <span
                class="priorityBadge important"
            >
                Important
            </span>

        `;

    }


    return `

        <span
            class="priorityBadge normal"
        >
            Normal
        </span>

    `;

}


/* =====================================
   DATE
===================================== */

function formatDate(
    timestamp
) {

    const millis =
        getMillis(
            timestamp
        );


    if (!millis) {

        return "Just now";

    }


    const date =
        new Date(
            millis
        );


    return date.toLocaleString(
        "en-IN",
        {

            day: "2-digit",

            month: "short",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"

        }
    );

}


/* =====================================
   GET MILLIS
===================================== */

function getMillis(
    timestamp
) {

    if (!timestamp) {

        return 0;

    }


    if (
        typeof timestamp.toMillis ===
        "function"
    ) {

        return timestamp.toMillis();

    }


    if (
        typeof timestamp.toDate ===
        "function"
    ) {

        return timestamp
            .toDate()
            .getTime();

    }


    if (
        timestamp instanceof Date
    ) {

        return timestamp.getTime();

    }


    if (
        typeof timestamp ===
        "string"
    ) {

        const value =
            new Date(
                timestamp
            ).getTime();


        return isNaN(value)
            ? 0
            : value;

    }


    return 0;

}


/* =====================================
   TODAY
===================================== */

function isToday(
    timestamp
) {

    const millis =
        getMillis(
            timestamp
        );


    if (!millis) {

        return false;

    }


    const date =
        new Date(
            millis
        );


    const today =
        new Date();


    return (

        date.getDate() ===
            today.getDate()

        &&

        date.getMonth() ===
            today.getMonth()

        &&

        date.getFullYear() ===
            today.getFullYear()

    );

}


/* =====================================
   LOADING
===================================== */

function showLoading() {

    if (loadingCard) {

        loadingCard.style.display =
            "block";

    }


    if (emptyCard) {

        emptyCard.style.display =
            "none";

    }

}


function hideLoading() {

    if (loadingCard) {

        loadingCard.style.display =
            "none";

    }

}


/* =====================================
   EMPTY
===================================== */

function showEmpty(
    title,
    message
) {

    hideLoading();


    if (!emptyCard) {

        return;

    }


    emptyCard.style.display =
        "block";


    const titleElement =
        emptyCard.querySelector(
            "h2"
        );


    const messageElement =
        emptyCard.querySelector(
            "p"
        );


    if (
        titleElement
    ) {

        titleElement.textContent =
            title;

    }


    if (
        messageElement
    ) {

        messageElement.textContent =
            message;

    }

}


function hideEmpty() {

    if (emptyCard) {

        emptyCard.style.display =
            "none";

    }

}


/* =====================================
   SAFE TEXT
===================================== */

function setText(
    element,
    value
) {

    if (!element) {

        return;

    }


    element.textContent =
        value ?? "0";

}


/* =====================================
   ESCAPE HTML
===================================== */

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


/* =====================================
   FINAL
===================================== */

console.log(
    "Parent Notifications JS Loaded Successfully"
);
