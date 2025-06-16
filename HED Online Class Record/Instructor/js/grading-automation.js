// Store the selected subject in localStorage
let selectedSubject = localStorage.getItem("selectedSubject") || "";

// Load existing students from localStorage and populate the table
function loadStudents(tableType) {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const tbody = document.getElementById(`${tableType}StudentRows`);
  const subjectSelect = document.getElementById("subjectSelect");
  const selectedSubject = subjectSelect
    ? subjectSelect.value
    : localStorage.getItem("selectedSubject") || "";

  tbody.innerHTML = "";

  students.forEach((student) => {
    if (selectedSubject && student.subject.includes(selectedSubject)) {
      const row = document.createElement("tr");
      row.dataset.student = student.id;
      row.innerHTML = `
        <td class="student-name editable" contenteditable="true">${
          student.name
        }</td>
        <td class="course-year editable" contenteditable="true">${
          student.program
        }-${student.year.replace(" Year", "")}</td>
        ${
          tableType === "midterm"
            ? `
          <td><input type="number" class="grade-input quiz1" data-max="35" min="0" value="${
            student.quiz1 || ""
          }"></td>
          <td><input type="number" class="grade-input quiz2" data-max="20" min="0" value="${
            student.quiz2 || ""
          }"></td>
          <td><input type="number" class="grade-input quiz3" data-max="25" min="0" value="${
            student.quiz3 || ""
          }"></td>
          <td><input type="number" class="grade-input quiz4" data-max="40" min="0" value="${
            student.quiz4 || ""
          }"></td>
          <td><input type="number" class="grade-input quiz5" data-max="40" min="0" value="${
            student.quiz5 || ""
          }"></td>
          <td><input type="number" class="grade-input quiz6" data-max="75" min="0" value="${
            student.quiz6 || ""
          }"></td>
          <td><input type="number" class="grade-input oral1" data-max="50" min="0" value="${
            student.oral1 || ""
          }"></td>
          <td class="calculated quiz-total"></td>
          <td class="calculated quiz-ave"></td>
          <td class="calculated quiz-eqv"></td>
          <td><input type="number" class="grade-input output1" data-max="50" min="0" value="${
            student.output1 || ""
          }"></td>
          <td><input type="number" class="grade-input output2" data-max="50" min="0" value="${
            student.output2 || ""
          }"></td>
          <td class="calculated output-total"></td>
          <td class="calculated output-ave"></td>
          <td class="calculated output-eqv"></td>
          <td><input type="number" class="grade-input exam1" data-max="50" min="0" value="${
            student.exam1 || ""
          }"></td>
          <td class="calculated exam-ave"></td>
          <td class="calculated exam-eqv"></td>
          <td class="calculated fg"></td>
          <td class="calculated midterm"></td>
          <td class="calculated midterm-value"></td>
          <td class="calculated remarks"></td>
        `
            : `
          <td><input type="number" class="grade-input quiz1" data-max="20" min="0" value="${
            student.quiz1 || ""
          }"></td>
          <td><input type="number" class="grade-input quiz2" data-max="40" min="0" value="${
            student.quiz2 || ""
          }"></td>
          <td><input type="number" class="grade-input quiz3" data-max="40" min="0" value="${
            student.quiz3 || ""
          }"></td>
          <td><input type="number" class="grade-input quiz4" data-max="50" min="0" value="${
            student.quiz4 || ""
          }"></td>
          <td><input type="number" class="grade-input oral1" data-max="50" min="0" value="${
            student.oral1 || ""
          }"></td>
          <td class="calculated quiz-total"></td>
          <td class="calculated quiz-ave"></td>
          <td class="calculated quiz-eqv"></td>
          <td><input type="number" class="grade-input output1" data-max="100" min="0" value="${
            student.output1 || ""
          }"></td>
          <td><input type="number" class="grade-input output2" data-max="100" min="0" value="${
            student.output2 || ""
          }"></td>
          <td class="calculated output-total"></td>
          <td class="calculated output-ave"></td>
          <td class="calculated output-eqv"></td>
          <td><input type="number" class="grade-input exam1" data-max="50" min="0" value="${
            student.exam1 || ""
          }"></td>
          <td class="calculated exam-ave"></td>
          <td class="calculated exam-eqv"></td>
          <td class="calculated fg"></td>
          <td class="calculated final"></td>
          <td class="calculated final-value"></td>
          <td class="calculated remarks"></td>
        `
        }
      `;
      tbody.appendChild(row);

      // Add input event listeners for real-time updates
      row.querySelectorAll(".grade-input").forEach((input) => {
        input.addEventListener("input", (e) => {
          const max = parseInt(input.dataset.max);
          const value = parseInt(e.target.value) || 0;
          if (value > max) input.value = max;
          calculateRow(row, tableType);
        });
      });
    }
  });

  updateTitle(tableType, selectedSubject);
  if (subjectSelect) {
    subjectSelect.value = selectedSubject;
  }
}

