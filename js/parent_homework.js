//==========================================
// School Connect TN
// Parent Homework
// Part 1
//==========================================

import { db } from "../firebase.js";

import {
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const emis = localStorage.getItem("parentEMIS");

if(!emis){

alert("Session Expired");

location.href="login.html";

}

async function loadHomework(){

try{

const studentSnap = await getDoc(
doc(db,"students",emis)
);

if(!studentSnap.exists()){

alert("Student Not Found");

return;

}

const student = studentSnap.data();

const studentClass = student.class;
const studentSection = student.section;

const homeworkSnap = await getDocs(
collection(db,"homework")
);

let html = "";
let count = 0;

homeworkSnap.forEach((docSnap)=>{

const hw = docSnap.data();

if(
hw.class == studentClass &&
hw.section == studentSection
){

count++;

html += `
<tr>

<td>${hw.subject || "-"}</td>

<td>${hw.homework || "-"}</td>

<td>${hw.dueDate || "-"}</td>

</tr>
`;

}

});
if(count===0){

document.getElementById("homeworkTable").innerHTML = `
<tr>
<td colspan="3">
No Homework Available
</td>
</tr>
`;

}else{

document.getElementById("homeworkTable").innerHTML = html;

}

}catch(error){

console.error(error);

document.getElementById("homeworkTable").innerHTML = `
<tr>
<td colspan="3">
Unable to Load Homework
</td>
</tr>
`;

}

}

window.addEventListener("DOMContentLoaded",()=>{

loadHomework();

});
