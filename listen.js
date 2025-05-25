let index = 0;
let data = getTodayWords();
let currentWord = "";

function speak(word) {
  const msg = new SpeechSynthesisUtterance(word);
  msg.lang = "en-US";
  speechSynthesis.speak(msg);
}

function playWord() {
  currentWord = data.queue[index];
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
    index++;
  } else {
    feedback.textContent = `❌ 错了，正确是：${currentWord}`;
    if (!data.error.includes(currentWord)) data.error.push(currentWord);
  }

  saveData(data);

  if (index >= data.queue.length) {
    alert("🎉 今天听写完成！");
    window.location.href = "index.html";
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
