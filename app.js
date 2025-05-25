// app.js
function loadData() {
  const raw = localStorage.getItem("juzi-word-data-v1");
  if (raw) {
    return JSON.parse(raw);
  }
  return {
    learned: [],
    correct: [],
    error: [],
    today: null,
    queue: [],
  };
}

function saveData(data) {
  localStorage.setItem("juzi-word-data-v1", JSON.stringify(data));
}

function selectTodayWords(data, count = 8) {
  const available = wordList.filter(w => !data.correct.some(c => c.word === w));
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getTodayWords() {
  const data = loadData();
  const todayStr = new Date().toISOString().split("T")[0];

  if (data.today !== todayStr) {
    data.today = todayStr;
    data.queue = selectTodayWords(data);
    saveData(data);
  }

  return data;
}
