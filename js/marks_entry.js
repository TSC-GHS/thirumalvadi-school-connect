// ===== Calculate Total =====

const tamil = Number(document.getElementById("tamil").value);
const english = Number(document.getElementById("english").value);
const maths = Number(document.getElementById("maths").value);
const science = Number(document.getElementById("science").value);
const social = Number(document.getElementById("social").value);

const total =
tamil +
english +
maths +
science +
social;

const percentage = (total / 5).toFixed(2);

// ===== PASS / FAIL =====

let result = "PASS";

if(
tamil < 35 ||
english < 35 ||
maths < 35 ||
science < 35 ||
social < 35
){
result = "FAIL";
}

// ===== Grade =====

let grade = "";

if(result === "FAIL"){

grade = "FAIL";

}else if(percentage >= 90){

grade = "A+";

}else if(percentage >= 80){

grade = "A";

}else if(percentage >= 70){

grade = "B+";

}else if(percentage >= 60){

grade = "B";

}else if(percentage >= 50){

grade = "C";

}else{

grade = "D";

}
