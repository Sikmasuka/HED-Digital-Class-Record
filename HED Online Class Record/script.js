function toggleForms() {
  const loginForm = document.getElementById("loginForm");
  const regForm = document.getElementById("registrationForm");
  const container = document.getElementById("authContainer");

  loginForm.classList.toggle("hidden");
  regForm.classList.toggle("hidden");
}

// Attach event listeners to toggle buttons
document
  .getElementById("showRegisterBtn")
  .addEventListener("click", toggleForms);
document.getElementById("showLoginBtn").addEventListener("click", toggleForms);

// Basic form submission (for demo)
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Login form submitted");
});

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Registration form submitted");
  });
