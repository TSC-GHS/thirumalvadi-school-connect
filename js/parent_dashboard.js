//==========================================
// School Connect TN
// Parent Dashboard
// Part 1
//==========================================

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
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const emis = localStorage.getItem("parentEMIS");

if (!emis) {

    alert("Session Expired");

    location.href = "login.html";

}

async function loadDashboard() {

    try {

        const studentRef = doc(db, "students", emis);

        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {

            alert("Student Record Not Found");

            return;

        }

        const student = studentSnap.data();

        document.getElementById("studentName").textContent =
            student.name || "-";

        document.getElementById("studentEMIS").textContent =
            student.emis || emis;

        document.getElementById("studentClass").textContent =
            student.class || "-";

        document.getElementById("studentSection").textContent =
            student.section || "-";

        document.getElementById("attendancePercent").textContent =
            student.attendance || "0%";

        if (student.photo && student.photo !== "") {

            document.getElementById("studentPhoto").src =
                student.photo;

        }

        await loadHomework(student.class);

        await loadNotice();

        await loadMarks();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}
//==========================================
// School Connect TN
// Parent Dashboard
// Part 2 (Final)
//==========================================

async function loadHomework(studentClass){

    try{

        const snap = await getDocs(collection(db,"homework"));

        let html = "";
        let count = 0;

        snap.forEach((docSnap)=>{

            const hw = docSnap.data();

            if(
                hw.className === studentClass &&
                (hw.status === "Active" || hw.status === true)
            ){

                count++;

                html += `
                <div class="homework-item">

                    <div class="homework-sub">
                        Homework
                    </div>

                    <div>${hw.homework || "-"}</div>

                    <small>Due : ${hw.dueDate || "-"}</small>

                </div>
                `;

            }

        });

        document.getElementById("homeworkCount").textContent = count;

        document.getElementById("todayHomework").innerHTML =
        count > 0
        ? html
        : "<p>No Homework Available</p>";

    }catch(error){

        console.log(error);

        document.getElementById("todayHomework").innerHTML =
        "<p>Unable to Load Homework</p>";

    }

}

async function loadNotice(){

    try{

        const q = query(
            collection(db,"notices"),
            orderBy("createdAt","desc"),
            limit(3)
        );

        const snap = await getDocs(q);

        let html = "";
        let count = 0;

        snap.forEach((docSnap)=>{

            const notice = docSnap.data();

            count++;

            html += `
            <div class="notice-item">

                <div class="notice-title">
                    ${notice.title || "Notice"}
                </div>

                <div>
                    ${notice.description || "-"}
                </div>

            </div>
            `;

        });

        document.getElementById("noticeCount").textContent = count;

        document.getElementById("latestNotice").innerHTML =
        count > 0
        ? html
        : "<p>No Notice Available</p>";

    }catch(error){

        console.log(error);

        document.getElementById("latestNotice").innerHTML =
        "<p>Unable to Load Notice</p>";

    }

}

async function loadMarks(){

    try{

        const snap = await getDocs(
            collection(db,"marks","Unit Test","students")
        );

        
let average = 0;

snap.forEach((docSnap)=>{

const mark = docSnap.data();

if(mark.emis === emis){

average = Number(mark.percentage || 0);

}

});

document.getElementById("marksAverage").textContent =
average;
        document.getElementById("marksAverage").textContent =
        average;

    }catch(error){

        console.log(error);

        document.getElementById("marksAverage").textContent = "0";

    }

}

window.logoutParent = async function(){

    try{

        await signOut(auth);

        localStorage.removeItem("parentEMIS");
        localStorage.removeItem("emis");
        localStorage.removeItem("userRole");

        location.href = "login.html";

    }catch(error){

        alert(error.message);

    }

}

window.addEventListener("DOMContentLoaded",()=>{

    loadDashboard();

});
