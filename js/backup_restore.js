//==================================================
// School Connect TN
// Backup & Restore
// Part 3A
//==================================================

import { db } from "./firebase.js";

import {

collection,
getDocs

} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Collections
//==================================================

const collections=[

"students",

"teachers",

"attendance",

"marks",

"homework",

"notices",

"calendar",

"leave",

"settings"

];

//==================================================
// Dashboard
//==================================================

async function loadDashboard(){

let totalCollections=collections.length;

let totalRecords=0;

for(const name of collections){

try{

const snap=

await getDocs(collection(db,name));

totalRecords+=snap.size;

}catch(e){

console.log(name,e);

}

}

document.getElementById("collectionCount").innerText=

totalCollections;

document.getElementById("recordCount").innerText=

totalRecords;

document.getElementById("backupCount").innerText=

localStorage.getItem("backupCount")||0;

document.getElementById("lastBackup").innerText=

localStorage.getItem("lastBackup")||"--";

}

loadDashboard();

//==================================================
// Download JSON
//==================================================

function downloadJSON(data,fileName){

const blob=

new Blob(

[JSON.stringify(data,null,2)],

{type:"application/json"}

);

const url=

URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download=fileName;

a.click();

URL.revokeObjectURL(url);

}

//==================================================
// Generic Backup
//==================================================

async function backupCollection(collectionName,fileName){

try{

const snap=

await getDocs(

collection(db,collectionName)

);

const data=[];

snap.forEach((doc)=>{

data.push({

id:doc.id,

...doc.data()

});

});

downloadJSON(

data,

fileName

);

updateBackupHistory(fileName);

}catch(error){

alert(error.message);

}

}
//==================================================
// Students Backup
//==================================================

window.backupStudents=function(){

backupCollection(

"students",

"Students_Backup.json"

);

}

//==================================================
// Teachers Backup
//==================================================

window.backupTeachers=function(){

backupCollection(

"teachers",

"Teachers_Backup.json"

);

}

//==================================================
// Attendance Backup
//==================================================

window.backupAttendance=function(){

backupCollection(

"attendance",

"Attendance_Backup.json"

);

}

//==================================================
// Marks Backup
//==================================================

window.backupMarks=function(){

backupCollection(

"marks",

"Marks_Backup.json"

);

}

//==================================================
// Homework Backup
//==================================================

window.backupHomework=function(){

backupCollection(

"homework",

"Homework_Backup.json"

);

}

//==================================================
// Notices Backup
//==================================================

window.backupNotices=function(){

backupCollection(

"notices",

"Notices_Backup.json"

);

}

//==================================================
// Full Backup
//==================================================

window.backupAll = async function(){

const backup={};

for(const name of collections){

const snap=await getDocs(collection(db,name));

backup[name]=[];

snap.forEach((doc)=>{

backup[name].push({

id:doc.id,

...doc.data()

});

});

}

downloadJSON(

backup,

"School_Connect_TN_Full_Backup.json"

);

updateBackupHistory(

"Full Database Backup"

);

}

//==================================================
// Backup History
//==================================================

function updateBackupHistory(fileName){

const now=new Date();

const dateTime=

now.toLocaleString();

localStorage.setItem(

"lastBackup",

dateTime

);

let count=

Number(

localStorage.getItem("backupCount")||0

);

count++;

localStorage.setItem(

"backupCount",

count

);

document.getElementById(

"backupCount"

).innerText=count;

document.getElementById(

"lastBackup"

).innerText=dateTime;

const history=

document.getElementById(

"backupHistory"

);

history.innerHTML=

`
<div style="padding:12px;border-bottom:1px solid #ddd;">

<b>${fileName}</b>

<br>

<small>${dateTime}</small>

</div>
`;

}
//==================================================
// Restore Database
// Part 3C
//==================================================

import {

doc,
setDoc

} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

window.restoreDatabase = async function(){

const fileInput =

document.getElementById("restoreFile");

if(fileInput.files.length===0){

alert("Please Select Backup File");

return;

}

const ok = confirm(

"Restore Database?\n\nExisting data may be overwritten."

);

if(!ok){

return;

}

const reader = new FileReader();

reader.onload = async function(e){

try{

const backup = JSON.parse(e.target.result);

let total = 0;

for(const collectionName in backup){

const records = backup[collectionName];

for(const record of records){

const id = record.id;

delete record.id;

await setDoc(

doc(db,collectionName,id),

record

);

total++;

}

}

alert(

"✅ Restore Completed\n\nRecords : "+total

);

loadDashboard();

}catch(error){

console.log(error);

alert(

"Restore Failed\n\n"+error.message

);

}

};

reader.readAsText(fileInput.files[0]);

}
