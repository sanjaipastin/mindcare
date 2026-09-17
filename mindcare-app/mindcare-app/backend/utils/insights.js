function normalizeMood(mood) {
  return (mood || "").toLowerCase();
}

function getMoodPriority(moods) {
  const scoreMap = {
    awful: 1,
    low: 2,
    okay: 3,
    good: 4,
    great: 5,
  };

  const total = moods.reduce((sum, mood) => sum + (scoreMap[mood] || 3), 0);
  return total / (moods.length || 1);
}

function buildOverallAnalysis({ journalEntries = [], moodLogs = [] }) {
  const entries = Array.isArray(journalEntries) ? journalEntries : [];
  const logs = Array.isArray(moodLogs) ? moodLogs : [];

  if (!entries.length && !logs.length) {
    return {
      headline: "Your mind is in a calm, balanced place right now.",
      focus:
        "Keep noticing small wins and stay consistent with your check-ins.",
      tips: [
        "Try a 2-minute breathing reset when you feel mentally crowded.",
        "Keep a short journal note each day to spot patterns before stress grows.",
      ],
    };
  }

  const emotionCounts = {};
  let totalStress = 0;
  let maxStress = 0;

  for (const entry of entries) {
    const label = (entry && entry.emotion && entry.emotion.label) || "calm";
    emotionCounts[label] = (emotionCounts[label] || 0) + 1;
    const stress = Number(entry && entry.stressScore ? entry.stressScore : 0);
    totalStress += stress;
    maxStress = Math.max(maxStress, stress);
  }

  const moodValues = logs.map((log) => normalizeMood(log.mood));
  const moodAverage = getMoodPriority(moodValues);
  const avgStress = entries.length ? totalStress / entries.length : 0;
  const dominantEmotion = Object.entries(emotionCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const leadingEmotion = dominantEmotion ? dominantEmotion[0] : "calm";

  let headline = "Your emotional pattern looks steady and manageable.";
  let focus = "You are creating awareness around your energy and mood.";
  let tips = [
    "Keep journaling a few sentences each day to notice what drains or restores you.",
    "Try one grounding exercise after a stressful moment to reset before it builds.",
  ];

  if (avgStress >= 60 || maxStress >= 80 || moodAverage <= 2.5) {
    headline =
      "Your stress load seems high right now, and your mind may need more recovery time.";
    focus =
      "Focus on reducing overload before it grows into exhaustion or emotional shutdown.";
    tips = [
      "Schedule a short daily reset: 5 minutes of slow breathing or a walk without your phone.",
      "Reduce one demanding task and replace it with a calming ritual such as stretching, tea, or a quiet journal page.",
      "Protect your sleep by dimming lights and avoiding screen-heavy activity in the last hour before bed.",
      "Use your journal to identify the triggers that make stress spike, then plan one response before they hit again.",
    ];
  } else if (leadingEmotion === "anxious" || leadingEmotion === "stressed") {
    headline = "You are noticing more anxious or pressured energy than usual.";
    focus =
      "When thoughts feel crowded, create a shorter, slower rhythm to help your nervous system settle.";
    tips = [
      "Try a 4-7-8 breathing cycle when your thoughts race or your chest feels tight.",
      "Break large tasks into a tiny first step so your brain gets a clear, manageable next action.",
      "Put your worries on paper for 3 minutes, then choose one practical action rather than replaying everything.",
    ];
  } else if (leadingEmotion === "sad" || leadingEmotion === "angry") {
    headline =
      "Your recent pattern points to emotional heaviness or irritation.";
    focus =
      "Let yourself slow down, move your body, and release what is building inside you.";
    tips = [
      "Take a short walk or gentle stretch after an emotional spike to discharge tension.",
      "Write the real feeling in one sentence, then add one action you can take to care for yourself.",
      "Avoid making major decisions while your mood is highly activated; wait until your nervous system feels steadier.",
    ];
  } else if (moodAverage >= 4) {
    headline = "Your current rhythm is mostly positive and steady.";
    focus =
      "Keep supporting the habits that help you feel grounded, energetic, and connected.";
    tips = [
      "Protect your good energy by keeping a small daily routine with rest, movement, and reflection.",
      "Keep noticing the small things that lift you so you can repeat them intentionally.",
    ];
  }

  return { headline, focus, tips };
}

module.exports = { buildOverallAnalysis };
