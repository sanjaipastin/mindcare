import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Journal() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadEntries = () => {
    api.getJournalEntries().then(setEntries).catch(() => {});
  };

  useEffect(loadEntries, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await api.createJournalEntry(text);
      setLatestResult(result);
      setText("");
      loadEntries();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await api.deleteJournalEntry(id);
    if (latestResult?.id === id) setLatestResult(null);
    loadEntries();
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Journal</h1>
        <p className="page-subtitle">
          Write freely — the emotion and stress analysis below is generated
          automatically from what you write.
        </p>
      </header>

      <form className="journal-form" onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind today?"
          rows={6}
        />
        <button type="submit" disabled={submitting || !text.trim()}>
          {submitting ? "Analyzing…" : "Save entry"}
        </button>
        {error && <p className="error-text">{error}</p>}
      </form>

      {latestResult && (
        <section className="panel analysis-panel">
          <h2>What we picked up</h2>
          <div className="analysis-row">
            <div>
              <span className="analysis-label">Primary emotion</span>
              <span className="analysis-value emotion-tag">
                {latestResult.emotion.label}
              </span>
            </div>
            <div>
              <span className="analysis-label">Confidence</span>
              <span className="analysis-value">
                {Math.round(latestResult.emotion.confidence * 100)}%
              </span>
            </div>
            <div>
              <span className="analysis-label">Stress score</span>
              <span className="analysis-value">
                {latestResult.stressScore} / 100
              </span>
            </div>
          </div>
          <p className="suggestion-text">💡 {latestResult.suggestion}</p>
          <details className="distribution-details">
            <summary>See full emotion distribution</summary>
            <ul>
              {latestResult.emotion.distribution.map((d) => (
                <li key={d.label}>
                  {d.label}: {Math.round(d.probability * 100)}%
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}

      <section className="entry-list">
        <h2>Past entries</h2>
        {entries.length === 0 && (
          <p className="muted">No entries yet — your first one is above.</p>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="entry-card">
            <div className="entry-card-header">
              <span className="emotion-tag">{entry.emotion.label}</span>
              <span className="entry-date">
                {new Date(entry.createdAt).toLocaleString()}
              </span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(entry.id)}
                aria-label="Delete entry"
              >
                ×
              </button>
            </div>
            <p className="entry-text">{entry.text}</p>
            <span className="entry-stress">
              Stress score: {entry.stressScore}/100
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
