//==========================================
// School Connect TN
// Homework Management
// Production Version V3
// Developed by VTOOS Software Solutions
//==========================================

import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    writeBatch,
    limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


//==========================================
// DOM Elements
//==========================================

const saveBtn =
    document.getElementById("saveHomework");

const homeworkList =
    document.getElementById("homeworkList");


//==========================================
// Global Variables
//==========================================

let teacherId = "";

let teacher = {};


//==========================================
// DOM Ready
//==========================================

window.addEventListener(
    "DOMContentLoaded",
    initialize
);


//==========================================
// Initialize
//==========================================

async function initialize() {

    try {

        // ----------------------------------
        // Get Teacher ID
        // ----------------------------------

        teacherId =
            localStorage.getItem("teacherId") ||
            sessionStorage.getItem("teacherId") ||
            "";


        console.log(
            "Teacher ID:",
            teacherId
        );


        // ----------------------------------
        // Session Check
        // ----------------------------------

        if (!teacherId) {

            alert("Session Expired");

            location.href =
                "index.html";

            return;

        }


        // ----------------------------------
        // Load Teacher Profile
        // ----------------------------------

        let teacherSnap = null;


        // First try document ID

        const directTeacherRef =
            doc(
                db,
                "teachers",
                teacherId
            );


        const directTeacherSnap =
            await getDoc(
                directTeacherRef
            );


        if (
            directTeacherSnap.exists()
        ) {

            teacherSnap =
                directTeacherSnap;

        }


        // ----------------------------------
        // If not found, search teacherId
        // field
        // ----------------------------------

        if (!teacherSnap) {

            const teacherQuery =
                query(
                    collection(
                        db,
                        "teachers"
                    ),
                    where(
                        "teacherId",
                        "==",
                        teacherId
                    ),
                    limit(1)
                );


            const teacherResult =
                await getDocs(
                    teacherQuery
                );


            if (
                !teacherResult.empty
            ) {

                teacherSnap =
                    teacherResult.docs[0];

            }

        }


        // ----------------------------------
        // Teacher Not Found
        // ----------------------------------

        if (!teacherSnap) {

            console.error(
                "Teacher profile not found:",
                teacherId
            );

            alert(
                "Teacher Profile Not Found"
            );

            return;

        }


        // ----------------------------------
        // Teacher Data
        // ----------------------------------

        teacher =
            teacherSnap.data();


        console.log(
            "Teacher Profile:",
            teacher
        );


        // ----------------------------------
        // Save actual Firestore ID
        // ----------------------------------

        localStorage.setItem(
            "teacherDocId",
            teacherSnap.id
        );

        sessionStorage.setItem(
            "teacherDocId",
            teacherSnap.id
        );


        // ----------------------------------
        // Load Homework
        // ----------------------------------

        await loadHomework();


    }
    catch (error) {

        console.error(
            "Homework Initialize Error:",
            error
        );

        alert(
            "Unable to load Homework Management.\n\n" +
            error.message
        );

    }

}


//==========================================
// Load Homework List
//==========================================

async function loadHomework() {

    try {

        if (!homeworkList) {

            console.error(
                "homeworkList element not found"
            );

            return;

        }


        homeworkList.innerHTML =
            "Loading Homework...";


        // ----------------------------------
        // Query Active Homework
        // ----------------------------------

        const homeworkQuery =
            query(
                collection(
                    db,
                    "homework"
                ),
                where(
                    "teacherId",
                    "==",
                    teacherId
                ),
                where(
                    "status",
                    "==",
                    "Active"
                )
            );


        const homeworkSnap =
            await getDocs(
                homeworkQuery
            );


        // ----------------------------------
        // Empty
        // ----------------------------------

        if (
            homeworkSnap.empty
        ) {

            homeworkList.innerHTML = `
                <div class="emptyHomework">
                    📚 No Active Homework
                </div>
            `;

            return;

        }


        // ----------------------------------
        // Build List
        // ----------------------------------

        homeworkList.innerHTML = "";


        homeworkSnap.forEach(
            (docSnap) => {

                const hw =
                    docSnap.data();


                const title =
                    hw.title ||
                    "Untitled Homework";


                const description =
                    hw.description ||
                    "";


                const className =
                    hw.class ||
                    hw.className ||
                    "-";


                const section =
                    hw.section ||
                    "";


                const subject =
                    hw.subject ||
                    "-";


                const dueDate =
                    hw.dueDate ||
                    "-";


                const teacherName =
                    hw.teacherName ||
                    teacher.name ||
                    "-";


                homeworkList.innerHTML += `
                    <div class="homeworkCard">

                        <h3>
                            📚 ${escapeHTML(title)}
                        </h3>

                        <p>
                            ${escapeHTML(description)}
                        </p>

                        <div class="homeworkInfo">

                            <span>
                                🏫 Class:
                                <b>
                                    ${escapeHTML(
                                        className
                                    )}
                                    ${escapeHTML(
                                        section
                                    )}
                                </b>
                            </span>

                            <span>
                                📖 Subject:
                                <b>
                                    ${escapeHTML(
                                        subject
                                    )}
                                </b>
                            </span>

                            <span>
                                📅 Due:
                                <b>
                                    ${escapeHTML(
                                        dueDate
                                    )}
                                </b>
                            </span>

                            <span>
                                👨‍🏫 Teacher:
                                <b>
                                    ${escapeHTML(
                                        teacherName
                                    )}
                                </b>
                            </span>

                        </div>

                        <button
                            class="deleteBtn"
                            onclick="deleteHomework('${docSnap.id}')"
                        >
                            🗑️ Delete
                        </button>

                    </div>
                `;

            }
        );

    }
    catch (error) {

        console.error(
            "Homework Load Error:",
            error
        );


        if (homeworkList) {

            homeworkList.innerHTML = `
                <div class="errorMessage">
                    ❌ Unable to load Homework
                    <br>
                    <small>
                        ${escapeHTML(
                            error.message
                        )}
                    </small>
                </div>
            `;

        }

    }

}


