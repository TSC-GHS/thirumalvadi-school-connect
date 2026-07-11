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
    alert("Please Login Again");
    location.href = "parent_login.html";
}

async function loadDashboard() {

try {

const studentRef = doc(db, "students", emis);

const studentSnap = await getDoc(studentRef);

if (!studentSnap.exists()) {

alert("Student Not Found");

return;

}

const student = studentSnap.data();

document.getElementById("studentName").innerHTML =
student.name || "-";

document.getElementById("studentEMIS").innerHTML =
student.emis || emis;

document.getElementById("studentClass").innerHTML =
(student.class || "-") + " - " +
(student.section || "-");

document.getElementById("studentSection").innerHTML =
student.section || "-";

document.getElementById("attendancePercent").innerHTML =
student.attendance || "0%";

if(student.photo){

document.getElementById("studentPhoto").src =
student.photo;

}

loadHomework(student.class);

loadNotice();

loadMarks(emis);

}catch(error){

console.error(error);

alert(error.message);

}

}
