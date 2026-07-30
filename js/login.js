import { db } from "../firebase.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// =====================================
// Login Function
// =====================================

window.loginUser = async function () {

    let loginId = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const selectedRole = document.getElementById("role").value;

    if (loginId === "" || password === "") {
        alert("Please enter Login ID and Password");
        return;
    }

    try {

        let user = null;

        // =====================================
        // Parent Login (EMIS)
        // =====================================

        if (selectedRole === "Parent") {

            const parentQuery = query(
                collection(db, "users"),
                where("emis", "==", loginId),
                where("role", "==", "Parent")
            );

            const parentSnap = await getDocs(parentQuery);

            if (parentSnap.empty) {
                alert("Parent not found");
                return;
            }

            user = parentSnap.docs[0].data();

            if (user.password !== password) {
                alert("Invalid Password");
                return;
            }

            localStorage.setItem("parentEMIS", user.emis || "");
            localStorage.setItem("emis", user.emis || "");
            localStorage.setItem("userRole", "Parent");

            sessionStorage.setItem("parentEMIS", user.emis || "");
            sessionStorage.setItem("emis", user.emis || "");

            window.location.href = "parent_dashboard.html";
            return;
        }
        // =====================================
        // Teacher Login (Teacher ID)
        // =====================================

        if (selectedRole === "Teacher") {

            const teacherQuery = query(
                collection(db, "teachers"),
                where("id", "==", loginId)
            );

            const teacherSnap = await getDocs(teacherQuery);

            if (teacherSnap.empty) {
                alert("Teacher ID not found.");
                return;
            }

            const teacherDoc = teacherSnap.docs[0];
            const teacher = teacherDoc.data();

            // Check Password
            if (teacher.password !== password) {
                alert("Invalid Password");
                return;
            }

            // Save Teacher Session
            localStorage.setItem("teacherDocId", teacherDoc.id);
            localStorage.setItem("teacherId", teacher.id || "");
            localStorage.setItem("teacherName", teacher.name || "");
            localStorage.setItem("teacherType", teacher.teacherType || "");
            localStorage.setItem("teacherClass", teacher.className || "");
            localStorage.setItem("teacherSection", teacher.section || "");
            localStorage.setItem("teacherSubject", teacher.subject || "");
            localStorage.setItem("userRole", "Teacher");

            window.location.href = "teacher.html";
            return;
        }

        // ===== Part 3 starts here =====
          // =====================================
        // Admin / Headmaster Login (Email)
        // =====================================

        if (selectedRole === "Admin" || selectedRole === "Headmaster") {

            const userRef = doc(db, "users", loginId);

            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                alert(selectedRole + " account not found.");
                return;
            }

            const user = userSnap.data();

            // Check Password
            if (user.password !== password) {
                alert("Invalid Password");
                return;
            }

            // Check Role
            if (user.role !== selectedRole) {
                alert("Selected Role is Incorrect");
                return;
            }

            if (selectedRole === "Admin") {

                localStorage.setItem("userRole", "Admin");
                localStorage.setItem("userEmail", loginId);

                window.location.href = "admin_dashboard.html";
                return;
            }

            if (selectedRole === "Headmaster") {

                localStorage.setItem("userRole", "Headmaster");
                localStorage.setItem("userEmail", loginId);

                window.location.href = "headmaster.html";
                return;
            }
        }

        alert("Invalid User Role");

    } catch (error) {

        console.error(error);
        alert("Login Failed\n\n" + error.message);

    }

};
