document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("departmentChart");
  canvas.width = 600;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  const departmentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["STUDENTS", "INSTRUCTORS", "", "", ""],
      datasets: [
        {
          label: "Number of Students",
          data: [20, 4, 0, 0, 0],
          backgroundColor: [
            "rgba(0, 123, 255, 0.5)", // light blue
            "rgba(45, 216, 88, 0.8)", // green
            "rgba(204, 153, 0, 0.8)", // gold
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
        animateScale: true,
        animateRotate: true,
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 3,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
});
