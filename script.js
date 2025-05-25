// script.js
function loadTodayWords() {
  const data = loadData();
  const list = document.getElementById("today-words-list");
  const count = document.getElementById("word-count");

  list.innerHTML = "";
  data.queue.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    list.appendChild(li);
  });

  count.textContent = data.queue.length;

  // 更新统计
  document.getElementById("learned-count").textContent = data.correct.length;
  document.getElementById("in-curve-count").textContent = data.queue.length;
  document.getElementById("mastered-count").textContent = data.correct.filter(word => word.memoryCount >= 3).length;

  drawChart(data);
}

function startDictation() {
  window.location.href = "listen.html";
}

// 饼状图显示进度
function drawChart(data) {
  const ctx = document.getElementById("progressChart").getContext("2d");
  const mastered = data.correct.filter(word => word.memoryCount >= 3).length;
  const inProgress = data.correct.length - mastered;
  const notStarted = data.queue.length;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["记忆完成", "记忆中", "待练习"],
      datasets: [{
        data: [mastered, inProgress, notStarted],
        backgroundColor: ["#4caf50", "#ff9800", "#e0e0e0"]
      }]
    }
  });
}

// 初始化
window.onload = () => {
  if (document.getElementById("today-words-list")) {
    loadTodayWords();
  }
};
