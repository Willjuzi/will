// 管理单词调度与记忆曲线逻辑

const MEMORY_STAGES = [1, 2, 4, 7, 15]; // 天数间隔
const DAILY_WORD_LIMIT = 8;
const STORAGE_KEY = "juzi_memory_data";

function loadMemoryData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveMemoryData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTodayKey() {
  const today = new Date();
  return today.toISOString().split("T")[0]; // YYYY-MM-DD
}

function isDue(dateStr, offsetDays) {
  const due = new Date(dateStr);
  due.setDate(due.getDate() + offsetDays);
  return new Date() >= due;
}

function selectTodayWords() {
  const memoryData = loadMemoryData();
  const todayKey = getTodayKey();
  let todayWords = [];
  let learnedSet = new Set(Object.keys(memoryData));

  // 添加复习中的单词
  for (let [word, info] of Object.entries(memoryData)) {
    let { history } = info;
    if (!history) continue;
    let nextStage = history.length;
    if (nextStage < MEMORY_STAGES.length) {
      if (isDue(info.startDate, MEMORY_STAGES[nextStage])) {
        todayWords.push(word);
      }
    }
  }

  // 添加新单词
  let candidates = wordList.filter(w => !learnedSet.has(w));
  while (todayWords.length < DAILY_WORD_LIMIT && candidates.length > 0) {
    const word = candidates.shift();
    memoryData[word] = {
      startDate: getTodayKey(),
      history: []
    };
    todayWords.push(word);
  }

  // 缓存今日词汇
  memoryData["_today"] = {
    date: todayKey,
    words: todayWords
  };

  saveMemoryData(memoryData);
  return todayWords;
}

function getTodayWords() {
  const memoryData = loadMemoryData();
  const todayKey = getTodayKey();
  const cached = memoryData["_today"];
  if (cached && cached.date === todayKey) return cached.words;
  return selectTodayWords();
}

function updateWordProgress(word, correct) {
  const data = loadMemoryData();
  if (!data[word]) return;

  if (correct) {
    data[word].history.push(getTodayKey());
  } else {
    // reset if wrong
    data[word].history = [];
    data[word].startDate = getTodayKey();
  }

  saveMemoryData(data);
}

function getStats() {
  const data = loadMemoryData();
  const total = wordList.length;
  let learned = 0, review = 0, done = 0;

  for (let [key, val] of Object.entries(data)) {
    if (key === "_today") continue;
    const h = val.history.length;
    if (h === 0) continue;
    learned++;
    if (h >= MEMORY_STAGES.length) done++;
    else review++;
  }

  return { total, learned, review, done };
}
