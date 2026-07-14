//==========================================
// School Connect TN
// Parent Dashboard
// Production Version V2
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

//==========================================
// Parent Session
//==========================================

const emis =
localStorage.getItem("parentEMIS") ||
sessionStorage.getItem("parentEMIS");

if(!emis){

    alert("Session Expired");

    location.href="login.html";

}

//==========================================
// Load Dashboard
//==========================================

async function loadDashboard(){

    try{

        const studentRef =
        doc(db,"students",emis);

        const studentSnap =
        await getDoc(studentRef);

        if(!studentSnap.exists()){

            alert("Student Record Not Found");

            return;

        }

        const student =
        studentSnap.data();

        document.getElementById("studentName").textContent =
        student.name || "-";

        document.getElementById("studentEMIS").textContent =
        student.emis || "-";

        document.getElementById("studentClass").textContent =
        student.class || "-";

        document.getElementById("studentSection").textContent =
        student.section || "-";

        if(student.photo){

            document.getElementById("studentPhoto").src =
            student.photo;

        }

        await loadAttendance(student.emis);

        await loadHomework(
            student.class,
            student.section
        );

        await loadNotice();

        await loadMarks();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
//==========================================
// Load Attendance Percentage
//==========================================

async function loadAttendance(studentEmis){

    try{

        const snap = await getDocs(
            collection(db,"attendance")
        );

        let present = 0;
        let absent = 0;

        snap.forEach((docSnap)=>{

            const att = docSnap.data();

            if(String(att.emis).trim() !== String(studentEmis).trim()){
                return;
            }

            if(att.status === "Present"){
                present++;
            }else{
                absent++;
            }

        });

        const total = present + absent;

        const percent =
        total === 0
        ? 0
        : Math.round((present / total) * 100);

        document.getElementById("attendancePercent").textContent =
        percent + "%";

    }
    catch(error){

        console.error("Attendance :",error);

        document.getElementById("attendancePercent").textContent =
        "0%";

    }

}
//==========================================
// Load Homework
//==========================================

async function loadHomework(studentClass, studentSection){

    try{

        const snap = await getDocs(
            collection(db,"homework")
        );

        let html = "";
        let count = 0;

        snap.forEach((docSnap)=>{

            const hw = docSnap.data();

            if(
                hw.className === studentClass &&
                hw.section === studentSection &&
                hw.status === "Active"
            ){

                count++;

                html += `

<div class="homework-item">

<div class="homework-sub">
${hw.subject || "Homework"}
</div>

<div>
${hw.title || "-"}
</div>

<small>
Due : ${hw.dueDate || "-"}
</small>

</div>

`;

            }

        });

        document.getElementById("homeworkCount").textContent = count;

        document.getElementById("todayHomework").innerHTML =
        count > 0
        ? html
        : "<p>No Homework Available</p>";

    }

    catch(error){

        console.error("Homework :",error);

        document.getElementById("todayHomework").innerHTML =
        "<p>Unable to Load Homework</p>";

    }

}
//==========================================
// Load Latest Notices
//==========================================

async function loadNotice(){

    try{

        const noticeQuery = query(
            collection(db,"notices"),
            orderBy("createdAt","desc"),
            limit(3)
        );

        const snap = await getDocs(noticeQuery);

        let html = "";
        let count = 0;

        snap.forEach((docSnap)=>{

            const notice = docSnap.data();

            count++;

            html += `

<div class="notice-item">

<div class="notice-title">
${notice.title || "School Notice"}
</div>

<div>
${notice.description || "-"}
</div>

<small>
${notice.createdAt?.toDate
? notice.createdAt.toDate().toLocaleDateString()
: ""}
</small>

</div>

`;

        });

        document.getElementById("noticeCount").textContent = count;

        document.getElementById("latestNotice").innerHTML =
            count > 0
            ? html
            : "<p>No Notice Available</p>";

    }catch(error){

        console.error("Notice :", error);

        document.getElementById("latestNotice").innerHTML =
            "<p>Unable to Load Notice</p>";

    }

}
//==========================================
// Load Marks Average
//==========================================

async function loadMarks(){

    try{

        const examName = "Unit Test";

        const snap = await getDocs(
            collection(db,"marks",examName,"students")
        );

        let average = 0;
        let grade = "-";

        snap.forEach((docSnap)=>{

            const mark = docSnap.data();

            if(String(mark.emis).trim() === String(emis).trim()){

                average = Number(mark.percentage || 0);
                grade = mark.grade || "-";

            }

        });

        document.getElementById("marksAverage").textContent =
        average + "%";

        if(document.getElementById("studentGrade")){

            document.getElementById("studentGrade").textContent =
            grade;

        }

    }

    catch(error){

        console.error("Marks :",error);

        document.getElementById("marksAverage").textContent =
        "0%";

    }

}
//==========================================
// Parent Logout
//==========================================

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

};

//==========================================
// Dashboard Initialize
//==========================================

window.addEventListener("DOMContentLoaded",()=>{

    loadDashboard();

});

//==========================================
// Version
//==========================================

console.log("================================");
console.log("School Connect TN");
console.log("Parent Dashboard");
console.log("Production Version V3");
console.log("================================");
