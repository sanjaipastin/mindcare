import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const EMOTION_COLORS = {
  stressed: "#B5533C",
  anxious: "#C9A15A",
  sad: "#6B7A99",
  angry: "#9C4B4B",
  calm: "#3D6B5C",
  happy: "#7FA88C",
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getAnalytics()
      .then(setAnalytics)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Loading your overview…</div>;
  if (error)
    return (
      <div className="page">
        <p className="error-text">
          Couldn't reach the backend ({error}). Make sure the server is running
          on port 5000.
        </p>
      </div>
    );

  const emotionData = Object.entries(analytics.emotionCounts).map(
    ([label, value]) => ({ name: label, value }),
  );

  const overallAnalysis = analytics.overallAnalysis || {
    headline: "Your mind is in a calm, balanced place right now.",
    focus: "Keep noticing small wins and stay consistent with your check-ins.",
    tips: [
      "Try a 2-minute breathing reset when you feel mentally crowded.",
      "Keep a short journal note each day to spot patterns before stress grows.",
    ],
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>How things are going</h1>
        <p className="page-subtitle">
          {analytics.currentStreak > 0
            ? `${analytics.currentStreak}-day check-in streak. Keep it going.`
            : "No check-in yet today — a minute is enough."}
        </p>
      </header>

      <section className="stat-row">
        <div className="stat-card">
          <span className="stat-label">Latest stress score</span>
          <span className="stat-value">
            {analytics.latestStress !== null ? analytics.latestStress : "—"}
            <span className="stat-unit">/ 100</span>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Journal entries</span>
          <span className="stat-value">{analytics.totalJournalEntries}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Check-ins logged</span>
          <span className="stat-value">{analytics.totalMoodLogs}</span>
        </div>
      </section>

      <section className="panel overall-analysis-panel">
        <h2>Overall analysis</h2>
        <p className="analysis-headline">{overallAnalysis.headline}</p>
        <p className="analysis-focus">{overallAnalysis.focus}</p>
        <ul className="analysis-tip-list">
          {overallAnalysis.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <h2>Emotion breakdown</h2>
          {emotionData.length === 0 ? (
            <p className="muted">
              Write a journal entry to see your emotion patterns appear here.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={emotionData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {emotionData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={EMOTION_COLORS[entry.name] || "#999"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="panel panel-actions">
          <h2>Quick actions</h2>
          <Link to="/check-in" className="action-link">
            <span>Log today's mood</span>
            <span className="action-arrow">›</span>
          </Link>
          <Link to="/journal" className="action-link">
            <span>Write a journal entry</span>
            <span className="action-arrow">›</span>
          </Link>
          <Link to="/breathe" className="action-link">
            <span>Take a breathing break</span>
            <span className="action-arrow">›</span>
          </Link>
          <Link to="/sleep-yoga" className="action-link">
            <span>Try a sleep and yoga routine</span>
            <span className="action-arrow">›</span>
          </Link>
          <Link to="/sleep-track" className="action-link">
            <span>Log your sleep track</span>
            <span className="action-arrow">›</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
