window.onload = () => {
  const data = getTodayWords();
  const list = document.getElementById("today-words-list");

  if (list) {
    list.innerHTML = "";
    data.dailyPlan[new Date().toISOString().split("T")[0]].forEach(word => {
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

  const statsPanel = document.getElementById("stats-panel");
  if (statsPanel) {
    let totalLearned = 0;
    let learningCount = 0;
    let doneCount = 0;

    for (const word in data.wordStatusList) {
      if (data.wordStatusList[word].status === 'done') {
        doneCount++;
      } else if (data.wordStatusList[word].status === 'learning') {
        learningCount++;
      }
    }

    totalLearned = Object.keys(data.wordStatusList).filter(word => data.wordStatusList[word].history.some(h => h.correct)).length;

    document.getElementById("total-learned").textContent = totalLearned;
    document.getElementById("learning-count").textContent = learningCount;
    document.getElementById("done-count").textContent = doneCount;
  }

  const ctx = document.getElementById('progress-chart').getContext('2d');
  const progressChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['已完成', '正在记忆中', '未开始'],
      datasets: [{
        label: '学习进度',
        data: [Object.values(data.wordStatusList).filter(w => w.status === 'done').length,
               Object.values(data.wordStatusList).filter(w => w.status === 'learning').length,
               Object.keys(data.wordStatusList).length - Object.values(data.wordStatusList).filter(w => w.status !== 'new').length],
        backgroundColor: ['#FFD700', '#FFA500', '#FFFACD']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: '学习进度'
        }
      }
    }
  });
};



