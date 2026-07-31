//==================================================
// School Connect TN
// Parent Dashboard V1
// Part 1
//==================================================

import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
getDoc,
doc,
orderBy,
limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Elements
//==================================================

const studentName =
document.getElementById("studentName");

const studentClassName =
document.getElementById("studentClass");

const studentEMIS =
document.getElementById("studentEMIS");

const attendanceCount =
document.getElementById("attendanceCount");

const homeworkCount =
document.getElementById("homeworkCount");

const noticeCount =
document.getElementById("noticeCount");

const resultCount =
document.getElementById("resultCount");

const latestNotices =
document.getElementById("latestNotices");

const recentHomework =
document.getElementById("recentHomework");

//==================================================
// Parent Session
//==================================================

const parentEMIS =
localStorage.getItem("parentEMIS") ||
sessionStorage.getItem("parentEMIS");

if(!parentEMIS){

alert("Session Expired");

location.href="index.html";

}

//==================================================
// Student Details
//==================================================

let studentData = null;

async function loadStudent(){

try{

const q = query(
collection(db,"students"),
where("emis","==",parentEMIS)
);

const snap = await getDocs(q);

if(snap.empty){

alert("Student Record Not Found");

location.href="index.html";

return false;

}

studentData = snap.docs[0].data();

studentName.textContent =
studentData.name || "-";

studentEMIS.textContent =
studentData.emis || "-";

studentClassName.textContent =
`${studentData.class || "-"}-${studentData.section || "-"}`;

return true;

}catch(error){

console.error(error);

alert(error.message);

console.error(error);

return false;

}

}

console.log("Parent Dashboard Part 1 Loaded");
//==================================================
// Dashboard Summary
// Part 2
//==================================================
//==================================================
// Load Attendance
//==================================================

