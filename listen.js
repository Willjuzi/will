let index = 0;
let data = getTodayWords();
let currentWord = "";

function speak(word) {
  const msg = new SpeechSynthesisUtterance(word);
  msg.lang = "en-US";
  speechSynthesis.speak(msg);
}

function playWord() {
  currentWord = data.dailyPlan[new Date().toISOString().split("T")[0]][index];
  speak(currentWord);
}

function submitAnswer() {
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  const feedback = document.getElementById("feedback");

  if (input === currentWord) {
    feedback.textContent = "✅ 正确";
    if (!data.wordStatusList[currentWord].history.some(h => h.date === new Date().toISOString().split("T")[0])) {
      data.wordStatusList[currentWord].history.push({ date: new Date().toISOString().split("T")[0], correct: true });
      const lastHistoryEntry = data.wordStatusList[currentWord].history[data.wordStatusList[currentWord].history.length - 1];
      if (lastHistoryEntry.correct) {
        if (data.wordStatusList[currentWord].history.filter(h => h.correct).length >= 2) {
          data.wordStatusList[currentWord].status = 'learning';
          data.wordStatusList[currentWord].nextReviewDay = getNextReviewDay(lastHistoryEntry.date, 2);
        }
      }
    }
    index++;
  } else {
    feedback.textContent = `❌ 错了，正确是：${currentWord}`;
    data.wordStatusList[currentWord].status = 'error';
    data.wordStatusList[currentWord].history.push({ date: new Date().toISOString().split("T")[0], correct: false });
    if (!document.getElementById("wrong-words-list").querySelector(`li[data-word="${currentWord}"]`)) {
      const li = document.createElement("li");
      li.setAttribute("data-word", currentWord);
      li.textContent = currentWord;
      document.getElementById("wrong-words-list").appendChild(li);
    }
  }

  saveData(data);

  if (index >= data.dailyPlan[new Date().toISOString().split("T")[0]].length) {
    feedback.textContent = "🎉 今天听写完成！你真棒！";
    document.getElementById("play-btn").disabled = true;
    document.getElementById("submit-btn").disabled = true;
  } else {
    document.getElementById("user-input").value = "";
    playWord();
  }
}

window.onload = () => {
  playWord();
  document.getElementById("play-btn").onclick = playWord;
  document.getElementById("submit-btn").onclick = submitAnswer;
};



