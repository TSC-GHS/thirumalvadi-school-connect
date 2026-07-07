import { auth } from "./firebase.js";
import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

window.loginUser = async function () {

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();
const role = document.getElementById("role").value;

try {

await signInWithEmailAndPassword(auth, email, password);

if(role === "Headmaster"){
location.href = "headmaster.html";
}
else if(role === "Teacher"){
location.href = "teacher_dashboard.html";
}
else if(role === "Parent"){
location.href = "parent_dashboard.html";
}
else if(role === "Student"){
location.href = "student.html";
}

}
catch(error){
alert("Login Failed\n\n" + error.message);
}

}
