import { db } from "../firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const marksTable = document.getElementById("marksTable");

let students = [];

window.loadStudents = async function () {

  marksTable.innerHTML = "";
  students = [];

  const selectedClass = document.getElementById("classFilter").value;
  const selectedSection = document.getElementById("sectionFilter").value;
  const examType = document.getElementById("examType").value;

  if (!selectedClass || !selectedSection || !examType) {

    alert("Please select Exam, Class and Section");

    return;

  }

  const q = query(

    collection(db,"students"),

    where("class","==",selectedClass),

    where("section","==",selectedSection)

  );

  const snap = await getDocs(q);

  if(snap.empty){

    marksTable.innerHTML = `

    <tr>

      <td colspan="6">

      No Students Found

      </td>

    </tr>

    `;

    return;

  }

  snap.forEach((docSnap)=>{

    const student = docSnap.data();

    students.push(student);

    marksTable.innerHTML += `

<tr>

<td>${student.name}</td>

<td>

<input
type="number"
id="tam_${student.emis}"
min="0"
max="100"
value="0">

</td>

<td>

<input
type="number"
id="eng_${student.emis}"
min="0"
max="100"
value="0">

</td>

<td>

<input
type="number"
id="mat_${student.emis}"
min="0"
max="100"
value="0">

</td>

<td>

<input
type="number"
id="sci_${student.emis}"
min="0"
max="100"
value="0">

</td>

<td>

<input
type="number"
id="soc_${student.emis}"
min="0"
max="100"
value="0">

</td>

</tr>

`;

  });

};
window.saveMarks = async function () {

  if (students.length === 0) {
    alert("Load Students First");
    return;
  }

  const examType = document.getElementById("examType").value;
  const academicYear =
document.getElementById("academicYear").value;

const medium =
document.getElementById("medium").value;

  let saved = 0;

  for (const student of students) {

    const tamil = Number(document.getElementById(`tam_${student.emis}`).value);
    const english = Number(document.getElementById(`eng_${student.emis}`).value);
    const maths = Number(document.getElementById(`mat_${student.emis}`).value);
    const science = Number(document.getElementById(`sci_${student.emis}`).value);
    const social = Number(document.getElementById(`soc_${student.emis}`).value);

    const total = tamil + english + maths + science + social;

    const percentage = Number((total / 5).toFixed(2));

    // PASS / FAIL
    let result = "PASS";

    if (
      tamil < 35 ||
      english < 35 ||
      maths < 35 ||
      science < 35 ||
      social < 35
    ) {
      result = "FAIL";
    }

    // Grade
    let grade = "";

    if (result === "FAIL") {
      grade = "FAIL";
    } else if (percentage >= 90) {
      grade = "A+";
    } else if (percentage >= 80) {
      grade = "A";
    } else if (percentage >= 70) {
      grade = "B+";
    } else if (percentage >= 60) {
      grade = "B";
    } else if (percentage >= 50) {
      grade = "C";
    } else if (percentage >= 35) {
      grade = "D";
    } else {
      grade = "E";
    }

    await setDoc(
      doc(db, "marks", examType, "students", student.emis),
      {
        emis: student.emis,
        name: student.name,
        class: student.class,
        section: student.section,
        exam: examType,
        academicYear: academicYear,

medium: medium,

        tamil,
        english,
        maths,
        science,
        social,

        total,
        percentage,
        grade,
        result,

        updatedAt: new Date().toISOString()
      }
    );

    saved++;
  }

  alert(`✅ Marks Saved Successfully\n\nRecords Saved : ${saved}`);
};
