//==========================================
// School Connect TN
// Result Analytics
// Part 2
//==========================================

import { db } from "../firebase.js";

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const academicYear =
document.getElementById("academicYear");

const examType =
document.getElementById("examType");

const medium =
document.getElementById("medium");

const showResults =
document.getElementById("showResults");

const resultsContainer =
document.getElementById("resultsContainer");

showResults.addEventListener("click", loadResults);

//==========================================
// Load Results
//==========================================

async function loadResults(){

const year =
academicYear.value;

const exam =
examType.value;

const med =
medium.value;

if(
!year ||
!exam ||
!med
){

alert("Please Select Academic Year, Exam & Medium");

return;

}

resultsContainer.innerHTML = `
<p style="text-align:center;">
Loading Results...
</p>
`;

try{

const marksQuery = query(

collection(db,"marks",exam,"students"),

where("academicYear","==",year),

where("medium","==",med)

);

const marksSnap =
await getDocs(marksQuery);

if(marksSnap.empty){

resultsContainer.innerHTML = `
<p style="text-align:center;">
No Results Found
</p>
`;

return;

}

resultsContainer.innerHTML = `
<p style="text-align:center;color:green;">
✅ Records Found :
<b>${marksSnap.size}</b>
</p>
`;

}catch(error){

console.error(error);

resultsContainer.innerHTML = `
<p style="color:red;text-align:center;">
${error.message}
</p>
`;

}

}

console.log("Result Analytics Loaded");
