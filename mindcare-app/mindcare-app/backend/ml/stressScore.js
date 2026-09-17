// Combines the Naive Bayes emotion label with the lexicon-based sentiment
// score to produce a single 0-100 "stress score" plus a short suggestion.
// This is a transparent, explainable rule layer on top of the two models —
// useful to be able to justify in a viva, unlike a black-box score.

const EMOTION_BASE_WEIGHT = {
  stressed: 80,
  anxious: 70,
  angry: 65,
  sad: 55,
  calm: 20,
  happy: 10,
};

const SUGGESTIONS = {
  stressed: [
    "Try the 4-7-8 breathing exercise for two minutes before going back to your task list.",
    "Break your remaining work into 25-minute focused blocks (Pomodoro) with short breaks.",
    "Write down just the next single action instead of the whole list — momentum reduces overwhelm.",
  ],
  anxious: [
    "Try box breathing (4 in, 4 hold, 4 out, 4 hold) for a minute to calm your nervous system.",
    "Ground yourself with the 5-4-3-2-1 technique: 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.",
    "Write down the worst-case scenario and one small step you'd take if it happened — it often shrinks the fear.",
  ],
  sad: [
    "A short walk outside or a few minutes of sunlight can genuinely lift mood.",
    "Reach out to one friend, even with a small message — connection helps more than isolating.",
    "Be gentle with yourself today; low-energy days don't need to be 'fixed' immediately.",
  ],
  angry: [
    "Step away for five minutes before responding to whatever triggered this.",
    "Try writing out exactly what frustrated you, unfiltered, then decide what's worth acting on.",
    "Physical release helps — a brisk walk or a few minutes of stretching can dissipate tension.",
  ],
  calm: [
    "Good moment to plan tomorrow while you're clear-headed.",
    "Consider journaling what helped you feel this way, so you can repeat it later.",
  ],
  happy: [
    "Note what led to this feeling — it's useful data for your future self.",
    "A good moment to tackle something you've been putting off, while motivation is high.",
  ],
};

function computeStressScore(emotionLabel, sentimentComparative) {
  const base = EMOTION_BASE_WEIGHT[emotionLabel] ?? 50;
  // sentimentComparative typically ranges roughly -1 (very negative) to +1 (very positive)
  // per word. Negative sentiment pushes the score up (more stress), positive pulls it down.
  const sentimentAdjustment = Math.max(-25, Math.min(25, -sentimentComparative * 40));
  const raw = base + sentimentAdjustment;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function getSuggestion(emotionLabel) {
  const options = SUGGESTIONS[emotionLabel] || SUGGESTIONS.calm;
  return options[Math.floor(Math.random() * options.length)];
}

module.exports = { computeStressScore, getSuggestion };
