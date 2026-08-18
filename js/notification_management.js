/* =====================================
   School Connect TN
   Notification Management
   Firebase Integration
===================================== */

import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


/* =====================================
   COLLECTION
===================================== */

const NOTIFICATIONS_COLLECTION =
    "notifications";


/* =====================================
   ELEMENTS
===================================== */

const form =
    document.getElementById(
        "notificationForm"
    );

const titleInput =
    document.getElementById(
        "notificationTitle"
    );

const typeSelect =
    document.getElementById(
        "notificationType"
    );

const targetSelect =
    document.getElementById(
        "notificationTarget"
    );

const emisGroup =
    document.getElementById(
        "emisGroup"
    );

const targetEMIS =
    document.getElementById(
        "targetEMIS"
    );

const prioritySelect =
    document.getElementById(
        "notificationPriority"
    );

const messageInput =
    document.getElementById(
        "notificationMessage"
    );

const sendButton =
    document.getElementById(
        "sendNotificationButton"
    );

const clearButton =
    document.getElementById(
        "clearNotificationButton"
    );

const searchInput =
    document.getElementById(
        "notificationSearch"
    );

const filterSelect =
    document.getElementById(
        "notificationFilter"
    );

const tableBody =
    document.getElementById(
        "notificationTableBody"
    );


/* =====================================
   SUMMARY ELEMENTS
===================================== */

const totalNotificationsEl =
    document.getElementById(
        "totalNotifications"
    );

const parentNotificationsEl =
    document.getElementById(
        "parentNotifications"
    );

const unreadNotificationsEl =
    document.getElementById(
        "unreadNotifications"
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
            "Notification Management"
        );

        console.log(
            "====================================="
        );


        setupEvents();

        loadNotifications();

    }
);


/* =====================================
   EVENTS
===================================== */

function setupEvents() {


    /* ---------------------------------
       TARGET CHANGE
    --------------------------------- */

    if (targetSelect) {

        targetSelect.addEventListener(
            "change",
            handleTargetChange
        );

    }


    /* ---------------------------------
       FORM SUBMIT
    --------------------------------- */

    if (form) {

        form.addEventListener(
            "submit",
            handleSubmit
        );

    }


    /* ---------------------------------
       CLEAR
    --------------------------------- */

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearForm
        );

    }


    /* ---------------------------------
       SEARCH
    --------------------------------- */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderNotifications
        );

    }


    /* ---------------------------------
       FILTER
    --------------------------------- */

    if (filterSelect) {

        filterSelect.addEventListener(
            "change",
            renderNotifications
        );

    }

}


/* =====================================
   TARGET CHANGE
===================================== */

function handleTargetChange() {

    if (!emisGroup) {
        return;
    }


    if (
        targetSelect.value === "parent"
    ) {

        emisGroup.style.display =
            "flex";

        if (targetEMIS) {

            targetEMIS.required =
                true;

        }

    } else {

        emisGroup.style.display =
            "none";

        if (targetEMIS) {

            targetEMIS.required =
                false;

            targetEMIS.value =
                "";

        }

    }

}


/* =====================================
   CREATE NOTIFICATION
===================================== */

