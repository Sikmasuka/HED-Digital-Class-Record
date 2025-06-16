const showError = (elementId, message) => {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
};

const hideError = (elementId) => {
  const errorElement = document.getElementById(elementId);
  errorElement.classList.add("hidden");
};

// Initialize predefined users in localStorage
if (!localStorage.getItem("users")) {
  const initialUsers = [
    {
      email: "instructor@srcb.edu.ph",
      password: "instructor123",
      role: "instructor",
    },
    {
      email: "admin@srcb.edu.ph",
      password: "admin123",
      role: "admin",
    },
  ];
  localStorage.setItem("users", JSON.stringify(initialUsers));
}

// Load remembered credentials if available
document.addEventListener("DOMContentLoaded", () => {
  const remembered = localStorage.getItem("rememberedUser");
  if (remembered) {
    const { email, password } = JSON.parse(remembered);
    document.getElementById("loginEmail").value = email;
    document.getElementById("loginPassword").value = password;
    document.getElementById("rememberMe").checked = true;
  }
});

// Toggle password visibility
const togglePassword = (inputId, toggleId) => {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  toggle.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    toggle.querySelector("i").classList.toggle("fa-eye");
    toggle.querySelector("i").classList.toggle("fa-eye-slash");
  });
};

togglePassword("loginPassword", "toggleLoginPassword");
togglePassword("regPassword", "toggleRegPassword");
togglePassword("confirmPassword", "toggleConfirmPassword");

// Toggle form event listeners
function toggleForms() {
  const loginForm = document.getElementById("loginForm");
  const regForm = document.getElementById("registrationForm");
  loginForm.classList.toggle("hidden");
  regForm.classList.toggle("hidden");
}

document
  .getElementById("showRegisterBtn")
  .addEventListener("click", toggleForms);
document.getElementById("showLoginBtn").addEventListener("click", toggleForms);

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Login form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const agreeTerms = document.getElementById("agreeTermsLogin").checked;
  const rememberMe = document.getElementById("rememberMe").checked;
  let isValid = true;

  // Reset error messages
  hideError("loginEmailError");
  hideError("loginPasswordError");
  hideError("agreeTermsLoginError");

  // Validate email
  if (!email) {
    showError("loginEmailError", "Please enter your email address.");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showError("loginEmailError", "Please enter a valid email address.");
    isValid = false;
  }

  // Validate password
  if (!password) {
    showError("loginPasswordError", "Please enter your password.");
    isValid = false;
  }

  // Validate terms agreement
  if (!agreeTerms) {
    showError(
      "agreeTermsLoginError",
      "You must agree to the Terms of Service."
    );
    isValid = false;
  }

  if (!isValid) return;

  // Handle remember me
  if (rememberMe) {
    localStorage.setItem("rememberedUser", JSON.stringify({ email, password }));
  } else {
    localStorage.removeItem("rememberedUser");
  }

  // Show loading overlay
  document.getElementById("loadingOverlay").classList.remove("hidden");

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email);

  // Hide loading overlay
  document.getElementById("loadingOverlay").classList.add("hidden");

  if (!user) {
    swal({
      title: "Login Failed",
      text: "Email address not found.",
      icon: "error",
      button: "Try Again",
    });
  } else if (user.password !== password) {
    swal({
      title: "Login Failed",
      text: "Incorrect password.",
      icon: "error",
      button: "Try Again",
    });
  } else {
    localStorage.setItem("currentUser", JSON.stringify(user));
    swal({
      title: "Login Successful",
      text: `Welcome, ${user.email}!`,
      icon: "success",
      button: false,
      timer: 1500,
    }).then(() => {
      if (user.role === "instructor") {
        window.location.href = "/Instructor/dashboard.html";
      } else if (user.role === "admin") {
        window.location.href = "/Admin/dashboard-admin.html";
      }
    });
  }
});

// Registration form submission
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();
    const agreeTerms = document.getElementById("agreeTerms").checked;
    let isValid = true;

    // Reset error messages
    hideError("firstNameError");
    hideError("lastNameError");
    hideError("regEmailError");
    hideError("regPasswordError");
    hideError("confirmPasswordError");
    hideError("agreeTermsError");

    // Validate first name
    if (!firstName) {
      showError("firstNameError", "Please enter your first name.");
      isValid = false;
    }

    // Validate last name
    if (!lastName) {
      showError("lastNameError", "Please enter your last name.");
      isValid = false;
    }

    // Validate email
    if (!email) {
      showError("regEmailError", "Please enter your email address.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError("regEmailError", "Please enter a valid email address.");
      isValid = false;
    }

    // Validate password
    if (!password) {
      showError("regPasswordError", "Please enter a password.");
      isValid = false;
    } else if (password.length < 6) {
      showError("regPasswordError", "Password must be at least 6 characters.");
      isValid = false;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      showError("confirmPasswordError", "Passwords do not match.");
      isValid = false;
    }

    // Validate terms agreement
    if (!agreeTerms) {
      showError(
        "agreeTermsError",
        "You must agree to the Terms of Service and Data Privacy Policy."
      );
      isValid = false;
    }

    if (!isValid) return;

    // Show loading overlay
    document.getElementById("loadingOverlay").classList.remove("hidden");

    setTimeout(() => {
      // Hide loading overlay
      document.getElementById("loadingOverlay").classList.add("hidden");

      swal({
        title: "Registration Disabled",
        text: "Registration is disabled for this demo.",
        icon: "info",
        button: "OK",
      });
    }, 1000);
  });
