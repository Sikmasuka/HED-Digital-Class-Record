document.addEventListener("DOMContentLoaded", () => {
  console.log("subject-class-record.js loaded - DOM ready");

  if (!window.location.pathname.endsWith("ClassRecord-Subject.html")) {
    console.log("Not on ClassRecord-Subject.html, exiting");
    return;
  }

  const innerBox = document.querySelector(".subject-inner-box");
  console.log("Queried innerBox:", innerBox);

  if (!innerBox) {
    console.error("Inner box not found - check HTML structure");
    document.body.innerHTML = `<p class="text-red-500 text-center p-4">Error: Inner box not found</p>`;
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const subjectName = urlParams.get("subject");
  console.log("Subject from URL:", subjectName);

  if (!subjectName) {
    console.error("No subject provided in URL");
    innerBox.innerHTML = `<p class="text-red-500">Error: No subject specified in URL</p>`;
    return;
  }

  initializeSubjectTemplate(subjectName);
  initializeBackButton();

  function initializeSubjectTemplate(subject) {
    console.log("Rendering template for subject:", subject);

    try {
      const outerContainer = document.querySelector(
        "div.bg-white.rounded-lg.shadow-md.border.border-gray-300.max-w-5xl.mx-auto.p-6"
      );
      console.log("Queried outerContainer:", outerContainer);
      if (outerContainer) {
        outerContainer.style.display = "block";
      } else {
        console.warn(
          "Outer container not found - template may not display correctly"
        );
      }

      innerBox.innerHTML = createSubjectTemplate(subject);
      innerBox.style.display = "block";
      console.log("Template rendered to innerBox");

      initializeSubjectFormControls(subject);
      console.log("Form controls initialized");
    } catch (error) {
      console.error("Error in subject template:", error);
      innerBox.innerHTML = `<p class="text-red-500">Error rendering template: ${error.message}</p>`;
    }
  }

  function createSubjectTemplate(subject) {
    console.log("Creating template for subject:", subject);
    return `
      <div>
        <h2 class="font-semibold text-lg text-[#163269] mb-4">${subject} Class Record</h2>
        <div class="flex justify-between items-center mb-4">
          <label for="yearSelect" class="font-semibold text-lg text-[#163269]">Year</label>
          <select id="yearSelect" class="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" selected>Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
        
        <select id="programSelect" class="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="" disabled selected>Select Program</option>
          <option class="text-red-500 font-semibold" value="IT">IT (Information Technology)</option>
          <option class="text-green-500 font-semibold" value="HM">HM (Hospitality Management)</option>
          <option class="text-yellow-500 font-semibold" value="BA">BA (Business Administration)</option>
        </select>
        
        <div id="classRecordTableContainer" class="overflow-x-auto hidden" style="overflow-x: auto; white-space: nowrap">
        </div>
        
        <div class="flex justify-between mt-6">
          <button id="backButton" class="text-blue-600 underline hover:text-blue-800">Back</button>
          <button id="saveGradeButton" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300">Save Grade</button>
        </div>
      </div>
    `;
  }

  function createGradesTable(subject, program, year) {
    console.log(
      `Creating table for subject: ${subject}, program: ${program}, year: ${year}`
    );
    const students = getFilteredStudents(subject, program, year);
    console.log("Filtered students:", students);
    return `
      <table class="w-full text-sm border border-gray-300 border-collapse">
        <thead class="bg-gray-200 text-black">
          <tr class="border">
            <th class="border border-gray-300 px-4 py-2 text-center font-bold whitespace-nowrap">Student Name</th>
            <th class="border border-gray-300 px-4 py-2 text-center font-bold">Status</th>
            <th class="border border-gray-300 px-4 py-2 text-center font-bold">Midterm (30%)</th>
            <th class="border border-gray-300 px-4 py-2 text-center font-bold">Final (70%)</th>
            <th class="border border-gray-300 px-4 py-2 text-center font-bold whitespace-nowrap">General Average</th>
            <th class="border border-gray-300 px-4 py-2 text-center font-bold">Remarks</th>
          </tr>
        </thead>
        <tbody class="text-left">
          ${createStudentRows(students)}
        </tbody>
      </table>
    `;
  }

  function createStudentRows(students) {
    if (students.length === 0) {
      return `<tr><td colspan="6" class="text-center py-4">No students found for this selection.</td></tr>`;
    }
    return students
      .map(
        (student) => `
          <tr class="hover:bg-gray-50" data-id="${student.id}">
            <td class="border px-4 py-2 whitespace-nowrap">${student.name}</td>
            <td class="border px-4 py-2 text-center">
              <span class="${
                student.statusClass
              } font-semibold px-3 py-1 rounded-full text-sm">${
          student.status
        }</span>
            </td>
            <td class="border px-4 py-2">
              <input type="number" value="${student.midterm.toFixed(
                2
              )}" step="0.01" min="1" max="5" 
                     class="midterm-input w-full px-2 py-1 border rounded text-left ${
                       student.isFailure ? "text-red-600 font-semibold" : ""
                     }" 
                     data-id="${student.id}" />
            </td>
            <td class="border px-4 py-2">
              <input type="number" value="${student.final.toFixed(
                2
              )}" step="0.01" min="1" max="5" 
                     class="final-input w-full px-2 py-1 border rounded text-left" 
                     data-id="${student.id}" />
            </td>
            <td class="border px-4 py-2 text-center ${
              student.isFailure ? "text-red-600 font-semibold" : ""
            }">${student.average.toFixed(2)}</td>
            <td class="border px-4 py-2 text-center">
              <span class="${
                student.remarksClass
              } font-semibold px-3 py-1 rounded-md text-sm">${
          student.remarks
        }</span>
            </td>
          </tr>
        `
      )
      .join("");
  }

  function initializeSubjectFormControls(subject) {
    const yearSelect = document.getElementById("yearSelect");
    const programSelect = document.getElementById("programSelect");
    const tableContainer = document.getElementById("classRecordTableContainer");
    const saveButton = document.getElementById("saveGradeButton");

    console.log("Form controls:", {
      yearSelect,
      programSelect,
      tableContainer,
      saveButton,
    });

    if (!yearSelect || !programSelect || !tableContainer || !saveButton) {
      console.error("Form controls not found:", {
        yearSelect,
        programSelect,
        tableContainer,
        saveButton,
      });
      innerBox.innerHTML = `<p class="text-red-500">Error: Form controls not found</p>`;
      return;
    }

    function updateTable() {
      const year = yearSelect.value;
      const program = programSelect.value;
      console.log("UpdateTable called - Year:", year, "Program:", program);

      if (!year || !program) {
        tableContainer.classList.add("hidden");
        console.log("Table hidden due to invalid year or program");
        return;
      }

      tableContainer.innerHTML = createGradesTable(subject, program, year);
      tableContainer.classList.remove("hidden");
      console.log("Table updated with content");
    }

    // Initial render
    updateTable();

    // Event listeners
    yearSelect.addEventListener("change", () => {
      console.log("Year changed:", yearSelect.value);
      updateTable();
    });

    programSelect.addEventListener("change", () => {
      console.log("Program changed:", programSelect.value);
      updateProgramSelectStyle(programSelect);
      updateTable();
    });

    saveButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (!yearSelect.value || !programSelect.value) {
        Swal.fire({
          title: "Error!",
          text: "Please select both Year and Program before saving grades.",
          icon: "error",
        });
        return;
      }

      const students = getAllStudents();
      const midtermInputs = document.querySelectorAll(".midterm-input");
      const finalInputs = document.querySelectorAll(".final-input");

      midtermInputs.forEach((input) => {
        const studentId = parseInt(input.dataset.id);
        const student = students.find((s) => s.id === studentId);
        if (student) {
          const midterm = parseFloat(input.value) || 0;
          const final =
            parseFloat(
              document.querySelector(`.final-input[data-id="${studentId}"]`)
                .value
            ) || 0;
          if (midterm < 1 || midterm > 5 || final < 1 || final > 5) {
            Swal.fire({
              title: "Error!",
              text: "Grades must be between 1.0 and 5.0.",
              icon: "error",
            });
            return;
          }
          const average = (midterm * 0.3 + final * 0.7).toFixed(2);
          student.midterm = midterm;
          student.final = final;
          student.average = parseFloat(average);
          student.remarks = average <= 3.0 ? "Passed" : "Failed";
          student.remarksClass =
            average <= 3.0
              ? "bg-green-200 text-green-800"
              : "bg-red-400 text-white";
          student.isFailure = average > 3.0;
        }
      });

      saveStudentData(students);
      updateTable();
      Swal.fire({
        title: "Success!",
        text: "Grades saved successfully!",
        icon: "success",
      });
    });

    updateProgramSelectStyle(programSelect);
  }

  function updateProgramSelectStyle(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (!selectedOption) return;
    if (selectedOption.classList.contains("text-red-500")) {
      selectElement.style.color = "rgb(239 68 68)";
    } else if (selectedOption.classList.contains("text-green-500")) {
      selectElement.style.color = "rgb(34 197 94)";
    } else if (selectedOption.classList.contains("text-yellow-500")) {
      selectElement.style.color = "rgb(234 179 8)";
    } else {
      selectElement.style.color = "black";
    }
  }

  function initializeBackButton() {
    document.addEventListener("click", (event) => {
      if (event.target.id === "backButton") {
        console.log("Back button clicked - navigating to class-record.html");
        window.location.href = "class-record.html";
      }
    });
  }
});