async function handleSubmit(
    event
) {

    event.preventDefault();


    try {

        const title =
            titleInput.value.trim();

        const type =
            typeSelect.value;

        const target =
            targetSelect.value;

        const emis =
            targetEMIS
                ? targetEMIS.value.trim()
                : "";

        const priority =
            prioritySelect.value;

        const message =
            messageInput.value.trim();


        /* ---------------------------------
           VALIDATION
        --------------------------------- */

        if (!title) {

            alert(
                "Please enter notification title."
            );

            titleInput.focus();

            return;

        }


        if (!type) {

            alert(
                "Please select notification type."
            );

            typeSelect.focus();

            return;

        }


        if (!target) {

            alert(
                "Please select notification target."
            );

            targetSelect.focus();

            return;

        }


        if (
            target === "parent" &&
            !emis
        ) {

            alert(
                "Please enter Student EMIS Number."
            );

            targetEMIS.focus();

            return;

        }


        if (!message) {

            alert(
                "Please enter notification message."
            );

            messageInput.focus();

            return;

        }


        /* ---------------------------------
           DISABLE BUTTON
        --------------------------------- */

        setButtonLoading(
            true
        );


        /* ---------------------------------
           TARGET DATA
        --------------------------------- */

        let targetType =
            target;

        let targetEMISValue =
            null;


        if (
            target === "parent"
        ) {

            targetEMISValue =
                emis;

        }


        /* ---------------------------------
           NOTIFICATION DATA
        --------------------------------- */

        const notificationData = {

            title: title,

            message: message,

            type: type,

            target: targetType,

            targetEMIS: targetEMISValue,

            priority: priority,

            isRead: false,

            status: "active",

            createdBy: "Administrator",

            createdAt:
                serverTimestamp()

        };


        console.log(
            "Saving notification:",
            notificationData
        );


        /* ---------------------------------
           SAVE FIREBASE
        --------------------------------- */

        const notificationRef =
            await addDoc(
                collection(
                    db,
                    NOTIFICATIONS_COLLECTION
                ),
                notificationData
            );


        console.log(
            "Notification saved:",
            notificationRef.id
        );


        alert(
            "Notification sent successfully."
        );


        /* ---------------------------------
           CLEAR FORM
        --------------------------------- */

        clearForm();


        /* ---------------------------------
           RELOAD
        --------------------------------- */

        await loadNotifications();


    } catch (error) {

        console.error(
            "Notification save error:",
            error
        );


        alert(
            "Unable to save notification.\n\n" +
            error.message
        );


    } finally {

        setButtonLoading(
            false
        );

    }

}


/* =====================================
   LOAD NOTIFICATIONS
===================================== */

async function loadNotifications() {

    try {

        showTableMessage(
            "Loading notifications..."
        );


        const notificationsRef =
            collection(
                db,
                NOTIFICATIONS_COLLECTION
            );


        /*
         * We intentionally avoid requiring
         * a Firestore composite index.
         *
         * Data is loaded normally and
         * sorted in JavaScript.
         */

        const snapshot =
            await getDocs(
                notificationsRef
            );


        notifications = [];


        snapshot.forEach(
            (item) => {

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

                return getMillis(
                    b.createdAt
                ) -
                getMillis(
                    a.createdAt
                );

            }
        );


        console.log(
            "Notifications loaded:",
            notifications.length
        );


        updateSummary();


        renderNotifications();


    } catch (error) {

        console.error(
            "Notification loading error:",
            error
        );


        showTableMessage(
            "Unable to load notifications."
        );

    }

}


/* =====================================
   RENDER
===================================== */

