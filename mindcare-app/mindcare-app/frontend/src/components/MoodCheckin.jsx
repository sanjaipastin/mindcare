import React, { useState } from "react";
import { api } from "../api.js";

const MOODS = [
  { key: "great", label: "Great", glyph: "◉" },
  { key: "good", label: "Good", glyph: "◕" },
  { key: "okay", label: "Okay", glyph: "◑" },
  { key: "low", label: "Low", glyph: "◔" },
  { key: "awful", label: "Awful", glyph: "○" },
];

export default function MoodCheckin() {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!selected) return;
    await api.logMood(selected, note);
    setSaved(true);
    setNote("");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Quick check-in</h1>
        <p className="page-subtitle">
          No need to write anything long — just how you're doing right now.
        </p>
      </header>

      <div className="mood-grid">
        {MOODS.map((m) => (
          <button
            key={m.key}
            className={
              "mood-option" + (selected === m.key ? " mood-option-active" : "")
            }
            onClick={() => setSelected(m.key)}
          >
            <span className="mood-glyph">{m.glyph}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      <textarea
        className="mood-note"
        placeholder="Add a short note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
      />

      <button
        className="mood-save-btn"
        onClick={handleSave}
        disabled={!selected}
      >
        Save check-in
      </button>

      {saved && <p className="success-text">Saved — thanks for checking in.</p>}
    </div>
  );
}
