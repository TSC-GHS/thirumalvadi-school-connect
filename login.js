import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

window.loginUser = async function () {

let loginId = document.getElementById("email").value.trim();

const password = document.getElementById("password").value.trim();

const selectedRole = document.getElementById("role").value;

if(loginId=="" || password==""){

alert("Please enter Login ID and Password");

return;

}

// Parent Login → EMIS to Email

if(selectedRole==="Parent"){

loginId = loginId + "@schoolconnecttn.app";

}

try{

await signInWithEmailAndPassword(auth,loginId,password);

const userRef = doc(db,"users",loginId);

const userSnap = await getDoc(userRef);

if(!userSnap.exists()){

alert("User record not found");

await signOut(auth);

return;

}

const user = userSnap.data();

if(user.role!==selectedRole){

alert("Invalid Role");

await signOut(auth);

return;

}
switch(user.role){

case "Admin":

window.location.href="admin_dashboard.html";
break;

case "Headmaster":

window.location.href="headmaster.html";
break;

case "Teacher":

window.location.href="teacher_dashboard.html";
break;

case "Student":

window.location.href="student.html";
break;

case "Parent":

localStorage.setItem("parentEMIS",user.emis);

window.location.href="parent_dashboard.html";
break;

default:

alert("Invalid User Role");

await signOut(auth);

return;

}

}catch(error){

alert("Login Failed\n\n"+error.message);
  await signOut(auth);

}

}