function renderNotifications() {

    if (!tableBody) {
        return;
    }


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filterType =
        filterSelect
            ? filterSelect.value
            : "all";


    let filtered =
        notifications.filter(
            (item) => {


                /* -------------------------
                   SEARCH
                ------------------------- */

                const searchable =
                    [

                        item.title,

                        item.message,

                        item.type,

                        item.target,

                        item.targetEMIS

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


                /* -------------------------
                   TYPE FILTER
                ------------------------- */

                if (
                    filterType !== "all" &&
                    item.type !== filterType
                ) {

                    return false;

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

        showTableMessage(
            "No notifications found."
        );

        return;

    }


    tableBody.innerHTML =
        filtered
            .map(
                createTableRow
            )
            .join("");


    /* ---------------------------------
       DELETE BUTTON EVENTS
    --------------------------------- */

    tableBody
        .querySelectorAll(
            ".deleteButton"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteNotification(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


/* =====================================
   CREATE TABLE ROW
===================================== */

function createTableRow(
    item
) {

    const date =
        formatDate(
            item.createdAt
        );


    const typeLabel =
        getTypeLabel(
            item.type
        );


    const targetLabel =
        getTargetLabel(
            item.target,
            item.targetEMIS
        );


    const priorityLabel =
        getPriorityLabel(
            item.priority
        );


    const status =
        item.status ||
        "active";


    return `

        <tr>

            <td>
                ${escapeHTML(date)}
            </td>


            <td>

                <strong>
                    ${escapeHTML(
                        item.title || "-"
                    )}
                </strong>

                <br>

                <small>
                    ${escapeHTML(
                        item.message || ""
                    )}
                </small>

            </td>


            <td>

                <span class="typeBadge">

                    ${escapeHTML(
                        typeLabel
                    )}

                </span>

            </td>


            <td>

                ${escapeHTML(
                    targetLabel
                )}

            </td>


            <td>

                ${priorityLabel}

            </td>


            <td>

                <span class="statusBadge">

                    ${escapeHTML(
                        capitalize(status)
                    )}

                </span>

            </td>


            <td>

                <button
                    type="button"
                    class="deleteButton"
                    data-id="${escapeHTML(
                        item.id
                    )}"
                >

                    🗑️ Delete

                </button>

            </td>

        </tr>

    `;

}


/* =====================================
   DELETE
===================================== */

async function deleteNotification(
    notificationId
) {

    if (!notificationId) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this notification?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                NOTIFICATIONS_COLLECTION,
                notificationId
            )
        );


        alert(
            "Notification deleted successfully."
        );


        await loadNotifications();


    } catch (error) {

        console.error(
            "Delete notification error:",
            error
        );


        alert(
            "Unable to delete notification.\n\n" +
            error.message
        );

    }

}


/* =====================================
   SUMMARY
===================================== */

function updateSummary() {

    const total =
        notifications.length;


    const parents =
        notifications.filter(
            (item) => {

                return (
                    item.target ===
                        "parent" ||

                    item.target ===
                        "all_parents"
                );

            }
        ).length;


    const unread =
        notifications.filter(
            (item) => {

                return item.isRead === false;

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
        parentNotificationsEl,
        parents
    );


    setText(
        unreadNotificationsEl,
        unread
    );


    setText(
        todayNotificationsEl,
        today
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
            "📢 Notice",

        attendance:
            "📅 Attendance",

        fee:
            "💰 Fee",

        homework:
            "📚 Homework",

        exam:
            "📝 Exam",

        transport:
            "🚌 Transport",

        leave:
            "📋 Leave",

        event:
            "🎉 Event"

    };


    return (
        labels[type] ||
        type ||
        "-"
    );

}


/* =====================================
   TARGET LABEL
===================================== */

function getTargetLabel(
    target,
    emis
) {

    if (
        target ===
        "all_parents"
    ) {

        return "👨‍👩‍👧 All Parents";

    }


    if (
        target ===
        "parent"
    ) {

        return (
            "👤 Parent<br>" +
            "<small>EMIS: " +
            escapeHTML(
                emis || "-"
            ) +
            "</small>"
        );

    }


    if (
        target ===
        "all_teachers"
    ) {

        return "👩‍🏫 All Teachers";

    }


    return target || "-";

}


/* =====================================
   PRIORITY LABEL
===================================== */

function getPriorityLabel(
    priority
) {

    const value =
        priority ||
        "normal";


    if (
        value === "urgent"
    ) {

        return `
            <span class="priorityBadge priority-urgent">
                🚨 Urgent
            </span>
        `;

    }


    if (
        value === "important"
    ) {

        return `
            <span class="priorityBadge priority-important">
                Important
            </span>
        `;

    }


    return `
        <span class="priorityBadge priority-normal">
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
        typeof timestamp === "string"
    ) {

        const time =
            new Date(
                timestamp
            ).getTime();


        return isNaN(time)
            ? 0
            : time;

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
            today.getDate() &&

        date.getMonth() ===
            today.getMonth() &&

        date.getFullYear() ===
            today.getFullYear()
    );

}


/* =====================================
   CLEAR FORM
===================================== */

function clearForm() {

    if (form) {

        form.reset();

    }


    if (emisGroup) {

        emisGroup.style.display =
            "none";

    }


    if (targetEMIS) {

        targetEMIS.required =
            false;

        targetEMIS.value =
            "";

    }

}


/* =====================================
   BUTTON LOADING
===================================== */

function setButtonLoading(
    loading
) {

    if (!sendButton) {
        return;
    }


    if (loading) {

        sendButton.disabled =
            true;

        sendButton.dataset.originalText =
            sendButton.innerHTML;

        sendButton.innerHTML =
            "⏳ Sending...";

    } else {

        sendButton.disabled =
            false;

        sendButton.innerHTML =
            sendButton.dataset.originalText ||
            "🔔 Send Notification";

    }

}


/* =====================================
   TABLE MESSAGE
===================================== */

function showTableMessage(
    message
) {

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="emptyTable"
            >

                ${escapeHTML(
                    message
                )}

            </td>

        </tr>

    `;

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
   CAPITALIZE
===================================== */

function capitalize(
    value
) {

    if (!value) {
        return "-";
    }


    return (
        String(value)
            .charAt(0)
            .toUpperCase() +
        String(value)
            .slice(1)
    );

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
    "Notification Management JS Loaded Successfully"
);
