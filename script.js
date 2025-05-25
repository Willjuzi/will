// script.js
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

  document.getElementById("start-btn").onclick = () => {
    window.location.href = "listen.html";
  };
};
