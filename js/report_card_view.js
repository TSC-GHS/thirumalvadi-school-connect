import { db } from "../firebase.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const reportTable = document.getElementById("reportTable");

window.loadReport = async function(){

const emis = document.getElementById("emis").value.trim();

const examType = document.getElementById("examType").value;

if(emis=="" || examType==""){

alert("Please Enter EMIS and Select Exam");

return;

}

const snap = await getDoc(
doc(db,"marks",examType,"students",emis)
);

if(!snap.exists()){

reportTable.innerHTML=`
<tr>
<td colspan="2">
No Report Found
</td>
</tr>
`;

return;

}

const mark = snap.data();
reportTable.innerHTML = `

<tr>
<td>Tamil</td>
<td>${mark.tamil}</td>
</tr>

<tr>
<td>English</td>
<td>${mark.english}</td>
</tr>

<tr>
<td>Maths</td>
<td>${mark.maths}</td>
</tr>

<tr>
<td>Science</td>
<td>${mark.science}</td>
</tr>

<tr>
<td>Social</td>
<td>${mark.social}</td>
</tr>

`;

document.getElementById("total").textContent = mark.total;

document.getElementById("percentage").textContent =
mark.percentage + "%";

document.getElementById("grade").textContent =
mark.grade;

}
