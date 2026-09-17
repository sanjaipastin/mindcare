const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../utils/db");

const router = express.Router();

const VALID_MOODS = ["great", "good", "okay", "low", "awful"];

// POST /api/mood - quick check-in: { mood: "good", note?: "..." }
router.post("/", (req, res) => {
  const { mood, note } = req.body;

  if (!VALID_MOODS.includes(mood)) {
    return res.status(400).json({
      error: `mood must be one of: ${VALID_MOODS.join(", ")}`,
    });
  }

  const entry = {
    id: uuidv4(),
    mood,
    note: note ? String(note).trim() : "",
    createdAt: new Date().toISOString(),
  };

  const db = readDB();
  db.moodLogs.unshift(entry);
  writeDB(db);

  res.status(201).json(entry);
});

// GET /api/mood - list all mood logs, newest first
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.moodLogs);
});

module.exports = router;
