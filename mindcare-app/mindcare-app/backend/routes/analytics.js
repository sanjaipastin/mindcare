const express = require("express");
const { readDB } = require("../utils/db");
const { buildOverallAnalysis } = require("../utils/insights");

const router = express.Router();

function dayKey(isoString) {
  return isoString.slice(0, 10); // YYYY-MM-DD
}

// GET /api/analytics - summary stats for dashboard
router.get("/", (req, res) => {
  const db = readDB();
  const { journalEntries, moodLogs } = db;

  // Emotion distribution across all journal entries
  const emotionCounts = {};
  for (const entry of journalEntries) {
    const label = entry.emotion.label;
    emotionCounts[label] = (emotionCounts[label] || 0) + 1;
  }

  // Average stress score per day, most recent 14 days of data present
  const stressByDay = {};
  for (const entry of journalEntries) {
    const day = dayKey(entry.createdAt);
    if (!stressByDay[day]) stressByDay[day] = { total: 0, count: 0 };
    stressByDay[day].total += entry.stressScore;
    stressByDay[day].count += 1;
  }
  const stressTrend = Object.entries(stressByDay)
    .map(([day, { total, count }]) => ({
      day,
      averageStress: Math.round(total / count),
    }))
    .sort((a, b) => (a.day > b.day ? 1 : -1))
    .slice(-14);

  // Mood check-in distribution
  const moodCounts = {};
  for (const log of moodLogs) {
    moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
  }

  // Current daily check-in streak (journal entry OR mood log counts as a check-in)
  const allDays = new Set([
    ...journalEntries.map((e) => dayKey(e.createdAt)),
    ...moodLogs.map((m) => dayKey(m.createdAt)),
  ]);
  let streak = 0;
  let cursor = new Date();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (allDays.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  const latestStress =
    journalEntries.length > 0 ? journalEntries[0].stressScore : null;

  const overallAnalysis = buildOverallAnalysis({ journalEntries, moodLogs });

  res.json({
    totalJournalEntries: journalEntries.length,
    totalMoodLogs: moodLogs.length,
    emotionCounts,
    moodCounts,
    stressTrend,
    currentStreak: streak,
    latestStress,
    overallAnalysis,
  });
});

module.exports = router;
