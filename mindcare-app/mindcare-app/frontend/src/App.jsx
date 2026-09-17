import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Journal from "./components/Journal.jsx";
import MoodCheckin from "./components/MoodCheckin.jsx";
import Breathing from "./components/Breathing.jsx";
import SleepYoga from "./components/SleepYoga.jsx";
import SleepTrack from "./components/SleepTrack.jsx";
import History from "./components/History.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/check-in" element={<MoodCheckin />} />
          <Route path="/breathe" element={<Breathing />} />
          <Route path="/sleep-yoga" element={<SleepYoga />} />
          <Route path="/sleep-track" element={<SleepTrack />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}
