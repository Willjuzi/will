// listen.js
let currentIndex = 0;
let data = getTodayWords();
let currentWord = "";

function speak(word) {
  const msg = new SpeechSynthesisUtterance(word);
  msg.lang = "en-US";
  speechSynthesis.speak(msg);
}

function playAudio() {
  currentWord = data.queue[currentIndex];
  speak(currentWord);
}

function submitAnswer() {
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  const feedback = document.getElementById("feedback");

  if (input === currentWord) {
    feedback.textContent = "✅ 正确";
    if (!data.correct.some(w => w.word === currentWord)) {
      data.correct.push({ word: currentWord, memoryCount: 1 });
    }
  } else {
    feedback.textContent = `❌ 错了，正确是 ${currentWord}`;
    if (!data.error.includes(currentWord)) data.error.push(currentWord);
  }

  currentIndex++;
  if (currentIndex >= data.queue.length) {
    alert("🎉 今天练习完成！");
    saveData(data);
    window.location.href = "index.html";
  } else {
    document.getElementById("user-input").value = "";
    playAudio();
  }
}

window.onload = () => {
  playAudio();
  document.getElementById("play-btn").onclick = playAudio;
  document.getElementById("submit-btn").onclick = submitAnswer;
};