//==========================================
// Delete Homework
//==========================================

window.deleteHomework =
    async function(id) {

        const ok =
            confirm(
                "Delete this Homework?"
            );


        if (!ok) {

            return;

        }


        try {

            await deleteDoc(
                doc(
                    db,
                    "homework",
                    id
                )
            );


            alert(
                "✅ Homework Deleted"
            );


            await loadHomework();

        }
        catch (error) {

            console.error(
                "Delete Homework Error:",
                error
            );


            alert(
                "Unable to Delete Homework.\n\n" +
                error.message
            );

        }

    };


//==========================================
// Save Homework
//==========================================

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        saveHomework
    );

}


//==========================================
// Save Homework Function
//==========================================

async function saveHomework() {

    const title =
        document
            .getElementById(
                "homeworkTitle"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "homeworkDescription"
            )
            .value
            .trim();


    const className =
        document
            .getElementById("class")
            .value;


    const section =
        document
            .getElementById("section")
            .value;


    const subject =
        document
            .getElementById("subject")
            .value;


    const dueDate =
        document
            .getElementById("dueDate")
            .value;


    const status =
        document
            .getElementById("status")
            .value;


    // ----------------------------------
    // Validation
    // ----------------------------------

    if (
        !title ||
        !description ||
        !className ||
        !section ||
        !subject ||
        !dueDate
    ) {

        alert(
            "Please fill all fields"
        );

        return;

    }


    if (!teacherId) {

        alert(
            "Teacher session not found."
        );

        return;

    }


    try {

        saveBtn.disabled = true;

        saveBtn.textContent =
            "⏳ Saving Homework...";


        //==================================
        // Create Homework
        //==================================

        const homeworkRef =
            await addDoc(
                collection(
                    db,
                    "homework"
                ),
                {

                    title:
                        title,

                    description:
                        description,

                    class:
                        className,

                    section:
                        section,

                    subject:
                        subject,

                    dueDate:
                        dueDate,

                    teacherId:
                        teacherId,

                    teacherName:
                        teacher.name ||
                        teacher.teacherName ||
                        "",

                    teacherType:
                        teacher.teacherType ||
                        "",

                    status:
                        status,

                    createdAt:
                        new Date()
                            .toISOString(),

                    updatedAt:
                        new Date()
                            .toISOString()

                }
            );


        //==================================
        // Find Students
        //==================================

        const studentQuery =
            query(
                collection(
                    db,
                    "students"
                ),
                where(
                    "class",
                    "==",
                    className
                ),
                where(
                    "section",
                    "==",
                    section
                )
            );


        const studentSnap =
            await getDocs(
                studentQuery
            );


        //==================================
        // Create Submission Records
        //==================================

        if (
            !studentSnap.empty
        ) {

            const batch =
                writeBatch(db);


            studentSnap.forEach(
                (studentDoc) => {

                    const student =
                        studentDoc.data();


                    const submissionRef =
                        doc(
                            collection(
                                db,
                                "homework_submissions"
                            )
                        );


                    batch.set(
                        submissionRef,
                        {

                            homeworkId:
                                homeworkRef.id,

                            title:
                                title,

                            description:
                                description,

                            className:
                                className,

                            section:
                                section,

                            subject:
                                subject,

                            dueDate:
                                dueDate,

                            teacherId:
                                teacherId,

                            teacherName:
                                teacher.name ||
                                teacher.teacherName ||
                                "",

                            studentName:
                                student.name ||
                                student.studentName ||
                                "",

                            emis:
                                student.emis ||
                                "",

                            class:
                                className,

                            status:
                                "Pending",

                            completedBy:
                                "",

                            parentComment:
                                "",

                            completedTime:
                                null,

                            createdAt:
                                new Date()
                                    .toISOString(),

                            updatedAt:
                                new Date()
                                    .toISOString()

                        }
                    );

                }
            );


            await batch.commit();

        }


        //==================================
        // Success
        //==================================

        alert(
            "✅ Homework Saved Successfully"
        );


        //==================================
        // Clear Form
        //==================================

        document
            .getElementById(
                "homeworkTitle"
            )
            .value = "";


        document
            .getElementById(
                "homeworkDescription"
            )
            .value = "";


        document
            .getElementById(
                "class"
            )
            .value = "";


        document
            .getElementById(
                "section"
            )
            .value = "";


        document
            .getElementById(
                "subject"
            )
            .value = "";


        document
            .getElementById(
                "dueDate"
            )
            .value = "";


        document
            .getElementById(
                "status"
            )
            .value = "Active";


        //==================================
        // Reload
        //==================================

        await loadHomework();

    }
    catch (error) {

        console.error(
            "Save Homework Error:",
            error
        );


        alert(
            "Unable to Save Homework.\n\n" +
            error.message
        );

    }
    finally {

        saveBtn.disabled =
            false;

        saveBtn.textContent =
            "💾 Save Homework";

    }

}


//==========================================
// HTML Safety
//==========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
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


//==========================================
// Auto Refresh
//==========================================

setInterval(
    async () => {

        try {

            if (teacherId) {

                await loadHomework();

            }

        }
        catch (error) {

            console.log(
                "Homework Refresh Failed:",
                error
            );

        }

    },
    60000
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
    "Homework Management"
);

console.log(
    "Production Version V3"
);

console.log(
    "Firebase Connected"
);

console.log(
    "================================"
);


//==========================================
// Global Error Handler
//==========================================

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
