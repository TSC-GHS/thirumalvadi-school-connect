import { db, auth } from "../firebase.js";

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

async function loadDashboard(){

// Students
const studentSnap = await getDocs(collection(db,"students"));
document.getElementById("studentCount").innerText =
studentSnap.size;

// Teachers
const teacherSnap = await getDocs(collection(db,"teachers"));
document.getElementById("teacherCount").innerText =
teacherSnap.size;

// Pending Leave
const leaveSnap = await getDocs(
query(
collection(db,"leave_requests"),
where("status","==","Pending")
)
);

document.getElementById("leaveCount").innerText =
leaveSnap.size;

// Attendance (Demo)
document.getElementById("attendanceCount").innerText="95%";

// Pass / Fail (Demo)
document.getElementById("passPercentage").innerText="92%";
document.getElementById("failPercentage").innerText="8%";

// Notice (Demo)
document.getElementById("noticeCount").innerText="3";

}

loadDashboard();

document
.getElementById("logoutBtn")
.addEventListener("click",async()=>{

await signOut(auth);

window.location.href="index.html";

});
