//==========================================
// School Connect TN
// Teacher Homework Status
// Part 1
//==========================================

import { auth, db } from "../firebase.js";

import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

let teacherId = "";
let teacherName = "";
let teacherSubject = "";
let teacherClass = "";
let teacherSection = "";

let completedStudents = [];
let allStudents = [];
let homeworkList = [];

window.addEventListener("DOMContentLoaded", () => {

    loadTeacher();

});

async function loadTeacher(){

    try{

        teacherId = localStorage.getItem("teacherId");

        if(!teacherId){

            alert("Please Login Again");

            location.href="teacher_login.html";
            return;

        }

        const teacherRef = doc(db,"teachers",teacherId);

        const teacherSnap = await getDoc(teacherRef);

        if(!teacherSnap.exists()){

            alert("Teacher Record Not Found");
            return;

        }

        const teacher = teacherSnap.data();

        teacherName = teacher.name || "";
        teacherSubject = teacher.subject || "";
        teacherClass = teacher.className || "";
        teacherSection = teacher.section || "";

        await loadHomeworkStatus();

    }

    catch(error){

        console.log(error);
        alert(error.message);

    }

}
async function loadHomeworkStatus(){

    try{

        // Homework
        const homeworkSnap =
        await getDocs(collection(db,"homework"));

        homeworkSnap.forEach((docSnap)=>{

            const hw = docSnap.data();

            if(
                hw.class==teacherClass &&
                hw.section==teacherSection &&
                hw.subject==teacherSubject &&
                (hw.status=="Active" || hw.status===true)
            ){

                homeworkList.push(hw);

            }

        });

        // Students

        const studentSnap =
        await getDocs(collection(db,"students"));

        studentSnap.forEach((docSnap)=>{

            const student = docSnap.data();

            if(
                student.class==teacherClass &&
                student.section==teacherSection
            ){

                allStudents.push(student);

            }

        });

        // Homework Submission

        const submissionSnap =
        await getDocs(collection(db,"homework_submissions"));

        submissionSnap.forEach((docSnap)=>{

            const submit = docSnap.data();

            if(
                submit.class==teacherClass &&
                submit.section==teacherSection &&
                submit.subject==teacherSubject &&
                submit.status=="Completed"
            ){

                completedStudents.push(submit);

            }

        });

        showDashboard();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}
function showDashboard(){

    document.getElementById("totalHomework").textContent =
        homeworkList.length;

    document.getElementById("completedCount").textContent =
        completedStudents.length;

    const pendingStudents = allStudents.filter(student => {

        return !completedStudents.some(submission =>
            submission.emis === student.emis
        );

    });

    document.getElementById("pendingCount").textContent =
        pendingStudents.length;

    // Completed Students List

    let completedHTML = "";

    if(completedStudents.length === 0){

        completedHTML = `
        <div class="profileCard">
            No student has completed the homework yet.
        </div>
        `;

    }else{

        completedStudents.forEach((student,index)=>{

            completedHTML += `
            <div class="profileCard">

                <b>${index+1}. ${student.studentName}</b><br>

                EMIS : ${student.emis}<br>

                Homework : ${student.homeworkTitle}<br>

                Completed :
                ${student.completedAt?.toDate
                    ? student.completedAt.toDate().toLocaleString()
                    : "-"}

            </div>
            `;

        });

    }

    document.getElementById("completedList").innerHTML =
        completedHTML;

    // Pending Students List

    let pendingHTML = "";

    if(pendingStudents.length === 0){

        pendingHTML = `
        <div class="profileCard">
            🎉 All students have completed the homework.
        </div>
        `;

    }else{

        pendingStudents.forEach((student,index)=>{

            pendingHTML += `
            <div class="profileCard">

                <b>${index+1}. ${student.name}</b><br>

                EMIS : ${student.emis}

            </div>
            `;

        });

    }

    document.getElementById("pendingList").innerHTML =
        pendingHTML;

}
