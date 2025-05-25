// listen.js
let currentIndex = 0;
let currentWord = "";
let todayData = loadData();

function speak(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function playAudio() {
  currentWord = todayData.queue[currentIndex];
  speak(currentWord);
}

function submitAnswer() {
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  const feedback = document.getElementById("feedback");
  if (input === currentWord) {
    feedback.textContent = "✅ 正确！";
    if (!todayData.correct.some(w => w.word === currentWord)) {
      todayData.correct.push({ word: currentWord, memoryCount: 1 });
    } else {
      todayData.correct = todayData.correct.map(w => {
        if (w.word === currentWord) w.memoryCount++;
        return w;
      });
    }
  } else {
    feedback.textContent = `❌ 错误，正确拼写是：${currentWord}`;
    if (!todayData.error.includes(currentWord)) {
      todayData.error.push(currentWord);
    }
  }

  document.getElementById("next-button").style.display = "inline-block";
}

function nextWord() {
  currentIndex++;
  document.getElementById("user-input").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("next-button").style.display = "none";

  if (currentIndex >= todayData.queue.length) {
    alert("🎉 今天的听写完成！");
    localStorage.setItem("juzi-word-data-v1", JSON.stringify(todayData));
    window.location.href = "index.html";
  } else {
    playAudio();
  }
}

// 初始化
window.onload = () => {
  todayData = loadData();
  playAudio();
};
