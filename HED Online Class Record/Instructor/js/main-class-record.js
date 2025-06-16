// main-class-record.js - Handles the main class record page (class-record.html)
document.addEventListener("DOMContentLoaded", () => {
  console.log("main-class-record.js loaded");

  // Only run on the main class-record.html page
  if (
    !window.location.pathname.endsWith("class-record.html") &&
    !window.location.pathname.endsWith("/")
  ) {
    return;
  }

  const innerBox = document.querySelector(".subject-inner-box");

  if (!innerBox) {
    console.error("Inner box not found - check HTML structure");
    return;
  }

  // Initialize subject selection interface
  initializeSubjectSelection();

  // Initialize form controls if they exist
  initializeFormControls();

  function initializeSubjectSelection() {
    console.log("Loading subject selection interface");

    innerBox.innerHTML = `
      <h2 class="text-center font-bold text-4xl text-[#163269]">Subject</h2>
      <div class="w-full flex justify-center space-x-6 mt-6">
        <button class="subject-card border border-gray-400 rounded-lg px-6 py-2 font-semibold text-[#163269] hover:bg-gray-200 transition duration-300" data-subject="GEEL 1">
          GEEL 1
        </button>
        <button class="subject-card border border-gray-400 rounded-lg px-6 py-2 font-semibold text-[#163269] hover:bg-gray-200 transition duration-300" data-subject="ITC 201">
          ITC 201
        </button>
        <button class="subject-card border border-gray-400 rounded-lg px-6 py-2 font-semibold text-[#163269] hover:bg-gray-200 transition duration-300" data-subject="MMW">
          MMW
        </button>
      </div>
    `;

    // Add event listeners to subject cards
    const cards = innerBox.querySelectorAll(".subject-card");
    console.log("Found subject cards:", cards.length);

    cards.forEach((card) => {
      card.addEventListener("click", handleSubjectCardClick);
    });
  }

  function handleSubjectCardClick(event) {
    const subjectName =
      event.target.getAttribute("data-subject") ||
      event.target.textContent.trim();

    console.log("Subject selected:", subjectName);

    // Navigate to subject-specific page
    window.location.href = `ClassRecord-Subject.html?subject=${encodeURIComponent(
      subjectName
    )}`;
  }

  function initializeFormControls() {
    const yearSelect = document.getElementById("yearSelect");
    const programSelect = document.querySelector("select.w-full.border");
    const tableContainer = document.getElementById("classRecordTableContainer");
    const saveButton = document.querySelector(
      ".bg-blue-600.text-white.px-6.py-2.rounded"
    );

    if (!yearSelect || !programSelect || !tableContainer || !saveButton) {
      console.log("Form controls not found on this page");
      return;
    }

    console.log("Initializing form controls");

    function validateAndToggleTable() {
      const hasYear = yearSelect.value && yearSelect.value !== "Year";
      const hasProgram = programSelect.value && programSelect.value !== "";

      console.log("Validation - Year:", hasYear, "Program:", hasProgram);

      if (hasYear && hasProgram) {
        tableContainer.classList.remove("hidden");
        saveButton.style.display = "inline-block";
        saveButton.disabled = false;
        saveButton.classList.remove("opacity-50", "cursor-not-allowed");
      } else {
        tableContainer.classList.add("hidden");
        saveButton.style.display = "none";
      }
    }

    // Initial validation
    validateAndToggleTable();

    // Event listeners
    yearSelect.addEventListener("change", validateAndToggleTable);

    programSelect.addEventListener("change", () => {
      updateProgramSelectStyle(programSelect);
      validateAndToggleTable();
    });

    saveButton.addEventListener("click", handleSaveGrades);
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

  function handleSaveGrades(event) {
    const yearSelect = document.getElementById("yearSelect");
    const programSelect = document.querySelector("select.w-full.border");

    const hasYear = yearSelect?.value && yearSelect.value !== "Year";
    const hasProgram = programSelect?.value && programSelect.value !== "";

    if (!hasYear || !hasProgram) {
      event.preventDefault();
      alert("Please select both Year and Program before saving grades.");
      return;
    }

    console.log("Saving grades:", {
      year: yearSelect.value,
      program: programSelect.value,
    });

    // Add your save logic here
  }
});
