// 首页逻辑
document.addEventListener("DOMContentLoaded", () => {
  const stats = getStats();
  document.getElementById("today-date").textContent = new Date().toLocaleDateString();
  document.getElementById("total-words").textContent = stats.total;
  document.getElementById("learned-words").textContent = stats.learned;
  document.getElementById("in-review-words").textContent = stats.review;
  document.getElementById("mastered-words").textContent = stats.done;

  const chart = new Chart(document.getElementById("progressChart"), {
    type: "doughnut",
    data: {
      labels: ["已完成", "记忆中", "新词"],
      datasets: [{
        data: [stats.done, stats.review, stats.learned - stats.review],
        backgroundColor: ["green", "orange", "blue"]
      }]
    }
  });

  document.getElementById("start-btn").onclick = () => {
    window.location.href = "listen.html";
  };
});
