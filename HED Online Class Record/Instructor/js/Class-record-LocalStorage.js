function initializeLocalStorage() {
  if (!localStorage.getItem("students")) {
    const initialStudents = [
      {
        id: 1,
        name: "Juan Dela Cruz",
        program: "IT",
        gender: "Male",
        year: "1st Year",
        status: "Regular",
        subject: ["GE 4", "NSTP 1"],
        midterm: 2.5,
        final: 2.75,
        average: 2.625,
      },
      {
        id: 2,
        name: "Maria Santos",
        program: "HM",
        gender: "Female",
        year: "2nd Year",
        status: "Regular",
        subject: ["Contemporary Mathematics"],
        midterm: 3.5,
        final: 3.2,
        average: 3.35,
      },
    ];
    localStorage.setItem("students", JSON.stringify(initialStudents));
    console.log("Initialized localStorage with sample students");
  }
}

function getAllStudents() {
  try {
    return JSON.parse(localStorage.getItem("students")) || [];
  } catch (error) {
    console.error("Error retrieving students from localStorage:", error);
    return [];
  }
}

function getFilteredStudents(subject, program, year) {
  try {
    const allStudents = JSON.parse(localStorage.getItem("students")) || [];
    return allStudents.filter(
      (student) =>
        (Array.isArray(student.subject)
          ? student.subject.includes(subject)
          : student.subject === subject) &&
        student.program === program &&
        student.year === year
    );
  } catch (error) {
    console.error("Error retrieving students from localStorage:", error);
    return [];
  }
}

function getFilteredStudentsDashboard(program, year) {
  try {
    const allStudents = JSON.parse(localStorage.getItem("students")) || [];
    return allStudents.filter(
      (student) =>
        (!program || student.program === program) &&
        (!year || student.year === year)
    );
  } catch (error) {
    console.error("Error retrieving students for dashboard:", error);
    return [];
  }
}

function addStudent(student) {
  try {
    const students = getAllStudents();
    const newId = students.length
      ? Math.max(...students.map((s) => s.id)) + 1
      : 1;
    const newStudent = {
      ...student,
      id: newId,
      statusClass:
        student.status === "Regular"
          ? "bg-green-200 text-green-800"
          : "bg-yellow-200 text-yellow-700",
      remarks: student.average <= 3.0 ? "Passed" : "Failed",
      remarksClass:
        student.average <= 3.0
          ? "bg-green-200 text-green-800"
          : "bg-red-400 text-white",
      isFailure: student.average > 3.0,
    };
    students.push(newStudent);
    localStorage.setItem("students", JSON.stringify(students));
    console.log("Student added to localStorage:", newStudent);
    return newStudent;
  } catch (error) {
    console.error("Error adding student to localStorage:", error);
    return null;
  }
}

function editStudent(updatedStudent) {
  try {
    const students = getAllStudents();
    const index = students.findIndex((s) => s.id === updatedStudent.id);
    if (index !== -1) {
      students[index] = {
        ...students[index],
        ...updatedStudent,
        statusClass:
          updatedStudent.status === "Regular"
            ? "bg-green-200 text-green-800"
            : "bg-yellow-200 text-yellow-700",
        remarks: updatedStudent.average <= 3.0 ? "Passed" : "Failed",
        remarksClass:
          updatedStudent.average <= 3.0
            ? "bg-green-200 text-green-800"
            : "bg-red-400 text-white",
        isFailure: updatedStudent.average > 3.0,
      };
      localStorage.setItem("students", JSON.stringify(students));
      console.log("Student updated in localStorage:", updatedStudent);
      return students[index];
    }
    return null;
  } catch (error) {
    console.error("Error editing student in localStorage:", error);
    return null;
  }
}

function deleteStudent(studentId) {
  try {
    const students = getAllStudents();
    const updatedStudents = students.filter((s) => s.id !== studentId);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    console.log("Student deleted from localStorage, ID:", studentId);
    return true;
  } catch (error) {
    console.error("Error deleting student from localStorage:", error);
    return false;
  }
}

function saveStudentData(students) {
  try {
    localStorage.setItem("students", JSON.stringify(students));
    console.log("Student data saved to localStorage");
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

initializeLocalStorage();
