window.saveMarks = async function () {

  if (students.length === 0) {
    alert("Load Students First");
    return;
  }

  const examType = document.getElementById("examType").value;

  let saved = 0;

  for (const student of students) {

    const tamil = Number(document.getElementById(`tam_${student.emis}`).value);
    const english = Number(document.getElementById(`eng_${student.emis}`).value);
    const maths = Number(document.getElementById(`mat_${student.emis}`).value);
    const science = Number(document.getElementById(`sci_${student.emis}`).value);
    const social = Number(document.getElementById(`soc_${student.emis}`).value);

    // ===== Total =====

    const total =
      tamil +
      english +
      maths +
      science +
      social;

    const percentage = Number((total / 5).toFixed(2));

    // ===== PASS / FAIL =====

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

    // ===== Grade =====

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

    } else {

      grade = "D";

    }
    window.saveMarks = async function () {

  if (students.length === 0) {
    alert("Load Students First");
    return;
  }

  const examType = document.getElementById("examType").value;

  let saved = 0;

  for (const student of students) {

    const tamil = Number(document.getElementById(`tam_${student.emis}`).value);
    const english = Number(document.getElementById(`eng_${student.emis}`).value);
    const maths = Number(document.getElementById(`mat_${student.emis}`).value);
    const science = Number(document.getElementById(`sci_${student.emis}`).value);
    const social = Number(document.getElementById(`soc_${student.emis}`).value);

    // ===== Total =====

    const total =
      tamil +
      english +
      maths +
      science +
      social;

    const percentage = Number((total / 5).toFixed(2));

    // ===== PASS / FAIL =====

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

    // ===== Grade =====

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

    } else {

      grade = "D";

    }
