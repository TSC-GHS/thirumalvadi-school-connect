//==================================================
// School Connect TN
// Report Card
//==================================================

import { db } from "../firebase.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//==================================================
// Load Report
//==================================================

window.loadReport = async function () {

try{

const emisBox = document.getElementById("emis");

const inputEmis =
emisBox ? emisBox.value.trim() : "";

const sessionEmis =
localStorage.getItem("parentEMIS") ||
sessionStorage.getItem("parentEMIS");

const emis = inputEmis || sessionEmis;

if(!emis){

alert("Please Enter EMIS Number");

return;

}

if(emisBox){

emisBox.value = emis;

}

//==================================================
// Student Details
//==================================================

const studentSnap =
await getDoc(doc(db,"students",emis));

if(!studentSnap.exists()){

alert("Student Not Found");

return;

}

const student =
studentSnap.data();

document.getElementById("name").textContent =
student.name || "-";

document.getElementById("emisNo").textContent =
student.emis || emis;

document.getElementById("class").textContent =
student.class || "-";

document.getElementById("section").textContent =
student.section || "-";

if(student.photo){

document.getElementById("studentPhoto").src =
student.photo;

}

//==================================================
// Report Card
//==================================================

const exams = [

"Unit Test",
"Quarterly",
"Half Yearly",
"Annual"

];

const tbody =
document.getElementById("reportTable");

tbody.innerHTML = "";

let reportFound = false;

for(const exam of exams){

const snap =
await getDoc(
doc(
db,
"marks",
exam,
"students",
emis
)
);

if(!snap.exists()){

continue;

}

reportFound = true;

const m = snap.data();

tbody.innerHTML += `

<tr style="background:#1565C0;color:white;font-weight:bold;">
<td colspan="2">${exam}</td>
</tr>

<tr>
<td>Tamil</td>
<td>${m.tamil ?? "-"}</td>
</tr>

<tr>
<td>English</td>
<td>${m.english ?? "-"}</td>
</tr>

<tr>
<td>Maths</td>
<td>${m.maths ?? "-"}</td>
</tr>

<tr>
<td>Science</td>
<td>${m.science ?? "-"}</td>
</tr>

<tr>
<td>Social</td>
<td>${m.social ?? "-"}</td>
</tr>

<tr class="summary">
<td>Total</td>
<td>${m.total ?? "-"}</td>
</tr>

<tr class="summary">
<td>Percentage</td>
<td>${m.percentage ?? "-"}%</td>
</tr>

<tr class="summary">
<td>Grade</td>
<td>${m.grade ?? "-"}</td>
</tr>

<tr class="summary">
<td>Result</td>

<td class="${
m.result==="PASS"
? "pass"
: "fail"
}">
${m.result ?? "-"}
</td>

</tr>

`;

}

if(!reportFound){

tbody.innerHTML = `

<tr>

<td colspan="2">

No Report Available

</td>

</tr>

`;

}

}catch(error){

console.error(error);

alert(error.message);

}

};

//==================================================
// Auto Load Parent Report
//==================================================

window.addEventListener("DOMContentLoaded",()=>{

const parentEmis =
localStorage.getItem("parentEMIS") ||
sessionStorage.getItem("parentEMIS");

const emisBox =
document.getElementById("emis");

if(parentEmis && emisBox){

emisBox.value = parentEmis;

}

window.loadReport();

});
