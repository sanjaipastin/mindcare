import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const MOOD_ORDER = ["awful", "low", "okay", "good", "great"];

export default function History() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(() => {});
  }, []);

  if (!analytics) return <div className="page">Loading history…</div>;

  const moodData = MOOD_ORDER.map((key) => ({
    mood: key,
    count: analytics.moodCounts[key] || 0,
  }));

  return (
    <div className="page">
      <header className="page-header">
        <h1>History</h1>
        <p className="page-subtitle">
          Patterns over time — useful to notice what's actually going on
          rather than relying on how today felt.
        </p>
      </header>

      <section className="panel">
        <h2>Stress score over time</h2>
        {analytics.stressTrend.length === 0 ? (
          <p className="muted">
            Write a few journal entries across different days to see a trend.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={analytics.stressTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E0D4" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="averageStress"
                stroke="#3D6B5C"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="panel">
        <h2>Mood check-ins</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E0D4" />
            <XAxis dataKey="mood" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#C9A15A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
