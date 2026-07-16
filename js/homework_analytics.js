//====================================
// Teacher Wise Analytics
//====================================

const teacherMap = {};
const classMap = {};

list.forEach(hw=>{

if(hw.dueDate===today){
todayCount++;
}

const teacher = hw.teacherName || "Unknown";

teacherMap[teacher] =
(teacherMap[teacher] || 0) + 1;

const cls =
`${hw.className || "-"}-${hw.section || "-"}`;

classMap[cls] =
(classMap[cls] || 0) + 1;

});

todayHomework.textContent = todayCount;

teacherCount.textContent =
Object.keys(teacherMap).length;

classCount.textContent =
Object.keys(classMap).length;
//====================================
// Teacher Wise UI
//====================================

let teacherHTML = "";

Object.keys(teacherMap)
.sort()
.forEach(name=>{

teacherHTML += `

<div class="item">

<span>👨‍🏫 ${name}</span>

<span>${teacherMap[name]}</span>

</div>

`;

});

teacherWise.innerHTML = teacherHTML;

//====================================
// Class Wise UI
//====================================

let classHTML = "";

Object.keys(classMap)
.sort()
.forEach(cls=>{

classHTML += `

<div class="item">

<span>🏫 ${cls}</span>

<span>${classMap[cls]}</span>

</div>

`;

});

classWise.innerHTML = classHTML;
//====================================
// Latest Homework
//====================================

list.sort((a,b)=>{

const t1 = a.createdAt?.seconds || 0;
const t2 = b.createdAt?.seconds || 0;

return t2 - t1;

});

let latestHTML = "";

list.slice(0,10).forEach(hw=>{

latestHTML += `

<div class="item">

<div>

<b>${hw.subject || "-"}</b><br>

Class : ${hw.className || "-"}-${hw.section || "-"}<br>

${hw.title || hw.description || "-"}

</div>

<div>

${hw.dueDate || "-"}

</div>

</div>

`;

});

latestHomework.innerHTML = latestHTML;

console.log("Homework Analytics Loaded Successfully");
