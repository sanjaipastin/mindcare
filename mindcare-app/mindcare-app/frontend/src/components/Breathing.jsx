import React, { useEffect, useRef, useState } from "react";

// 4-7-8 breathing pattern: inhale 4s, hold 7s, exhale 8s
const PHASES = [
  { key: "inhale", label: "Breathe in", seconds: 4 },
  { key: "hold", label: "Hold", seconds: 7 },
  { key: "exhale", label: "Breathe out", seconds: 8 },
];

export default function Breathing() {
  const [running, setRunning] = useState(false);
  const [state, setState] = useState({ phaseIndex: 0, secondsLeft: PHASES[0].seconds });
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.secondsLeft > 1) {
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        }
        const nextPhaseIndex = (prev.phaseIndex + 1) % PHASES.length;
        if (nextPhaseIndex === 0) setCycles((c) => c + 1);
        return {
          phaseIndex: nextPhaseIndex,
          secondsLeft: PHASES[nextPhaseIndex].seconds,
        };
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  const toggle = () => {
    if (!running) {
      setState({ phaseIndex: 0, secondsLeft: PHASES[0].seconds });
      setCycles(0);
    }
    setRunning((r) => !r);
  };

  const currentPhase = PHASES[state.phaseIndex];
  const scaleClass =
    currentPhase.key === "inhale"
      ? "breath-circle-inhale"
      : currentPhase.key === "exhale"
      ? "breath-circle-exhale"
      : "breath-circle-hold";

  return (
    <div className="page">
      <header className="page-header">
        <h1>Breathe</h1>
        <p className="page-subtitle">
          The 4-7-8 pattern: in for 4, hold for 7, out for 8. Slows your
          heart rate and signals safety to your nervous system.
        </p>
      </header>

      <div className="breathing-stage">
        <div className={`breath-circle ${running ? scaleClass : ""}`}>
          <span className="breath-phase-label">
            {running ? currentPhase.label : "Ready"}
          </span>
          {running && <span className="breath-seconds">{state.secondsLeft}</span>}
        </div>

        <button className="breath-toggle-btn" onClick={toggle}>
          {running ? "Stop" : "Start breathing exercise"}
        </button>

        {cycles > 0 && (
          <p className="muted">Completed cycles: {cycles}</p>
        )}
      </div>
    </div>
  );
}
