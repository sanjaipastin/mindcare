import React from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Overview", end: true },
  { to: "/check-in", label: "Check in" },
  { to: "/journal", label: "Journal" },
  { to: "/breathe", label: "Breathe" },
  { to: "/sleep-yoga", label: "Sleep & Yoga" },
  { to: "/sleep-track", label: "Sleep Track" },
  { to: "/history", label: "History" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">◐</span>
        <span className="sidebar-brand-name">MindCare</span>
      </div>
      <nav className="sidebar-nav">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " sidebar-link-active" : "")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <p className="sidebar-footnote">
        A quiet place to notice how you're doing.
      </p>
    </aside>
  );
}
