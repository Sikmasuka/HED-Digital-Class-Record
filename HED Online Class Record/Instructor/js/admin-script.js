document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("departmentChart");
  canvas.width = 600;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  const departmentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["BSIT", "CJEP", "BSBA", "TEP", "HM"],
      datasets: [
        {
          label: "Number of Students",
          data: [7, 4, 2, 1, 1],
          backgroundColor: [
            "rgba(165, 0, 0, 0.8)", // dark red
            "rgba(0, 123, 255, 0.8)", // blue
            "rgba(204, 153, 0, 0.8)", // gold
            "rgba(0, 123, 255, 0.5)", // light blue
            "rgba(0, 128, 0, 0.8)", // green
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
            stepSize: 1,
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
