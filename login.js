import { db } from "../firebase.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//======================================
// Enter Key Login
//======================================

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("password")
    ?.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {

            loginUser();

        }

    });

});

//======================================
// Login Function
//======================================

window.loginUser = async function () {

    const loginBtn =
    document.querySelector(".loginBtn");

    const msg =
    document.getElementById("msg");

    const remember =
    document.getElementById("remember").checked;

    let loginId =
    document.getElementById("email")
    .value
    .trim();

    const password =
    document.getElementById("password")
    .value
    .trim();

    const selectedRole =
    document.getElementById("role")
    .value;

    msg.innerHTML = "";

    if (
        loginId === "" ||
        password === ""
    ) {

        msg.innerHTML =
        "Please enter Login ID and Password";

        return;

    }

    loginBtn.disabled = true;

    loginBtn.innerHTML =
    "⏳ Signing In...";

    try {

        //======================================
        // Parent Login
        //======================================

        if (selectedRole === "Parent") {

            const userRef = doc(

                db,

                "users",

                loginId +
                "@schoolconnecttn.app"

            );

            const userSnap =
            await getDoc(userRef);

            if (!userSnap.exists()) {

                throw new Error(
                    "Parent account not found."
                );

            }

            const user =
            userSnap.data();

            if (
                user.password !== password
            ) {

                throw new Error(
                    "Invalid Password"
                );

            }

            if (remember) {

                localStorage.setItem(
                    "rememberLogin",
                    loginId
                );

            }

            localStorage.setItem(
                "parentEMIS",
                user.emis || ""
            );

            localStorage.setItem(
                "emis",
                user.emis || ""
            );

            localStorage.setItem(
                "userRole",
                "Parent"
            );

            sessionStorage.setItem(
                "parentEMIS",
                user.emis || ""
            );

            sessionStorage.setItem(
                "emis",
                user.emis || ""
            );

            msg.style.color =
            "#2E7D32";

            msg.innerHTML =
            "✅ Login Successful...";

            setTimeout(() => {

                window.location.href =
                "parent.html";

            }, 800);

            return;

        }

        //======== CONTINUE PART 2 =========
            //======================================
        // Teacher Login
        //======================================

        if (selectedRole === "Teacher") {

            const teacherQuery = query(
                collection(db, "teachers"),
                where("id", "==", loginId)
            );

            const teacherSnap = await getDocs(teacherQuery);

            if (teacherSnap.empty) {

                throw new Error("Teacher ID not found.");

            }

            const teacherDoc = teacherSnap.docs[0];
            const teacher = teacherDoc.data();

            if (teacher.password !== password) {

                throw new Error("Invalid Password");

            }

            if (remember) {

                localStorage.setItem(
                    "rememberLogin",
                    loginId
                );

            }

            localStorage.setItem("teacherDocId", teacherDoc.id);
            localStorage.setItem("teacherId", teacher.id || "");
            localStorage.setItem("teacherName", teacher.name || "");
            localStorage.setItem("teacherType", teacher.teacherType || "");
            localStorage.setItem("teacherClass", teacher.className || "");
            localStorage.setItem("teacherSection", teacher.section || "");
            localStorage.setItem("teacherSubject", teacher.subject || "");
            localStorage.setItem("userRole", "Teacher");

            msg.style.color = "#2E7D32";
            msg.innerHTML = "✅ Login Successful...";

            setTimeout(() => {

                window.location.href = "teacher.html";

            }, 800);

            return;

        }

        //======================================
        // Student Login
        //======================================

        if (selectedRole === "Student") {

            const userRef = doc(
                db,
                "users",
                loginId + "@student.schoolconnecttn.app"
            );

            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {

                throw new Error("Student account not found.");

            }

            const user = userSnap.data();

            if (user.password !== password) {

                throw new Error("Invalid Password");

            }

            if (remember) {

                localStorage.setItem(
                    "rememberLogin",
                    loginId
                );

            }

            localStorage.setItem("studentEMIS", user.emis || "");
            localStorage.setItem("emis", user.emis || "");
            localStorage.setItem("userRole", "Student");

            sessionStorage.setItem("studentEMIS", user.emis || "");

            msg.style.color = "#2E7D32";
            msg.innerHTML = "✅ Login Successful...";

            setTimeout(() => {

                window.location.href = "student.html";

            }, 800);

            return;

        }

        //========= CONTINUE PART 3 =========
            //======================================
        // Admin / Headmaster Login
        //======================================

        if (
            selectedRole === "Admin" ||
            selectedRole === "Headmaster"
        ) {

            const userRef = doc(
                db,
                "users",
                loginId
            );

            const userSnap =
            await getDoc(userRef);

            if (!userSnap.exists()) {

                throw new Error(
                    selectedRole +
                    " account not found."
                );

            }

            const user =
            userSnap.data();

            if (
                user.password !== password
            ) {

                throw new Error(
                    "Invalid Password"
                );

            }

            if (
                user.role !== selectedRole
            ) {

                throw new Error(
                    "Selected Role is Incorrect"
                );

            }

            if (remember) {

                localStorage.setItem(
                    "rememberLogin",
                    loginId
                );

            }

            localStorage.setItem(
                "userRole",
                selectedRole
            );

            localStorage.setItem(
                "userEmail",
                loginId
            );

            msg.style.color =
            "#2E7D32";

            msg.innerHTML =
            "✅ Login Successful...";

            setTimeout(() => {

                if (
                    selectedRole === "Admin"
                ) {

                    window.location.href =
                    "admin_dashboard.html";

                } else {

                    window.location.href =
                    "headmaster.html";

                }

            },800);

            return;

        }

        throw new Error(
            "Invalid User Role"
        );

    } catch(error){

        console.error(error);

        msg.style.color="#D32F2F";

        msg.innerHTML=error.message;

    } finally{

        loginBtn.disabled=false;

        loginBtn.innerHTML=
        "🚀 LOGIN TO DASHBOARD";

    }

};

//======================================
// Auto Fill Remember Login
//======================================

window.addEventListener(
"DOMContentLoaded",
()=>{

const savedLogin=
localStorage.getItem(
"rememberLogin"
);

if(savedLogin){

document.getElementById("email").value=
savedLogin;

document.getElementById("remember").checked=true;

}

});
