function loadData() {
  const raw = localStorage.getItem("juzi-word-data-v1");
  if (raw) return JSON.parse(raw);
  return {
    correct: [],
    error: [],
    today: null,
    queue: [],
    stats: {
      total: 0,
      learning: 0,
      done: 0
    }
  };
}

function saveData(data) {
  localStorage.setItem("juzi-word-data-v1", JSON.stringify(data));
}

function selectTodayWords(data, count = 8) {
  const todayStr = new Date().toISOString().split("T")[0];

  // 错词优先
  const errorWords = data.error;

  // 到期的复习词
  const dueWords = data.correct.filter(item => {
    const lastDate = item.lastDate;
    const memoryCount = item.memoryCount;
    const daysSinceLast = Math.floor((new Date(todayStr) - new Date(lastDate)) / (1000 * 60 * 60 * 24));
    const schedule = [1, 2, 3, 8]; // 第2天、第4天、第7天、第15天
    return daysSinceLast >= schedule[memoryCount - 1];
  }).map(item => item.word);

  // 新词
  const learnedWords = data.correct.map(item => item.word);
  const newWords = wordList.filter(w => !learnedWords.includes(w) && !errorWords.includes(w));

  // 组合今日词汇
  const combined = [...errorWords, ...dueWords];
  const needed = count - combined.length;
  const selectedNew = newWords.slice(0, needed);
  const todayQueue = [...combined, ...selectedNew].slice(0, count);

  return todayQueue;
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
