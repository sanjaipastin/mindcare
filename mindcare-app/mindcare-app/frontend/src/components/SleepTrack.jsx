import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "mindcare-sleep-tracker";

function calculateSleepHours(bedtime, wakeTime) {
  const start = new Date(`2000-01-01T${bedtime}:00`);
  const end = new Date(`2000-01-01T${wakeTime}:00`);

  let diffMinutes = (end - start) / 60000;
  if (diffMinutes <= 0) {
    diffMinutes += 24 * 60;
  }

  return diffMinutes / 60;
}

function formatHours(hours) {
  return `${hours.toFixed(1)} hrs`;
}

export default function SleepTrack() {
  const [entries, setEntries] = useState([]);
  const [bedtime, setBedtime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("06:45");
  const [quality, setQuality] = useState(4);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setEntries(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load sleep entries", err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const latestEntry = entries[0] || null;
  const averageSleep = useMemo(() => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, item) => sum + Number(item.hours), 0);
    return total / entries.length;
  }, [entries]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!bedtime || !wakeTime) {
      setMessage("Choose both bedtime and wake time.");
      return;
    }

    const hours = calculateSleepHours(bedtime, wakeTime);
    const nextEntry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      bedtime,
      wakeTime,
      hours,
      quality,
      notes,
    };

    setEntries((prev) => [nextEntry, ...prev].slice(0, 7));
    setMessage(`Saved sleep log: ${formatHours(hours)}.`);
    setNotes("");
  };

  return (
    <div className="page sleep-track-page">
      <header className="page-header">
        <h1>Sleep track</h1>
        <p className="page-subtitle">
          Log your sleep rhythm, notice patterns, and improve your recovery.
        </p>
      </header>

      <section className="stat-row">
        <div className="stat-card">
          <span className="stat-label">Average sleep</span>
          <span className="stat-value">
            {entries.length ? formatHours(averageSleep) : "—"}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Last logged</span>
          <span className="stat-value">
            {latestEntry ? formatHours(latestEntry.hours) : "—"}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sleep quality</span>
          <span className="stat-value">
            {latestEntry ? `${latestEntry.quality}/5` : "—"}
          </span>
        </div>
      </section>

      <div className="sleep-track-grid">
        <section className="panel">
          <h2>Log tonight</h2>
          <form className="sleep-form" onSubmit={handleSubmit}>
            <label>
              Bedtime
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </label>

            <label>
              Wake time
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
            </label>

            <label>
              Sleep quality
              <select
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              >
                <option value={5}>Excellent</option>
                <option value={4}>Good</option>
                <option value={3}>Okay</option>
                <option value={2}>Poor</option>
                <option value={1}>Very poor</option>
              </select>
            </label>

            <label>
              Notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Fell asleep easily, woke up twice, etc."
                rows={4}
              />
            </label>

            <button type="submit" className="mood-save-btn">
              Save sleep log
            </button>
            {message && <p className="success-text">{message}</p>}
          </form>
        </section>

        <section className="panel">
          <h2>Recent nights</h2>
          {entries.length === 0 ? (
            <p className="muted">
              No sleep entries yet. Start by logging your night.
            </p>
          ) : (
            <div className="sleep-entry-list">
              {entries.map((entry) => (
                <div key={entry.id} className="sleep-entry-card">
                  <div className="sleep-entry-header">
                    <strong>{entry.date}</strong>
                    <span>{entry.quality}/5</span>
                  </div>
                  <p>
                    {entry.bedtime} → {entry.wakeTime}
                  </p>
                  <p>{formatHours(entry.hours)}</p>
                  {entry.notes && <p className="muted">{entry.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
