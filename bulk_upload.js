/*==================================================
School Connect TN
Bulk Upload V2
JavaScript - Part 1
==================================================*/

import { db } from "./firebase.js";

import {
doc,
setDoc
}
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

/*=========================
ELEMENTS
=========================*/

const uploadBtn =
document.getElementById("uploadBtn");

const uploadType =
document.getElementById("uploadType");

const csvFile =
document.getElementById("csvFile");

const status =
document.getElementById("status");

const progressBar =
document.getElementById("progressBar");

const downloadTemplateBtn =
document.getElementById("downloadTemplateBtn");

const totalRecords =
document.getElementById("totalRecords");

const successRecords =
document.getElementById("successRecords");

const updatedRecords =
document.getElementById("updatedRecords");

const failedRecords =
document.getElementById("failedRecords");

/*=========================
EVENTS
=========================*/

uploadBtn.addEventListener(
"click",
uploadCSV
);

downloadTemplateBtn.addEventListener(
"click",
downloadTemplate
);

/*=========================
DOWNLOAD TEMPLATE
=========================*/

function downloadTemplate(){

const type =
uploadType.value;

let csv="";

let fileName="";

switch(type){

case "students":

fileName="Students_Template.csv";

csv=`AdmissionNo,EMIS,StudentName,DOB,Gender,Class,Section,Medium,FatherName,MotherName,Mobile
ADM001,610000001,Arun Kumar,2014-06-15,Male,6,A,Tamil,Ramesh,Lakshmi,9876543210`;

break;

case "teachers":

fileName="Teachers_Template.csv";

csv=`TeacherID,TeacherName,Subject,Email,Mobile
T001,Ravi Kumar,Maths,ravi@gmail.com,9876543210`;

break;

case "parents":

fileName="Parents_Template.csv";

csv=`EMIS,FatherName,MotherName,Mobile
610000001,Ramesh,Lakshmi,9876543210`;

break;

case "attendance":

fileName="Attendance_Template.csv";

csv=`EMIS,Date,Status
610000001,2026-07-20,P`;

break;

case "marks":

fileName="Marks_Template.csv";

csv=`EMIS,Exam,Tamil,English,Maths,Science,Social
610000001,Quarterly,95,90,98,91,89`;

break;

}

const blob =
new Blob([csv],{
type:"text/csv"
});

const link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
fileName;

link.click();

URL.revokeObjectURL(link.href);

}
/*=========================
UPLOAD CSV
=========================*/

async function uploadCSV(){

const file = csvFile.files[0];

const type = uploadType.value;

if(!file){

alert("Please select a CSV file");

return;

}

status.innerHTML = "📖 Reading CSV...";

progressBar.style.width = "10%";
progressBar.innerHTML = "10%";

const reader = new FileReader();

reader.onload = async function(e){

const csv = e.target.result.trim();

const rows = csv.split("\n");

if(rows.length <= 1){

alert("CSV File is Empty");

return;

}

totalRecords.innerHTML = rows.length - 1;

let success = 0;
let updated = 0;
let failed = 0;

progressBar.style.width = "25%";
progressBar.innerHTML = "25%";

for(let i=1;i<rows.length;i++){

const cols = rows[i].split(",");

try{

switch(type){

/*=========================
STUDENTS
=========================*/

case "students":{

if(cols.length<11){

failed++;

continue;

}

const admissionNo = cols[0].trim();
const emis = cols[1].trim();

const ref = doc(db,"students",emis);

await setDoc(ref,{

admissionNo,
emis,
name:cols[2].trim(),
dob:cols[3].trim(),
gender:cols[4].trim(),
class:cols[5].trim(),
section:cols[6].trim(),
medium:cols[7].trim(),
father:cols[8].trim(),
mother:cols[9].trim(),
mobile:cols[10].trim(),
updatedAt:new Date().toISOString()

},{merge:true});

success++;

break;

}

/*=========================
TEACHERS
=========================*/

case "teachers":{

if(cols.length<5){

failed++;

continue;

}

await setDoc(

doc(db,"teachers",cols[0].trim()),

{

id:cols[0].trim(),
name:cols[1].trim(),
subject:cols[2].trim(),
email:cols[3].trim(),
mobile:cols[4].trim(),
updatedAt:new Date().toISOString()

},

{merge:true}

);

success++;

break;

}

/*=========================
PARENTS
=========================*/

case "parents":{

if(cols.length<4){

failed++;

continue;

}

await setDoc(

doc(db,"parents",cols[0].trim()),

{

emis:cols[0].trim(),
father:cols[1].trim(),
mother:cols[2].trim(),
mobile:cols[3].trim(),
updatedAt:new Date().toISOString()

},

{merge:true}

);

success++;

break;

}
    /*=========================
ATTENDANCE
=========================*/

case "attendance":{

if(cols.length<3){

failed++;

continue;

}

await setDoc(

doc(db,"attendance",cols[1].trim(),"students",cols[0].trim()),

{

emis:cols[0].trim(),
date:cols[1].trim(),
status:cols[2].trim(),
updatedAt:new Date().toISOString()

},

{merge:true}

);

success++;

break;

}

/*=========================
MARKS
=========================*/

case "marks":{

if(cols.length<7){

failed++;

continue;

}

const tamil=Number(cols[2]);
const english=Number(cols[3]);
const maths=Number(cols[4]);
const science=Number(cols[5]);
const social=Number(cols[6]);

const total=
tamil+english+maths+science+social;

const percentage=
(total/5).toFixed(2);

await setDoc(

doc(db,"marks",cols[1].trim(),"students",cols[0].trim()),

{

emis:cols[0].trim(),
exam:cols[1].trim(),

tamil,
english,
maths,
science,
social,

total,
percentage,

result:
(tamil>=35 &&
english>=35 &&
maths>=35 &&
science>=35 &&
social>=35)
? "PASS"
: "FAIL",

updatedAt:new Date().toISOString()

},

{merge:true}

);

success++;

break;

}

default:

failed++;

}

progressBar.style.width =
Math.round((i/(rows.length-1))*100)+"%";

progressBar.innerHTML =
Math.round((i/(rows.length-1))*100)+"%";

}catch(error){

console.error(error);

failed++;

}

}

/*=========================
SUMMARY
=========================*/

successRecords.innerHTML=success;
updatedRecords.innerHTML=updated;
failedRecords.innerHTML=failed;

progressBar.style.width="100%";
progressBar.innerHTML="100%";

status.innerHTML="✅ Import Completed";

alert(

"Import Completed\n\n"+

"Total : "+(rows.length-1)+

"\nSuccess : "+success+

"\nFailed : "+failed

);

};

reader.onerror=function(){

status.innerHTML="❌ Error Reading CSV";

};

reader.readAsText(file);

}
