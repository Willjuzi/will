window.onload = () => {
  const data = getTodayWords();
  const list = document.getElementById("today-words-list");

  if (list) {
    list.innerHTML = "";
    data.queue.forEach(word => {
      const li = document.createElement("li");
      li.textContent = word;
      list.appendChild(li);
    });
  }

  const btn = document.getElementById("start-btn");
  if (btn) {
    btn.onclick = () => {
      window.location.href = "listen.html";
    };
  }

  // 显示统计数据
  const total = data.correct.length + data.error.length;
  const learning = data.correct.filter(item => item.memoryCount < 5).length;
  const done = data.correct.filter(item => item.memoryCount >= 5).length;

  document.getElementById("total-words").textContent = total;
  document.getElementById("learning-words").textContent = learning;
  document.getElementById("done-words").textContent = done;

  // 可视化图表（需引入 Chart.js）
  const ctx = document.getElementById("progress-chart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["已完成", "记忆中", "未学习"],
      datasets: [{
        data: [done, learning, wordList.length - total],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"]
      }]
    }
  });
};
