import { db } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const attendanceBody =
document.getElementById("attendanceBody");

const presentCount =
document.getElementById("presentCount");

const absentCount =
document.getElementById("absentCount");

const attendancePercent =
document.getElementById("attendancePercent");

const emis =
localStorage.getItem("parentEMIS");

async function loadAttendance(){

if(!emis){

attendanceBody.innerHTML=`
<tr>
<td colspan="2">
EMIS Number Not Found
</td>
</tr>
`;

return;

}

try{

const q=query(

collection(db,"attendance"),

where("emis","==",String(emis)),

orderBy("date","desc")

);

const snap=await getDocs(q);

attendanceBody.innerHTML="";

let present=0;
let absent=0;

if(snap.empty){

attendanceBody.innerHTML=`
<tr>
<td colspan="2">
No Attendance Found
</td>
</tr>
`;

return;

}

snap.forEach((docSnap)=>{

const a=docSnap.data();

if(a.status==="Present"){

present++;

}else{

absent++;

}

attendanceBody.innerHTML+=`

<tr>

<td>${a.date}</td>

<td class="${
a.status==="Present"
?"statusPresent"
:"statusAbsent"
}">

${a.status}

</td>

</tr>

`;

});

presentCount.innerHTML=present;

absentCount.innerHTML=absent;

const total=present+absent;

attendancePercent.innerHTML=
total===0
?"0%"
:((present/total)*100).toFixed(1)+"%";

}catch(error){

console.error(error);

attendanceBody.innerHTML=`
<tr>
<td colspan="2">
${error.message}
</td>
</tr>
`;

}

}

loadAttendance();
