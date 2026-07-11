import { db } from "../firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
serverTimestamp,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const noticeList =
document.getElementById("noticeList");

// ======================================
// Save Notice
// ======================================

window.saveNotice = async function(){

const title =
document.getElementById("title").value.trim();

const description =
document.getElementById("description").value.trim();

const priority =
document.getElementById("priority").value;

if(!title || !description){

alert("Please fill all fields");

return;

}

try{

await addDoc(collection(db,"notices"),{

title,
description,
priority,

postedBy:
localStorage.getItem("teacherName") || "Teacher",

createdAt:
serverTimestamp()

});

alert("✅ Notice Published Successfully");

document.getElementById("title").value="";
document.getElementById("description").value="";
document.getElementById("priority").value="Normal";

loadNotices();

}catch(error){

console.error(error);

alert(error.message);

}
// ======================================
// Load Notices
// ======================================

async function loadNotices(){

try{

const q = query(

collection(db,"notices"),

orderBy("createdAt","desc")

);

const snap = await getDocs(q);

noticeList.innerHTML = "";

if(snap.empty){

noticeList.innerHTML = `
<div class="card">
<h3>No Notices Available</h3>
</div>
`;

return;

}

snap.forEach((noticeDoc)=>{

const notice = noticeDoc.data();

let createdDate = "-";

if(notice.createdAt && notice.createdAt.toDate){

createdDate =
notice.createdAt.toDate().toLocaleString("en-IN");

}

noticeList.innerHTML += `

<div class="card notice">

<h3>${notice.title}</h3>

<p>${notice.description}</p>

<p><b>Priority :</b> ${notice.priority}</p>

<p><b>Posted By :</b> ${notice.postedBy}</p>

<p><b>Date :</b> ${createdDate}</p>

<button
class="delete"
onclick="deleteNotice('${noticeDoc.id}')">

🗑 Delete Notice

</button>

</div>

`;

});

}catch(error){

console.error(error);

noticeList.innerHTML = `
<div class="card">
<h3 style="color:red;">${error.message}</h3>
</div>
`;

}

}

// ======================================
// Delete Notice
// ======================================

window.deleteNotice = async function(id){

const ok = confirm("Delete this notice?");

if(!ok) return;

try{

await deleteDoc(doc(db,"notices",id));

alert("✅ Notice Deleted");

loadNotices();

}catch(error){

console.error(error);

alert(error.message);

}

};

// ======================================
// Initialize
// ======================================

loadNotices();

// ======================================
// Auto Refresh
// ======================================

setInterval(loadNotices,30000);

console.log("================================");
console.log("School Connect TN");
console.log("Notice Management V1");
console.log("================================");
};