// Update the title with the selected subject
function updateTitle(tableType, subject) {
  const title = document.getElementById(`${tableType}SubjectTitle`);
  title.textContent = `${subject || "Subject Code and Title"} - ${
    tableType === "midterm" ? "Midterm" : "Final"
  } Class Record`;
}

// Load subject data and refresh table
function loadSubjectData() {
  const subjectSelect = document.getElementById("subjectSelect");
  const selectedSubject = subjectSelect.value;
  localStorage.setItem("selectedSubject", selectedSubject);

  const midtermBtn = document.getElementById("midtermBtn");
  const finalBtn = document.getElementById("finalBtn");
  const tableType = midtermBtn.classList.contains("btn-active")
    ? "midterm"
    : "final";
  loadStudents(tableType);
}

// Show the selected table
function showTable(tableType) {
  const midtermContainer = document.getElementById("midtermContainer");
  const finalContainer = document.getElementById("finalContainer");
  const midtermBtn = document.getElementById("midtermBtn");
  const finalBtn = document.getElementById("finalBtn");

  if (tableType === "midterm") {
    midtermContainer.classList.remove("hidden");
    finalContainer.classList.add("hidden");
    midtermBtn.classList.replace("btn-primary", "btn-active");
    finalBtn.classList.replace("btn-active", "btn-primary");
  } else {
    finalContainer.classList.remove("hidden");
    midtermContainer.classList.add("hidden");
    finalBtn.classList.replace("btn-primary", "btn-active");
    midtermBtn.classList.replace("btn-active", "btn-primary");
  }
  loadSubjectData();
}

