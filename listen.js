let todayWords = getTodayWords();
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("user-input");
  const playBtn = document.getElementById("play-audio");
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const feedback = document.getElementById("feedback");
  const counter = document.getElementById("word-counter");

  function updateCounter() {
    counter.textContent = `第 ${currentIndex + 1} / ${todayWords.length} 个单词`;
  }

  function speak(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }

  function showFeedback(text, color) {
    feedback.textContent = text;
    feedback.style.color = color;
  }

  function handleSubmit() {
    const expected = todayWords[currentIndex];
    const answer = input.value.trim().toLowerCase();
    if (!answer) return;

    const correct = expected === answer;
    updateWordProgress(expected, correct);

    if (correct) {
      showFeedback("✅ 正确！", "green");
    } else {
      showFeedback(`❌ 错误，应为：${expected}`, "red");
    }

    submitBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
  }

  function handleNext() {
    input.value = "";
    feedback.textContent = "";
    submitBtn.style.display = "inline-block";
    nextBtn.style.display = "none";

    currentIndex++;
    if (currentIndex >= todayWords.length) {
      alert("🎉 今天的练习已完成！");
      window.location.href = "index.html";
      return;
    }

    updateCounter();
  }

  playBtn.onclick = () => {
    speak(todayWords[currentIndex]);
  };

  submitBtn.onclick = handleSubmit;
  nextBtn.onclick = handleNext;

  updateCounter();
});
