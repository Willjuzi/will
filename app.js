function loadData() {
  const raw = localStorage.getItem("juzi-word-data-v1");
  if (raw) return JSON.parse(raw);
  return { wordStatusList: {}, learnedStats: { totalLearned: 0, learningCount: 0, doneCount: 0 }, dailyPlan: {} };
}

function saveData(data) {
  localStorage.setItem("juzi-word-data-v1", JSON.stringify(data));
}

function getNextReviewDay(lastCorrectDate, intervalDays) {
  const date = new Date(lastCorrectDate);
  date.setDate(date.getDate() + intervalDays);
  return date.toISOString().split('T')[0];
}

function selectTodayWords(wordStatusList) {
  const todayStr = new Date().toISOString().split("T")[0];
  let selectedWords = [];

  // Priority 1: 错词
  for (const word in wordStatusList) {
    if (wordStatusList[word].status === 'error') {
      selectedWords.push(word);
      wordStatusList[word].status = 'new'; // Reset status after selecting
    }
  }

  // Priority 2: 到期复习词
  for (const word in wordStatusList) {
    if (selectedWords.length >= 8) break;
    if (wordStatusList[word].nextReviewDay && wordStatusList[word].nextReviewDay <= todayStr) {
      selectedWords.push(word);
    }
  }

  // Priority 3: 新词
  for (const word of wordList) {
    if (selectedWords.length >= 8) break;
    if (!wordStatusList[word]) {
      wordStatusList[word] = { status: 'new', history: [], nextReviewDay: null };
      selectedWords.push(word);
    }
  }

  return selectedWords;
}

function getTodayWords() {
  const data = loadData();
  const todayStr = new Date().toISOString().split("T")[0];

  if (!data.dailyPlan[todayStr]) {
    data.dailyPlan[todayStr] = selectTodayWords(data.wordStatusList);
    saveData(data);
  }

  return data;
}



