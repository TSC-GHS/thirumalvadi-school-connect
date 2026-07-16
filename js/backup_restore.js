/*==================================================
School Connect TN
Backup & Restore
JavaScript - Part 1
==================================================*/

import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

/*====================================
COLLECTIONS
====================================*/

const collections = [

"students",
"teachers",
"parents",
"attendance",
"report_cards",
"homework",
"notices"

];

/*====================================
BACKUP
====================================*/

window.createBackup = async function(){

try{

const backup = {

version : "1.0",

createdAt :
new Date().toISOString(),

school :
"School Connect TN",

data : {}

};

let totalRecords = 0;

/*====================================
READ COLLECTIONS
====================================*/

for(const collectionName of collections){

const snap =
await getDocs(
collection(db,collectionName)
);

backup.data[collectionName]=[];

snap.forEach(doc=>{

backup.data[collectionName].push({

id:doc.id,

...doc.data()

});

totalRecords++;

});

}

/*====================================
UPDATE STATUS
====================================*/

document.getElementById("lastBackup").innerHTML =
new Date().toLocaleString();

document.getElementById("totalCollections").innerHTML =
collections.length;
/*====================================
DOWNLOAD BACKUP
====================================*/

const jsonData =
JSON.stringify(backup,null,2);

const blob =
new Blob(
[jsonData],
{
type:"application/json"
}
);

const url =
URL.createObjectURL(blob);

const link =
document.createElement("a");

const fileName =
"SchoolConnectTN_Backup_" +
new Date()
.toISOString()
.substring(0,19)
.replace(/:/g,"-") +
".json";

link.href = url;

link.download = fileName;

link.click();

URL.revokeObjectURL(url);

/*====================================
BACKUP SIZE
====================================*/

const backupSize =
(blob.size/1024)
.toFixed(2);

document.getElementById("backupSize")
.innerHTML =
backupSize + " KB";

/*====================================
BACKUP HISTORY
====================================*/

document.getElementById("historyTable")
.innerHTML = `

<tr>

<td>
${new Date().toLocaleString()}
</td>

<td>
V1.0
</td>

<td>
✅ Success
</td>

</tr>

`;

alert(

`Backup Created Successfully

Collections : ${collections.length}

Records : ${totalRecords}

Size : ${backupSize} KB`

);

}catch(error){

console.error(error);

alert(error.message);

}

};
/*====================================
RESTORE BACKUP
====================================*/

import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

window.restoreBackup = async function(){

const file =
document.getElementById("restoreFile").files[0];

if(!file){

alert("Please select a backup file.");

return;

}

const confirmRestore =
confirm(
"⚠️ This will restore data from the selected backup.\n\nDo you want to continue?"
);

if(!confirmRestore){

return;

}

try{

const text =
await file.text();

const backup =
JSON.parse(text);

if(!backup.data){

alert("Invalid backup file.");

return;

}

let restoredRecords = 0;

for(const collectionName of Object.keys(backup.data)){

const records =
backup.data[collectionName];

for(const record of records){

const { id, ...data } = record;

await setDoc(

doc(db,collectionName,id),

data,

{merge:true}

);

restoredRecords++;

}

}

document.getElementById("lastBackup").innerHTML =
backup.createdAt || "-";

document.getElementById("historyTable").innerHTML = `

<tr>

<td>${new Date().toLocaleString()}</td>

<td>${backup.version || "V1.0"}</td>

<td>🔄 Restored</td>

</tr>

`;

alert(

`✅ Restore Completed Successfully

Collections : ${Object.keys(backup.data).length}

Records Restored : ${restoredRecords}`

);

}catch(error){

console.error(error);

alert("Restore Failed\n\n" + error.message);

}

};

console.log(
"Backup & Restore Module Loaded Successfully"
);
