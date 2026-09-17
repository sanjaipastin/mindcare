import React, { useEffect, useMemo, useState } from "react";

const ROUTINES = [
  {
    id: "wind-down",
    name: "Sleep wind-down",
    totalSeconds: 420,
    steps: [
      {
        name: "Supine breathing",
        duration: 60,
        cue: "Lie back and breathe slowly for 4 counts in, 6 out.",
      },
      {
        name: "Leg stretch",
        duration: 60,
        cue: "Extend one leg at a time and soften the knees.",
      },
      {
        name: "Knees-to-chest",
        duration: 60,
        cue: "Gently hug the knees and rock side to side.",
      },
      {
        name: "Child's pose",
        duration: 90,
        cue: "Sink the hips back and let the shoulders soften.",
      },
      {
        name: "Thread the needle",
        duration: 60,
        cue: "Rotate through the upper back and breathe into the chest.",
      },
      {
        name: "Final rest",
        duration: 90,
        cue: "Lie flat and let the body settle into stillness.",
      },
    ],
  },
  {
    id: "reset",
    name: "Night reset",
    totalSeconds: 360,
    steps: [
      {
        name: "Neck release",
        duration: 45,
        cue: "Drop the chin and gently lengthen the back of the neck.",
      },
      {
        name: "Seated forward fold",
        duration: 75,
        cue: "Hinge from the hips and let the spine lengthen.",
      },
      {
        name: "Figure four",
        duration: 60,
        cue: "Cross the ankle and draw the knees gently inward.",
      },
      {
        name: "Bridge pose",
        duration: 60,
        cue: "Lift the hips and soften the jaw.",
      },
      {
        name: "Corpse pose",
        duration: 120,
        cue: "Rest fully and let the body feel heavy and calm.",
      },
    ],
  },
];

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function SleepYoga() {
  const [routineIndex, setRoutineIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUTINES[0].totalSeconds);

  const routine = ROUTINES[routineIndex];

  useEffect(() => {
    if (!running) return undefined;

    if (timeLeft <= 0) {
      setRunning(false);
      return undefined;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [running, timeLeft]);

  const currentStep = useMemo(() => {
    let elapsed = routine.totalSeconds - timeLeft;
    let cumulative = 0;

    for (const step of routine.steps) {
      const end = cumulative + step.duration;
      if (elapsed <= end) {
        return step;
      }
      cumulative = end;
    }

    return routine.steps[routine.steps.length - 1];
  }, [routine, timeLeft]);

  const progress =
    ((routine.totalSeconds - timeLeft) / routine.totalSeconds) * 100;

  const changeRoutine = (index) => {
    setRoutineIndex(index);
    setRunning(false);
    setTimeLeft(ROUTINES[index].totalSeconds);
  };

  const resetRoutine = () => {
    setRunning(false);
    setTimeLeft(routine.totalSeconds);
  };

  return (
    <div className="page sleep-page">
      <header className="page-header">
        <h1>Sleep & yoga</h1>
        <p className="page-subtitle">
          A short evening reset to slow the body down, calm the breath, and
          prepare the mind for rest.
        </p>
      </header>

      <div className="sleep-controls">
        <label className="sleep-select-label">
          Routine
          <select
            value={routineIndex}
            onChange={(e) => changeRoutine(Number(e.target.value))}
            className="sleep-select"
          >
            {ROUTINES.map((item, index) => (
              <option key={item.id} value={index}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <div className="sleep-timer-panel">
          <div className="sleep-timer">{formatTime(timeLeft)}</div>
          <div className="sleep-progress">
            <span style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="sleep-main-grid">
        <section className="panel sleep-panel">
          <h2>Current focus</h2>
          <p className="sleep-focus-name">{currentStep.name}</p>
          <p className="sleep-focus-cue">{currentStep.cue}</p>

          <div className="sleep-actions">
            <button
              className="breath-toggle-btn"
              onClick={() => setRunning((value) => !value)}
            >
              {running ? "Pause routine" : "Start routine"}
            </button>
            <button className="sleep-reset-btn" onClick={resetRoutine}>
              Reset
            </button>
          </div>
        </section>

        <section className="panel sleep-panel">
          <h2>Routine flow</h2>
          <div className="sleep-step-list">
            {routine.steps.map((step) => (
              <div
                key={step.name}
                className={
                  "sleep-step-item " +
                  (currentStep.name === step.name ? "sleep-step-active" : "")
                }
              >
                <div>
                  <strong>{step.name}</strong>
                  <p>{step.cue}</p>
                </div>
                <span>{formatTime(step.duration)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
