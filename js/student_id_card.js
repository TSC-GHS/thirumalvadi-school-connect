import { db } from "../firebase.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const emis = params.get("emis");

async function loadStudent(){

if(!emis){

alert("EMIS Number Missing");

return;

}

try{

const studentRef = doc(db,"students",emis);

const snap = await getDoc(studentRef);

if(!snap.exists()){

alert("Student Not Found");

return;

}

const student = snap.data();

document.getElementById("name").textContent = student.name || "-";

document.getElementById("emis").textContent = student.emis || emis;

document.getElementById("class").textContent = student.class || "-";

document.getElementById("section").textContent = student.section || "-";

document.getElementById("father").textContent = student.father || "-";

document.getElementById("mother").textContent = student.mother || "-";

document.getElementById("mobile").textContent = student.mobile || "-";

document.getElementById("blood").textContent = student.blood || "N/A";

/* Student Photo */

if(student.photo && student.photo!=""){

document.getElementById("studentPhoto").src = student.photo;

}

/* Dynamic QR */

document.querySelector(".qr-box img").src =
"https://api.qrserver.com/v1/create-qr-code/?size=120x120&data="+student.emis;

}

catch(error){

console.log(error);

alert(error.message);

}

}

window.printCard=function(){

window.print();

}

loadStudent();
