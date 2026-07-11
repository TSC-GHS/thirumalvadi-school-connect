import { auth, db } from "./firebase.js";

import {
signInWithEmailAndPassword,
signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
doc,
getDoc,
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// =====================================
// Login Function
// =====================================

window.loginUser = async function(){

let loginId =
document.getElementById("email").value.trim();

const password =
document.getElementById("password").value.trim();

const selectedRole =
document.getElementById("role").value;

if(loginId==="" || password===""){

alert("Please enter Login ID and Password");

return;

}
// =====================================
// Parent Login
// =====================================

if(selectedRole==="Parent"){

loginId = loginId + "@schoolconnecttn.app";

}

// =====================================
// Student Login
// =====================================

if(selectedRole==="Student"){

loginId = loginId + "@student.schoolconnecttn.app";

}

try{

// Firebase Authentication

const credential =
await signInWithEmailAndPassword(

auth,

loginId,

password

);

// =====================================
// User Record
// =====================================

const userRef =
doc(db,"users",loginId);

const userSnap =
await getDoc(userRef);

if(!userSnap.exists()){

alert("User Record Not Found");

await signOut(auth);

return;

}

const user =
userSnap.data();

// =====================================
// Role Validation
// =====================================

if(user.role !== selectedRole){

alert("Selected Role is Incorrect");

await signOut(auth);

return;

}
  // =====================================
// Login Redirect
// =====================================

switch(user.role){

case "Admin":

window.location.href="admin_dashboard.html";

break;

// =====================================
// Headmaster
// =====================================

case "Headmaster":

localStorage.setItem("userRole","Headmaster");
localStorage.setItem("userEmail",loginId);

window.location.href="headmaster.html";

break;

// =====================================
// Teacher
// =====================================

case "Teacher":{

const teacherQuery = query(
collection(db,"teachers"),
where("email","==",loginId)
);

const teacherSnap = await getDocs(teacherQuery);

if(teacherSnap.empty){

alert("Teacher record not found.");

await signOut(auth);

return;

}

const teacherDoc = teacherSnap.docs[0];

const teacher = teacherDoc.data();

// Save complete teacher session

localStorage.setItem("teacherDocId",teacherDoc.id);
localStorage.setItem("teacherId",teacher.id || "");
localStorage.setItem("teacherName",teacher.name || "");
localStorage.setItem("teacherType",teacher.teacherType || "");
localStorage.setItem("teacherClass",teacher.className || "");
localStorage.setItem("teacherSection",teacher.section || "");
localStorage.setItem("userRole","Teacher");

window.location.href="teacher.html";

break;

}
    // =====================================
// Parent
// =====================================

case "Parent":

localStorage.setItem("parentEMIS", user.emis || "");
localStorage.setItem("emis", user.emis || "");
localStorage.setItem("userRole", "Parent");

sessionStorage.setItem("parentEMIS", user.emis || "");
sessionStorage.setItem("emis", user.emis || "");

window.location.href = "parent_dashboard.html";

break;

// =====================================
// Student
// =====================================

case "Student":

localStorage.setItem("studentEMIS", user.emis || "");
localStorage.setItem("emis", user.emis || "");
localStorage.setItem("userRole", "Student");

sessionStorage.setItem("studentEMIS", user.emis || "");
sessionStorage.setItem("emis", user.emis || "");

window.location.href = "student.html";

break;

// =====================================
// Invalid Role
// =====================================

default:

alert("Invalid User Role");

await signOut(auth);

return;

}

}catch(error){

console.error(error);

alert("Login Failed\n\n" + error.message);

try{
await signOut(auth);
}catch(e){
console.log(e);
}

}

};
