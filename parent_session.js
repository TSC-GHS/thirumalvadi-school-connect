// Parent Session Manager

export function saveParentEMIS(emis){

localStorage.setItem("parentEMIS", emis);

}

export function getParentEMIS(){

return localStorage.getItem("parentEMIS");

}

export function clearParentEMIS(){

localStorage.removeItem("parentEMIS");

}
// Check Parent Login

export function isParentLoggedIn(){

return getParentEMIS() !== null;

}

// Auto Redirect

export function requireParentLogin(){

const emis = getParentEMIS();

if(!emis){

alert("Please Login First");

window.location.href = "login.html";

return null;

}

return emis;

}
