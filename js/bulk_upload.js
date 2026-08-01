//==================================================
// School Connect TN
// Bulk Upload V3 Professional
// Part 1 - Imports & Initialization
//==================================================

import { db } from "../firebase.js";

import {
doc,
setDoc,
getDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Elements
//==================================================

const uploadType =
document.getElementById("uploadType");

const csvFile =
document.getElementById("csvFile");

const uploadBtn =
document.getElementById("uploadBtn");

const downloadTemplateBtn =
document.getElementById("downloadTemplateBtn");

const downloadErrorBtn =
document.getElementById("downloadErrorBtn");

const progressBar =
document.getElementById("progressBar");

const status =
document.getElementById("status");

const fileName =
document.getElementById("fileName");

const totalRecords =
document.getElementById("totalRecords");

const successRecords =
document.getElementById("successRecords");

const updatedRecords =
document.getElementById("updatedRecords");

const duplicateRecords =
document.getElementById("duplicateRecords");

const skippedRecords =
document.getElementById("skippedRecords");

const failedRecords =
document.getElementById("failedRecords");

const historyTable =
document.getElementById("historyTable");

//==================================================
// Global Counters
//==================================================

let total = 0;
let success = 0;
let updated = 0;
let duplicate = 0;
let skipped = 0;
let failed = 0;

let errorRows = [];

//==================================================
// Reset Summary
//==================================================

function resetSummary(){

total = 0;
success = 0;
updated = 0;
duplicate = 0;
skipped = 0;
failed = 0;

errorRows = [];

totalRecords.textContent = "0";
successRecords.textContent = "0";
updatedRecords.textContent = "0";
failedRecords.textContent = "0";

progressBar.style.width = "0%";
progressBar.textContent = "0%";

status.textContent = "Waiting for upload...";

}

//==================================================
// Update Progress
//==================================================

function updateProgress(percent,message){

progressBar.style.width =
percent + "%";

progressBar.textContent =
percent + "%";

status.textContent =
message;

}

//==================================================
// File Selection
//==================================================

csvFile.addEventListener("change",()=>{

if(csvFile.files.length===0){

fileName.textContent =
"No file selected";

return;

}

fileName.textContent =
csvFile.files[0].name;

});

//==================================================
// Upload Validation
//==================================================

function validateUpload(){

if(uploadType.value===""){

alert("Please select Upload Type");

return false;

}

if(csvFile.files.length===0){

alert("Please choose CSV file");

return false;

}

return true;

}

//==================================================
// Events
//==================================================

uploadBtn.addEventListener("click",()=>{

if(!validateUpload()) return;

resetSummary();

updateProgress(
5,
"Reading CSV..."
);

uploadCSV();

});

downloadTemplateBtn.addEventListener(
"click",
downloadTemplate
);

if(downloadErrorBtn){

downloadErrorBtn.addEventListener(
"click",
downloadErrorReport
);

}

//==================================================
// Download Template
//==================================================

function downloadTemplate(){

const type = uploadType.value;

if(type===""){

alert("Please select Upload Type");

return;

}

const files = {
  students: "students_template.csv",
  teachers: "teachers_template.csv",
  parents: "parents_template.csv",
  attendance: "attendance_template.csv",
  marks: "marks_template.csv",
  homework: "homework_template.csv",
  notices: "notice_template.csv",
  calendar: "calendar_template.csv",
  timetable: "timetable_template.csv"
};

const file=files[type];

if(!file){

alert("Template not found");

return;

}

const link=document.createElement("a");

link.href =
"assets/css/js/templates/uploads/reports/" + files[type];

link.download=file;

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

}
//==================================================
// Error Report
//==================================================

function downloadErrorReport(){

if(errorRows.length===0){

alert("No Error Records");

return;

}

const csv =
errorRows.join("\n");

const blob =
new Blob([csv],{
type:"text/csv"
});

const link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"Upload_Error_Report.csv";

link.click();

URL.revokeObjectURL(
link.href
);

}

//==================================================
// Upload History
//==================================================

function addHistory(module,records,result){

const today =
new Date().toLocaleString();

historyTable.innerHTML += `

<tr>

<td>${today}</td>

<td>${module}</td>

<td>${records}</td>

<td>${result}</td>

</tr>

`;

}

console.log(
"Bulk Upload Part 1 Loaded"
);
//==================================================
// School Connect TN
// Bulk Upload V3 Professional
// Part 2 - CSV Reader & Student Upload
//==================================================

//==================================================
// Read CSV
//==================================================

async function uploadCSV(){

const file = csvFile.files[0];

const reader = new FileReader();

reader.onload = async function(event){

const csv =
event.target.result.trim();

const rows =
csv.split(/\r?\n/);

if(rows.length<=1){

alert("CSV File is Empty");

return;

}

total =
rows.length-1;

totalRecords.textContent =
total;

updateProgress(
10,
"Validating CSV..."
);

// Skip Header
const header =
rows[0].split(",");

switch(uploadType.value){

case "students":

await uploadStudents(
rows,
header
);

break;

// Next Parts
case "teachers":

alert(
"Teachers Upload - Part 3"
);

break;

case "parents":

alert(
"Parents Upload - Part 3"
);

break;

case "attendance":

await uploadAttendance(
rows,
header
);

break;

case "marks":

case "marks":

await uploadMarks(
rows,
header
);

break;

case "homework":

await uploadHomework(
rows,
header
);

break;

case "notices":

await uploadNotice(
rows,
header
);

break;

case "calendar":

await uploadCalendar(
rows,
header
);

break;

case "timetable":

await uploadTimetable(
rows,
header
);

break;

}

};

reader.readAsText(file);

}

//==================================================
// Student Upload
//==================================================

async function uploadStudents(rows,header){

const required=[

"AdmissionNo",
"EMIS",
"StudentName",
"DOB",
"Gender",
"Class",
"Section",
"Medium",
"FatherName",
"MotherName",
"Mobile"

];

// Header Validation

for(const col of required){

if(!header.includes(col)){

alert(
"Missing Column : "+col
);

return;

}

}

updateProgress(
20,
"Uploading Students..."
);

//==================================================
// Upload Loop
//==================================================

for(

let i=1;

i<rows.length;

i++

){

const cols =
rows[i].split(",");

if(cols.length<11){

failed++;

errorRows.push(rows[i]);

continue;

}

const admissionNo =
cols[0].trim();

const emis =
cols[1].trim();

const ref =
doc(
db,
"students",
emis
);

try{

const snap =
await getDoc(ref);

// Duplicate

if(snap.exists()){

updated++;

}else{

success++;

}

await setDoc(

ref,

{

admissionNo,

emis,

name:
cols[2].trim(),

dob:
cols[3].trim(),

gender:
cols[4].trim(),

class:
cols[5].trim(),

section:
cols[6].trim(),

medium:
cols[7].trim(),

father:
cols[8].trim(),

mother:
cols[9].trim(),

mobile:
cols[10].trim(),

status:"Active",

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

}catch(error){

console.error(error);

failed++;

errorRows.push(rows[i]);

}

const percent =
Math.round(

(i/(rows.length-1))*100

);

updateProgress(

percent,

"Uploading Students..."

);

}

//==================================================
// Summary
//==================================================

successRecords.textContent =
success;

updatedRecords.textContent =
updated;

duplicateRecords.textContent =
duplicate;

skippedRecords.textContent =
skipped;

failedRecords.textContent =
failed;

updateProgress(

100,

"Students Uploaded Successfully"

);

addHistory(

"Students",

total,

"Completed"

);

alert(

"Students Upload Completed"

);

}

console.log(
"Bulk Upload Part 2 Loaded"
);
//==================================================
// School Connect TN
// Bulk Upload V3 Professional
// Part 3 - Teachers & Parents Upload
//==================================================

//==================================================
// Teachers Upload
//==================================================

async function uploadTeachers(rows,header){

const required=[

"TeacherID",
"TeacherName",
"Subject",
"Email",
"Mobile"

];

// Header Validation

for(const col of required){

if(!header.includes(col)){

alert("Missing Column : "+col);

return;

}

}

updateProgress(
20,
"Uploading Teachers..."
);

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

if(cols.length<5){

failed++;
errorRows.push(rows[i]);
continue;

}

const teacherId=cols[0].trim();

const ref=doc(
db,
"teachers",
teacherId
);

try{

const snap=await getDoc(ref);

if(snap.exists()){

updated++;

}else{

success++;

}

await setDoc(

ref,

{

teacherId,
teacherName:cols[1].trim(),
subject:cols[2].trim(),
email:cols[3].trim(),
mobile:cols[4].trim(),

status:"Active",

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

}catch(error){

console.error(error);

failed++;

errorRows.push(rows[i]);

}

const percent=
Math.round(
(i/(rows.length-1))*100
);

updateProgress(
percent,
"Uploading Teachers..."
);

}

successRecords.textContent=success;
updatedRecords.textContent=updated;
duplicateRecords.textContent=duplicate;
skippedRecords.textContent=skipped;
failedRecords.textContent=failed;

updateProgress(
100,
"Teachers Upload Completed"
);

addHistory(
"Teachers",
total,
"Completed"
);

alert("Teachers Upload Completed");

}

//==================================================
// Parents Upload
//==================================================

async function uploadParents(rows,header){

const required=[

"EMIS",
"FatherName",
"MotherName",
"Mobile"

];

for(const col of required){

if(!header.includes(col)){

alert("Missing Column : "+col);

return;

}

}

updateProgress(
20,
"Uploading Parents..."
);

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

if(cols.length<4){

failed++;

errorRows.push(rows[i]);

continue;

}

const emis=cols[0].trim();

const ref=doc(
db,
"parents",
emis
);

try{

const snap=await getDoc(ref);

if(snap.exists()){

updated++;

}else{

success++;

}

await setDoc(

ref,

{

emis,

fatherName:
cols[1].trim(),

motherName:
cols[2].trim(),

mobile:
cols[3].trim(),

status:"Active",

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

}catch(error){

console.error(error);

failed++;

errorRows.push(rows[i]);

}

const percent=
Math.round(
(i/(rows.length-1))*100
);

updateProgress(
percent,
"Uploading Parents..."
);

}

successRecords.textContent=success;
updatedRecords.textContent=updated;
duplicateRecords.textContent=duplicate;
skippedRecords.textContent=skipped;
failedRecords.textContent=failed;

updateProgress(
100,
"Parents Upload Completed"
);

addHistory(
"Parents",
total,
"Completed"
);

alert("Parents Upload Completed");

}

//==================================================
// Update uploadCSV Switch
// Replace only this switch block inside uploadCSV()
//==================================================

/*
case "teachers":

await uploadTeachers(
rows,
header
);

break;

case "parents":

await uploadParents(
rows,
header
);

break;
*/

console.log(
"Bulk Upload Part 3 Loaded"
);
//==================================================
// School Connect TN
// Bulk Upload V3 Professional
// Part 4 - Attendance & Marks Upload
//==================================================

//==================================================
// Attendance Upload
//==================================================

async function uploadAttendance(rows, header){

const required=[
"EMIS",
"Date",
"Status"
];

for(const col of required){

if(!header.includes(col)){

alert("Missing Column : "+col);
return;

}

}

updateProgress(
20,
"Uploading Attendance..."
);

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

if(cols.length<3){

failed++;
errorRows.push(rows[i]);
continue;

}

const emis=cols[0].trim();
const date=cols[1].trim();
const statusValue=cols[2].trim().toUpperCase();

if(
statusValue!="P" &&
statusValue!="A" &&
statusValue!="L" &&
statusValue!="OD"
){

failed++;
errorRows.push(rows[i]);
continue;

}

const ref=doc(
db,
"attendance",
date,
"students",
emis
);

try{

const snap=await getDoc(ref);

if(snap.exists()){

updated++;

}else{

success++;

}

await setDoc(

ref,

{

emis,
date,
status:statusValue,

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

}catch(error){

console.error(error);

failed++;
errorRows.push(rows[i]);

}

const percent=
Math.round(
(i/(rows.length-1))*100
);

updateProgress(
percent,
"Uploading Attendance..."
);

}

successRecords.textContent=success;
updatedRecords.textContent=updated;
duplicateRecords.textContent=duplicate;
skippedRecords.textContent=skipped;
failedRecords.textContent=failed;

updateProgress(
100,
"Attendance Upload Completed"
);

addHistory(
"Attendance",
total,
"Completed"
);

alert("Attendance Upload Completed");

}

//==================================================
// Marks Upload
//==================================================

async function uploadMarks(rows,header){

const required=[

"EMIS",
"Exam",
"Tamil",
"English",
"Maths",
"Science",
"Social"

];

for(const col of required){

if(!header.includes(col)){

alert("Missing Column : "+col);

return;

}

}

updateProgress(
20,
"Uploading Marks..."
);

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

if(cols.length<7){

failed++;
errorRows.push(rows[i]);
continue;

}

const emis=cols[0].trim();

const exam=cols[1].trim();

const tamil=Number(cols[2])||0;
const english=Number(cols[3])||0;
const maths=Number(cols[4])||0;
const science=Number(cols[5])||0;
const social=Number(cols[6])||0;

const totalMarks=
tamil+
english+
maths+
science+
social;

const percentage=
Number(
(totalMarks/5).toFixed(2)
);

const result=

(
tamil>=35 &&
english>=35 &&
maths>=35 &&
science>=35 &&
social>=35

)

?

"PASS"

:

"FAIL";

let grade="";

if(percentage>=90){

grade="A+";

}else if(percentage>=80){

grade="A";

}else if(percentage>=70){

grade="B+";

}else if(percentage>=60){

grade="B";

}else if(percentage>=50){

grade="C";

}else if(percentage>=35){

grade="D";

}else{

grade="RA";

}

const ref=

doc(

db,

"marks",

exam,

"students",

emis

);

try{

const snap=

await getDoc(ref);

if(snap.exists()){

updated++;

}else{

success++;

}

await setDoc(

ref,

{

emis,
exam,

tamil,
english,
maths,
science,
social,

total:totalMarks,

percentage,

grade,

result,

updatedAt:

serverTimestamp()

},

{

merge:true

}

);

}catch(error){

console.error(error);

failed++;

errorRows.push(rows[i]);

}

const percent=

Math.round(

(i/(rows.length-1))*100

);

updateProgress(

percent,

"Uploading Marks..."

);

}

successRecords.textContent=success;
updatedRecords.textContent=updated;
duplicateRecords.textContent=duplicate;
skippedRecords.textContent=skipped;
failedRecords.textContent=failed;

updateProgress(
100,
"Marks Upload Completed"
);

addHistory(
"Marks",
total,
"Completed"
);

alert("Marks Upload Completed");

}

//==================================================
// Replace uploadCSV() switch block
//==================================================

/*

case "attendance":

await uploadAttendance(
rows,
header
);

break;

case "marks":

await uploadMarks(
rows,
header
);

break;

*/

console.log(
"Bulk Upload Part 4 Loaded"
);
//==================================================
// School Connect TN
// Bulk Upload V3 Professional
// Part 5 - Homework, Notice, Calendar & Timetable
//==================================================

//==================================================
// Homework Upload
//==================================================

async function uploadHomework(rows,header){

const required=[
"Class",
"Section",
"Subject",
"Title",
"Description",
"DueDate",
"Status"
];

for(const col of required){

if(!header.includes(col)){
alert("Missing Column : "+col);
return;
}

}

updateProgress(20,"Uploading Homework...");

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

if(cols.length<7){

failed++;
errorRows.push(rows[i]);
continue;

}

try{

const id=
crypto.randomUUID();

await setDoc(

doc(db,"homework",id),

{

class:cols[0].trim(),
section:cols[1].trim(),
subject:cols[2].trim(),
title:cols[3].trim(),
description:cols[4].trim(),
dueDate:cols[5].trim(),
status:cols[6].trim(),

updatedAt:
serverTimestamp()

}

);

success++;

}catch(error){

console.error(error);

failed++;

errorRows.push(rows[i]);

}

updateProgress(

Math.round((i/(rows.length-1))*100),

"Uploading Homework..."

);

}

successRecords.textContent=success;
failedRecords.textContent=failed;

updateProgress(100,"Homework Upload Completed");

addHistory("Homework",total,"Completed");

}

//==================================================
// Notice Upload
//==================================================

async function uploadNotices(rows,header){

const required=[
"Title",
"Description",
"Target",
"StartDate",
"EndDate",
"Status"
];

for(const col of required){

if(!header.includes(col)){
alert("Missing Column : "+col);
return;
}

}

updateProgress(20,"Uploading Notices...");

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

if(cols.length<6){

failed++;
errorRows.push(rows[i]);
continue;

}

try{

const id=
crypto.randomUUID();

await setDoc(

doc(db,"notices",id),

{

title:cols[0].trim(),
description:cols[1].trim(),
target:cols[2].trim(),
startDate:cols[3].trim(),
endDate:cols[4].trim(),
status:cols[5].trim(),

createdAt:
serverTimestamp()

}

);

success++;

}catch(error){

console.error(error);

failed++;

errorRows.push(rows[i]);

}

updateProgress(

Math.round((i/(rows.length-1))*100),

"Uploading Notices..."

);

}

successRecords.textContent=success;
failedRecords.textContent=failed;

updateProgress(100,"Notice Upload Completed");

addHistory("Notice",total,"Completed");

}

//==================================================
// Calendar Upload
//==================================================

async function uploadCalendar(rows,header){

const required=[
"Date",
"Title",
"Description",
"Holiday"
];

for(const col of required){

if(!header.includes(col)){
alert("Missing Column : "+col);
return;
}

}

updateProgress(20,"Uploading Calendar...");

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

if(cols.length<4){

failed++;
errorRows.push(rows[i]);
continue;

}

try{

await setDoc(

doc(db,"calendar",cols[0].trim()),

{

date:cols[0].trim(),
title:cols[1].trim(),
description:cols[2].trim(),
holiday:cols[3].trim(),

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

success++;

}catch(error){

console.error(error);

failed++;

errorRows.push(rows[i]);

}

updateProgress(

Math.round((i/(rows.length-1))*100),

"Uploading Calendar..."

);

}

successRecords.textContent=success;
failedRecords.textContent=failed;

updateProgress(100,"Calendar Upload Completed");

addHistory("Calendar",total,"Completed");

}

//==================================================
// Timetable Upload
//==================================================

async function uploadTimetable(rows,header){

const required=[
"AcademicYear",
"Class",
"Section",
"Day",
"Period1",
"Period2",
"Period3",
"Period4",
"Period5",
"Period6",
"Period7"
];

for(const col of required){

if(!header.includes(col)){
alert("Missing Column : "+col);
return;
}

}

updateProgress(20,"Uploading Timetable...");

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

if(cols.length<11){

failed++;
errorRows.push(rows[i]);
continue;

}

const documentId=

`${cols[0].trim()}_${cols[1].trim()}_${cols[2].trim()}_${cols[3].trim()}`;

try{

await setDoc(

doc(db,"timetable",documentId),

{

academicYear:cols[0].trim(),
class:cols[1].trim(),
section:cols[2].trim(),
day:cols[3].trim(),

subjects:{

Period1:cols[4].trim(),
Period2:cols[5].trim(),
Period3:cols[6].trim(),
Period4:cols[7].trim(),
Period5:cols[8].trim(),
Period6:cols[9].trim(),
Period7:cols[10].trim()

},

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

success++;

}catch(error){

console.error(error);

failed++;

errorRows.push(rows[i]);

}

updateProgress(

Math.round((i/(rows.length-1))*100),

"Uploading Timetable..."

);

}

successRecords.textContent=success;
failedRecords.textContent=failed;

updateProgress(100,"Timetable Upload Completed");

addHistory("Timetable",total,"Completed");

}

//==================================================
// Add these cases inside uploadCSV()
//==================================================

/*

case "homework":

await uploadHomework(rows,header);

break;

case "notices":

await uploadNotices(rows,header);

break;

case "calendar":

await uploadCalendar(rows,header);

break;

case "timetable":

await uploadTimetable(rows,header);

break;

*/

console.log("Bulk Upload Part 5 Loaded");
//==================================================
// School Connect TN
// Bulk Upload V3 Professional
// Part 6 - Final Functions
//==================================================

//==================================================
// Update Summary
//==================================================

function updateSummary(){

totalRecords.textContent=total;
successRecords.textContent=success;
updatedRecords.textContent=updated;
duplicateRecords.textContent=duplicate;
skippedRecords.textContent=skipped;
failedRecords.textContent=failed;

}

//==================================================
// Finish Upload
//==================================================

function finishUpload(moduleName){

updateSummary();

progressBar.style.width="100%";
progressBar.textContent="100%";

status.innerHTML=
"✅ "+moduleName+" Upload Completed";

addHistory(
moduleName,
total,
"Completed"
);

alert(

moduleName+
" Upload Completed\n\n"+

"Total : "+total+

"\nImported : "+success+

"\nUpdated : "+updated+

"\nDuplicate : "+duplicate+

"\nSkipped : "+skipped+

"\nFailed : "+failed

);

}

//==================================================
// CSV Duplicate Validation
//==================================================

function hasDuplicate(rows,keyIndex){

const set=new Set();

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

const value=cols[keyIndex]?.trim();

if(!value) continue;

if(set.has(value)){

duplicate++;

errorRows.push(rows[i]);

return true;

}

set.add(value);

}

return false;

}

//==================================================
// File Validation
//==================================================

function validateFile(file){

const allowed=[

"text/csv",

"application/vnd.ms-excel",

"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

];

if(!allowed.includes(file.type)){

alert(

"Only CSV or Excel Files Allowed"

);

return false;

}

return true;

}

//==================================================
// Upload History Local Storage
//==================================================

function saveHistory(moduleName){

let history=

JSON.parse(

localStorage.getItem(

"uploadHistory"

)||"[]"

);

history.unshift({

date:new Date().toLocaleString(),

module:moduleName,

total,

success,

updated,

duplicate,

failed

});

if(history.length>20){

history=history.slice(0,20);

}

localStorage.setItem(

"uploadHistory",

JSON.stringify(history)

);

loadHistory();

}

//==================================================
// Load Upload History
//==================================================

function loadHistory(){

const history=

JSON.parse(

localStorage.getItem(

"uploadHistory"

)||"[]"

);

historyTable.innerHTML="";

if(history.length===0){

historyTable.innerHTML=

`
<tr>

<td colspan="4">

No Upload History

</td>

</tr>

`;

return;

}

history.forEach(item=>{

historyTable.innerHTML+=`

<tr>

<td>${item.date}</td>

<td>${item.module}</td>

<td>${item.total}</td>

<td>✅ Completed</td>

</tr>

`;

});

}

//==================================================
// Reset Screen
//==================================================

function resetScreen(){

progressBar.style.width="0%";
progressBar.textContent="0%";

status.innerHTML="Waiting for upload...";

csvFile.value="";

fileName.textContent="No file selected";

resetSummary();

}

//==================================================
// Initial Load
//==================================================

window.addEventListener(

"DOMContentLoaded",

()=>{

loadHistory();

resetSummary();

console.log(

"Bulk Upload Professional Ready"

);

}

);

console.log(
"Bulk Upload Part 6 Loaded"
);