async function loadAttendance(){

try{

const attendanceRef = collection(db,"attendance");

const attendanceDays = await getDocs(attendanceRef);

let totalDays = 0;
let presentDays = 0;

for(const day of attendanceDays.docs){

const studentRef = collection(
db,
"attendance",
day.id,
"students"
);

const studentSnap = await getDocs(

query(
studentRef,
where("emis","==",parentEMIS)
)

);

if(!studentSnap.empty){

totalDays++;

const data = studentSnap.docs[0].data();

if(data.status=="P"){

presentDays++;

}

}

}

const percentage =
totalDays==0
?0
:Math.round((presentDays/totalDays)*100);

attendanceCount.textContent =
percentage+"%";

}catch(error){

console.error(error);

attendanceCount.textContent="-";

}

}
async function loadDashboard(){

try{

//============================
// Homework Count
//============================

const today = new Date().toISOString().split("T")[0];

const homeworkSnap = await getDocs(

    query(
        collection(db,"homework"),
        where("class","==",studentData.class),
        where("section","==",studentData.section),
        where("status","==","Active"),
        where("dueDate",">=",today)
    )

);

homeworkCount.textContent =
homeworkSnap.size;

//============================
// Notice Count
//============================

const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate()-2);

const noticeSnap = await getDocs(

query(
collection(db,"notices"),
where("createdAt",">=",twoDaysAgo.toISOString())
)

);

noticeCount.textContent =
noticeSnap.size;
//============================
// Average Marks
//============================

const settingsDoc = await getDoc(
    doc(db, "settings", "marks")
);

if (!settingsDoc.exists()) {

    resultCount.textContent = "-";

} else {

    const latestExam = settingsDoc.data().currentExam;

    const markDoc = await getDoc(
        doc(
            db,
            "marks",
            latestExam,
            "students",
            parentEMIS
        )
    );

    if (!markDoc.exists()) {

        resultCount.textContent = "-";

    } else {

        const markData = markDoc.data();

        resultCount.textContent =
            (markData.percentage || 0) + "%";

    }

}
//==================================================
// Initialize Dashboard
//==================================================

async function initializeDashboard(){

const loaded =
await loadStudent();

if(!loaded) return;

await loadAttendance();

await loadDashboard();

await loadParentData();

}

initializeDashboard();

console.log("Parent Dashboard Part 2 Loaded");
//==================================================
// Latest Notices
//==================================================

async function loadLatestNotices() {

    try {

        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const snap = await getDocs(
            query(
                collection(db, "notices"),
                where("createdAt", ">=", twoDaysAgo.toISOString()),
                orderBy("createdAt", "desc"),
                limit(5)
            )
        );

        latestNotices.innerHTML = "";

        if (snap.empty) {

            latestNotices.innerHTML = `
                <div class="empty-card">
                    📢 No notices available
                </div>
            `;

            noticeCount.textContent = "0";
            return;
        }

        noticeCount.textContent = snap.size;

        snap.forEach((doc) => {

            const notice = doc.data();

            latestNotices.innerHTML += `
                <div class="notice-item">
                    <div class="notice-title">${notice.title}</div>
                    <p>${notice.description || ""}</p>
                </div>
            `;

        });

    } catch (error) {

        console.log(error);

        latestNotices.innerHTML =
"<div class='empty-card'>📢 No notices available</div>";

    }

}

//==================================================
// Recent Homework
//==================================================

async function loadRecentHomework(){

try{

const today = new Date().toISOString().split("T")[0];

const snap = await getDocs(

    query(
        collection(db,"homework"),
        where("class","==",studentData.class),
        where("section","==",studentData.section),
        where("status","==","Active"),
        where("dueDate",">=",today),
        orderBy("dueDate"),
        limit(5)
    )

);

recentHomework.innerHTML="";

if(snap.empty){

recentHomework.innerHTML = `
<div class="empty-card">
📚 No homework available
</div>
`;

return;

}

snap.forEach((doc)=>{

const hw = doc.data();

recentHomework.innerHTML += `

<div class="homework-item">

<div class="homework-sub">

${hw.subject || "-"}

</div>

<p>

${hw.title || hw.description || "-"}

</p>

<small>

Due : ${hw.dueDate || "-"}

</small>

</div>

`;

});

}catch(error){

console.error(error);

recentHomework.innerHTML=
"<p>Unable to load homework</p>";

}

}

//==================================================
// Load Dashboard Data
//==================================================

async function loadParentData(){

await loadLatestNotices();

await loadRecentHomework();

}

console.log("Parent Dashboard Part 3 Loaded");
// ========================================
// PART 4 - Homework
// ========================================

async function loadHomework(){

try{

const today = new Date().toISOString().split("T")[0];

const q = query(
    collection(db,"homework"),
    where("class","==",studentData.class),
    where("section","==",studentData.section),
    where("status","==","Active"),
    where("dueDate",">=",today),
    orderBy("dueDate")
);

const snap = await getDocs(q);

let html="";

snap.forEach((doc)=>{

const hw=doc.data();

html += `
<div class="homework-item">
<div class="homework-sub">${hw.subject}</div>
<div>${hw.title}</div>
<small>Due : ${hw.dueDate}</small>
</div>
`;

});

if(html===""){

html="<p>No Homework Available</p>";

}

document.getElementById("homeworkList").innerHTML=html;

}catch(error){

console.log(error);

}

}

// ========================================
// Bottom Menu
// ========================================

window.goHome=()=>{
location.href="parent_dashboard.html";
};

window.goAttendance=()=>{
location.href="parent_attendance.html";
};

window.goReport=()=>{
location.href="parent_report_card.html";
};

window.goProfile=()=>{
location.href="parent_profile.html";
};

// ========================================
// Logout
// ========================================

window.logout=()=>{

localStorage.removeItem("parentEMIS");
sessionStorage.removeItem("parentEMIS");

location.href="index.html";

};

// ========================================
// Initialize
// ========================================

console.log("================================");
console.log("School Connect TN");
console.log("Parent Dashboard V1");
console.log("================================");
//==================================
// Language Selector
//==================================
//==================================
// Parent Language
//==================================

const language = {

ta:{
dashboard:"பெற்றோர் முகப்பு",
welcome:"👋 வரவேற்கிறோம்",
attendance:"வருகை",
average:"சராசரி",
homework:"வீட்டுப்பாடம்",
notice:"அறிவிப்புகள்",
quick:"⚡ விரைவு செயல்கள்",
latest:"📢 சமீபத்திய அறிவிப்புகள்",
today:"📚 இன்றைய வீட்டுப்பாடம்",
events:"📅 வரவிருக்கும் நிகழ்வுகள்"
},

en:{
dashboard:"Parent Dashboard",
welcome:"👋 Welcome Parent",
attendance:"Attendance",
average:"Average",
homework:"Homework",
notice:"Notices",
quick:"⚡ Quick Actions",
latest:"📢 Latest Notice",
today:"📚 Today's Homework",
events:"📅 Upcoming Events"
},

hi:{
dashboard:"अभिभावक डैशबोर्ड",
welcome:"👋 स्वागत है",
attendance:"उपस्थिति",
average:"औसत",
homework:"गृहकार्य",
notice:"सूचनाएँ",
quick:"⚡ त्वरित कार्य",
latest:"📢 नवीनतम सूचनाएँ",
today:"📚 आज का गृहकार्य",
events:"📅 आगामी कार्यक्रम"
}

};
const languageSelect =
document.getElementById("languageSelect");

if(languageSelect){

const savedLanguage =
localStorage.getItem("language") || "ta";
    const t = language[savedLanguage];

document.getElementById("dashboardTitle").textContent = t.dashboard;
document.getElementById("welcomeTitle").textContent = t.welcome;
document.getElementById("attendanceLabel").textContent = t.attendance;
document.getElementById("averageLabel").textContent = t.average;
document.getElementById("homeworkLabel").textContent = t.homework;
document.getElementById("noticeLabel").textContent = t.notice;
document.getElementById("quickActionsTitle").textContent = t.quick;
document.getElementById("latestNoticeTitle").textContent = t.latest;
document.getElementById("todayHomeworkTitle").textContent = t.today;
document.getElementById("upcomingEventsTitle").textContent = t.events;

languageSelect.value = savedLanguage;

languageSelect.addEventListener("change",(e)=>{

localStorage.setItem("language",e.target.value);

// Later we'll translate the page
location.reload();

});

}
