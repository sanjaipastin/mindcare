const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Sentiment = require("sentiment");
const emotionClassifier = require("../ml/naiveBayesEmotion");
const { computeStressScore, getSuggestion } = require("../ml/stressScore");
const { readDB, writeDB } = require("../utils/db");

const router = express.Router();
const sentimentAnalyzer = new Sentiment();

// POST /api/journal - submit a new journal entry, get emotion analysis back
router.post("/", (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Journal text is required" });
  }

  const sentimentResult = sentimentAnalyzer.analyze(text);
  const emotionResult = emotionClassifier.predict(text);
  const stressScore = computeStressScore(
    emotionResult.label,
    sentimentResult.comparative
  );
  const suggestion = getSuggestion(emotionResult.label);

  const entry = {
    id: uuidv4(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
    sentiment: {
      score: sentimentResult.score,
      comparative: Number(sentimentResult.comparative.toFixed(3)),
      positiveWords: sentimentResult.positive,
      negativeWords: sentimentResult.negative,
    },
    emotion: {
      label: emotionResult.label,
      confidence: Number(emotionResult.confidence.toFixed(3)),
      distribution: emotionResult.scores.map((s) => ({
        label: s.label,
        probability: Number(s.probability.toFixed(3)),
      })),
    },
    stressScore,
    suggestion,
  };

  const db = readDB();
  db.journalEntries.unshift(entry); // newest first
  writeDB(db);

  res.status(201).json(entry);
});

// GET /api/journal - list all entries, newest first
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.journalEntries);
});

// DELETE /api/journal/:id
router.delete("/:id", (req, res) => {
  const db = readDB();
  const before = db.journalEntries.length;
  db.journalEntries = db.journalEntries.filter((e) => e.id !== req.params.id);
  writeDB(db);

  if (db.journalEntries.length === before) {
    return res.status(404).json({ error: "Entry not found" });
  }
  res.status(204).end();
});

module.exports = router;