// Calculate a single row
function calculateRow(row, tableType) {
  // Get all grade inputs
  const quizInputs = row.querySelectorAll(".grade-input[class*=quiz]");
  const oralInput = row.querySelector(".oral1");
  const outputInputs = row.querySelectorAll(".grade-input[class*=output]");
  const examInput = row.querySelector(".exam1");

  // Calculate Quizzes/Oral
  let quizTotal = 0;
  let quizMaxTotal = 0;
  quizInputs.forEach((input) => {
    const value = parseInt(input.value) || 0;
    const max = parseInt(input.dataset.max);
    quizTotal += value;
    quizMaxTotal += max;
  });
  const oralValue = parseInt(oralInput.value) || 0;
  const oralMax = parseInt(oralInput.dataset.max);
  quizTotal += oralValue;
  quizMaxTotal += oralMax;

  const quizAve = quizMaxTotal
    ? ((quizTotal / quizMaxTotal) * 100).toFixed(2)
    : 0;
  const quizEqv = quizAve
    ? (quizAve / 100) * (tableType === "midterm" ? 30 : 30)
    : 0; // 30% for both

  // Calculate Output
  let outputTotal = 0;
  let outputMaxTotal = 0;
  outputInputs.forEach((input) => {
    const value = parseInt(input.value) || 0;
    const max = parseInt(input.dataset.max);
    outputTotal += value;
    outputMaxTotal += max;
  });
  const outputAve = outputMaxTotal
    ? ((outputTotal / outputMaxTotal) * 100).toFixed(2)
    : 0;
  const outputEqv = outputAve
    ? (outputAve / 100) * (tableType === "midterm" ? 30 : 40)
    : 0; // 30% midterm, 40% final

  // Calculate Exam
  const examValue = parseInt(examInput.value) || 0;
  const examMax = parseInt(examInput.dataset.max);
  const examAve = examMax ? ((examValue / examMax) * 100).toFixed(2) : 0;
  const examEqv = examAve ? (examAve / 100) * 40 : 0; // 40% for both

  // Calculate Final Grade
  const finalGrade = (quizEqv + outputEqv + examEqv).toFixed(2);

  // Grade Transmutation Function (Adjusted for 3.0 as passing)
  const gradeValue = transmuteGrade(finalGrade);

  // Remarks
  const remarks = gradeValue <= 3.0 ? "PASSED" : "FAILED";

  // Update calculated cells
  row.querySelector(".quiz-total").textContent = quizTotal;
  row.querySelector(".quiz-ave").textContent = quizAve;
  row.querySelector(".quiz-eqv").textContent = quizEqv.toFixed(1);
  row.querySelector(".output-total").textContent = outputTotal;
  row.querySelector(".output-ave").textContent = outputAve;
  row.querySelector(".output-eqv").textContent = outputEqv.toFixed(1);
  row.querySelector(".exam-ave").textContent = examAve;
  row.querySelector(".exam-eqv").textContent = examEqv.toFixed(1);
  row.querySelector(".fg").textContent = finalGrade;
  row.querySelector(
    `.${tableType === "midterm" ? "midterm" : "final"}`
  ).textContent = finalGrade;
  row.querySelector(
    `.${tableType === "midterm" ? "midterm-value" : "final-value"}`
  ).textContent = gradeValue;
  const remarksCell = row.querySelector(".remarks");
  remarksCell.textContent = remarks;
  remarksCell.className = `calculated remarks ${
    remarks === "PASSED" ? "passed" : "failed"
  }`;

  // Save to localStorage
  saveStudentGrades(row, tableType, {
    quizTotal,
    quizAve,
    quizEqv,
    outputTotal,
    outputAve,
    outputEqv,
    examAve,
    examEqv,
    finalGrade,
    gradeValue,
    remarks,
  });
}

// Save student grades to localStorage
function saveStudentGrades(row, tableType, grades) {
  const studentId = row.dataset.student;
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const student = students.find((s) => s.id == studentId);
  if (student) {
    if (tableType === "midterm") {
      student.quiz1 = row.querySelector(".quiz1").value || 0;
      student.quiz2 = row.querySelector(".quiz2").value || 0;
      student.quiz3 = row.querySelector(".quiz3").value || 0;
      student.quiz4 = row.querySelector(".quiz4").value || 0;
      student.quiz5 = row.querySelector(".quiz5").value || 0;
      student.quiz6 = row.querySelector(".quiz6").value || 0;
      student.oral1 = row.querySelector(".oral1").value || 0;
      student.output1 = row.querySelector(".output1").value || 0;
      student.output2 = row.querySelector(".output2").value || 0;
      student.exam1 = row.querySelector(".exam1").value || 0;
      student.midterm = grades.finalGrade;
    } else {
      student.quiz1 = row.querySelector(".quiz1").value || 0;
      student.quiz2 = row.querySelector(".quiz2").value || 0;
      student.quiz3 = row.querySelector(".quiz3").value || 0;
      student.quiz4 = row.querySelector(".quiz4").value || 0;
      student.oral1 = row.querySelector(".oral1").value || 0;
      student.output1 = row.querySelector(".output1").value || 0;
      student.output2 = row.querySelector(".output2").value || 0;
      student.exam1 = row.querySelector(".exam1").value || 0;
      student.final = grades.finalGrade;
    }
    localStorage.setItem("students", JSON.stringify(students));
  }
}

