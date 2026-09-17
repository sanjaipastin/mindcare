const test = require("node:test");
const assert = require("node:assert/strict");

const { buildOverallAnalysis } = require("../utils/insights");

test("buildOverallAnalysis returns a summary and mindful tips for stress-heavy data", () => {
  const result = buildOverallAnalysis({
    journalEntries: [
      { emotion: { label: "stressed" }, stressScore: 82 },
      { emotion: { label: "angry" }, stressScore: 74 },
      { emotion: { label: "anxious" }, stressScore: 68 },
      { emotion: { label: "calm" }, stressScore: 32 },
    ],
    moodLogs: [{ mood: "low" }, { mood: "low" }, { mood: "okay" }],
  });

  assert.ok(result.headline.length > 0);
  assert.ok(result.focus.length > 0);
  assert.ok(Array.isArray(result.tips));
  assert.ok(result.tips.length >= 3);
  assert.match(result.headline.toLowerCase(), /stress|low|busy|overwhelm/);
});

test("buildOverallAnalysis handles empty data with supportive defaults", () => {
  const result = buildOverallAnalysis({ journalEntries: [], moodLogs: [] });

  assert.equal(
    result.headline,
    "Your mind is in a calm, balanced place right now.",
  );
  assert.ok(Array.isArray(result.tips));
  assert.ok(result.tips.length >= 2);
});
