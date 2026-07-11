import { auth, db } from "../firebase.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
doc,
getDoc,
collection,
getDocs,
query,
orderBy,
limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const emis=localStorage.getItem("parentEMIS");

if(!emis){

alert("Please Login");

location.href="parent_login.html";

}

async function loadDashboard(){

try{

const snap=await getDoc(doc(db,"students",emis));

if(!snap.exists()){

alert("Student Not Found");

return;

}

const student=snap.data();

document.getElementById("name").innerHTML=student.name||"-";
document.getElementById("emisNo").innerHTML=student.emis||emis;
document.getElementById("class").innerHTML=student.class||"-";
document.getElementById("section").innerHTML=student.section||"-";
document.getElementById("attendance").innerHTML=student.attendance||"0%";

loadHomework(student.class);

loadNotice();

}catch(err){

console.log(err);

alert(err.message);

}

}

async function loadHomework(cls){

const div=document.getElementById("latestHomework");

div.innerHTML="Loading...";

try{

const snap=await getDocs(collection(db,"homework"));

let html="";

snap.forEach(d=>{

const hw=d.data();

if(hw.class==cls){

html+=`

<p>

<b>${hw.subject}</b>

<br>

${hw.homework}

</p>

<hr>

`;

}

});

if(html===""){

html="No Homework";

}

div.innerHTML=html;

}catch{

div.innerHTML="Unable to Load";

}

}

async function loadNotice(){

const q=query(

collection(db,"notice"),

orderBy("createdAt","desc"),

limit(1)

);

try{

const snap=await getDocs(q);

if(snap.empty){

document.getElementById("latestNotice").innerHTML="No Notice";

return;

}

snap.forEach(d=>{

const n=d.data();

document.getElementById("latestNotice").innerHTML=n.notice;

});

}catch{

document.getElementById("latestNotice").innerHTML="No Notice";

}

}

window.logoutParent=async()=>{

await signOut(auth);

localStorage.clear();

location.href="parent_login.html";

}

loadDashboard();
