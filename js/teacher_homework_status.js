//==========================================
// Homework Status V2
// Part 1
//==========================================

// Filter Mode

let SHOW_MODE = "PENDING";

// Available Modes
// PENDING
// COMPLETED
// HISTORY

function changeMode(mode){

SHOW_MODE = mode;

loadHomeworkStatus();

}
//==========================================
// Homework Status Filter
// Part 2
//==========================================

function filterSubmission(hw){

const today = new Date();

if(SHOW_MODE === "PENDING"){

return hw.status !== "Completed";

}

if(SHOW_MODE === "COMPLETED"){

return hw.status === "Completed";

}

if(SHOW_MODE === "HISTORY"){

if(hw.status !== "Completed") return false;

if(!hw.completedTime) return false;

const completedDate = hw.completedTime.toDate
? hw.completedTime.toDate()
: new Date(hw.completedTime);

const diffDays =
(today - completedDate) / (1000*60*60*24);

return diffDays > 7;

}

return true;

}
//==========================================
// Build Homework Card
// Part 3
//==========================================

function buildHomeworkCard(hw, id){

const isCompleted = hw.status === "Completed";

const isOverdue =
!isCompleted &&
hw.dueDate &&
(new Date(hw.dueDate) < new Date());

let badge = "🟢 Pending";

if(isCompleted){

badge = "✅ Completed";

}else if(isOverdue){

badge = "🔴 Overdue";

}

return `

<div class="homeworkCard">

<h3>👨‍🎓 ${hw.studentName}</h3>

<p><b>EMIS :</b> ${hw.emis}</p>

<p><b>Subject :</b> ${hw.subject}</p>

<p><b>Due :</b> ${hw.dueDate || "-"}</p>

<p><b>Status :</b> ${badge}</p>

${isCompleted ? `

<p><b>Completed By :</b> ${hw.completedBy || "Parent"}</p>

<p><b>Comment :</b> ${hw.parentComment || "-"}</p>

` : ""}

</div>

`;

}
//==========================================
// Load Homework Status
// Final Part
//==========================================

async function loadHomeworkStatus(){

try{

const submissionQuery = query(
collection(db,"homework_submissions"),
where("teacherId","==",teacherId)
);

const submissionSnap = await getDocs(submissionQuery);

let total = 0;
let completed = 0;
let pending = 0;

completedList.innerHTML = "";
pendingList.innerHTML = "";

submissionSnap.forEach((docSnap)=>{

const hw = docSnap.data();

total++;

if(hw.status==="Completed"){

completed++;

if(SHOW_MODE==="COMPLETED"){

completedList.innerHTML +=
createStudentCard(hw,docSnap.id);

}

}else{

pending++;

if(SHOW_MODE==="PENDING"){

pendingList.innerHTML +=
createStudentCard(hw,docSnap.id);

}

}

});

totalHomework.textContent = total;
completedCount.textContent = completed;
pendingCount.textContent = pending;

if(SHOW_MODE==="PENDING" && pending===0){

pendingList.innerHTML=`
<div class="homeworkCard">
🎉 No Pending Homework
</div>
`;

}

if(SHOW_MODE==="COMPLETED" && completed===0){

completedList.innerHTML=`
<div class="homeworkCard">
No Completed Homework
</div>
`;

}

}catch(error){

console.error(error);

alert("Unable to Load Homework Status");

}

}

//==========================================
// Auto Refresh
//==========================================

setInterval(loadHomeworkStatus,30000);

loadHomeworkStatus();

console.log("Homework Status V2 Loaded");
