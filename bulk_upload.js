import { db } from "./firebase.js";

import {
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const uploadBtn=document.getElementById("uploadBtn");

uploadBtn.addEventListener("click",uploadCSV);

async function uploadCSV(){

const file=document.getElementById("csvFile").files[0];

const type=document.getElementById("uploadType").value;

if(!file){

alert("Please Select CSV File");

return;

}

const reader=new FileReader();

reader.onload=async function(e){

const csv=e.target.result.trim();

const rows=csv.split("\n");

if(rows.length<=1){

alert("CSV Empty");

return;

}

const headers=rows[0].split(",");

let success=0;

let failed=0;
for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

if(cols.length<7){

failed++;

continue;

}

const emis=cols[0].trim();

const name=cols[1].trim();

const studentClass=cols[2].trim();

const section=cols[3].trim();

const father=cols[4].trim();

const mother=cols[5].trim();

const mobile=cols[6].trim();

try{

const ref=doc(db,"students",emis);

const snap=await getDoc(ref);

if(snap.exists()){

console.log("Updating :",emis);

}else{

console.log("Creating :",emis);

}

await setDoc(ref,{

emis:emis,

name:name,

class:studentClass,

section:section,

father:father,

mother:mother,

mobile:mobile,

attendance:"0%",

updatedAt:new Date().toISOString()

});

success++;

}catch(err){

console.error(err);

failed++;

}

}

alert(
"Import Completed\n\n"+
"Success : "+success+
"\nFailed : "+failed
);

document.getElementById("status").innerHTML=
"✅ Import Finished";

};

reader.readAsText(file);

}