// Grade Transmutation Function (Adjusted for 3.0 as passing)
function transmuteGrade(score) {
  if (score >= 97) return "1.0";
  if (score >= 94) return "1.25";
  if (score >= 91) return "1.5";
  if (score >= 88) return "1.75";
  if (score >= 85) return "2.0";
  if (score >= 82) return "2.25";
  if (score >= 79) return "2.5";
  if (score >= 76) return "2.75";
  if (score >= 75) return "3.0"; // 3.0 is passing
  if (score >= 70) return "3.5";
  if (score >= 65) return "4.0";
  return "5.0"; // Failed
}

// Calculate all grades
function calculateAll(tableType) {
  const rows = document.querySelectorAll(`#${tableType}Table tbody tr`);
  rows.forEach((row) => calculateRow(row, tableType));
}

// Clear all grades
function clearAll(tableType) {
  const rows = document.querySelectorAll(`#${tableType}Table tbody tr`);
  rows.forEach((row) => {
    row.querySelectorAll(".grade-input").forEach((input) => {
      input.value = "";
    });
    row.querySelectorAll(".calculated").forEach((cell) => {
      cell.textContent = "";
      if (cell.classList.contains("remarks")) {
        cell.className = "calculated remarks";
      }
    });
  });
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  students.forEach((student) => {
    if (tableType === "midterm") {
      student.quiz1 = 0;
      student.quiz2 = 0;
      student.quiz3 = 0;
      student.quiz4 = 0;
      student.quiz5 = 0;
      student.quiz6 = 0;
      student.oral1 = 0;
      student.output1 = 0;
      student.output2 = 0;
      student.exam1 = 0;
      student.midterm = 0;
    } else {
      student.quiz1 = 0;
      student.quiz2 = 0;
      student.quiz3 = 0;
      student.quiz4 = 0;
      student.oral1 = 0;
      student.output1 = 0;
      student.output2 = 0;
      student.exam1 = 0;
      student.final = 0;
    }
  });
  localStorage.setItem("students", JSON.stringify(students));
  loadSubjectData();
}

// Add a new student
function addStudent() {
  const name = prompt("Enter student name:");
  const program = prompt("Enter program (e.g., BSED):");
  const year = prompt("Enter year (e.g., 1):");
  const subject = [
    localStorage.getItem("selectedSubject") ||
      prompt("Enter subject (e.g., GE 4):"),
  ].map((s) => s.trim());

  if (name && program && year && subject[0]) {
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const newStudent = {
      id: Date.now(),
      name,
      program,
      year: `${year} Year`,
      subject,
      quiz1: 0,
      quiz2: 0,
      quiz3: 0,
      quiz4: 0,
      quiz5: 0,
      quiz6: 0,
      oral1: 0,
      output1: 0,
      output2: 0,
      exam1: 0,
      midterm: 0,
      final: 0,
      average: 0,
    };
    students.push(newStudent);
    localStorage.setItem("students", JSON.stringify(students));
    loadSubjectData();
  }
}

// Export to Excel
function exportToExcel(tableType) {
  const table = document.getElementById(`${tableType}Table`);
  const wb = XLSX.utils.table_to_book(table, { sheet: `${tableType} Record` });
  XLSX.writeFile(wb, `${tableType}Record.xlsx`);
}

// Export to PDF
function exportToPDF(tableType) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const table = document.getElementById(`${tableType}Table`);
  doc.autoTable({ html: table });
  doc.save(`${tableType}Record.pdf`);
}

// Initialize on page load with midterm table
document.addEventListener("DOMContentLoaded", () => {
  showTable("midterm");
  loadSubjectData();
});

// Add event listener for real-time calculation on input change
document.addEventListener("input", (e) => {
  if (e.target.classList.contains("grade-input")) {
    const row = e.target.closest("tr");
    const tableType = document
      .getElementById("midtermBtn")
      .classList.contains("btn-active")
      ? "midterm"
      : "final";
    calculateRow(row, tableType);
  }
});
