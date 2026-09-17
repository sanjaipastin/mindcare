const BASE_URL = "https://mindcare-backend-sanjai.onrender.com/api";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  // Journal
  createJournalEntry: (text) =>
    fetch(`${BASE_URL}/journal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then(handle),

  getJournalEntries: () => fetch(`${BASE_URL}/journal`).then(handle),

  deleteJournalEntry: (id) =>
    fetch(`${BASE_URL}/journal/${id}`, { method: "DELETE" }).then(handle),

  // Mood
  logMood: (mood, note) =>
    fetch(`${BASE_URL}/mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, note }),
    }).then(handle),

  getMoodLogs: () => fetch(`${BASE_URL}/mood`).then(handle),

  // Analytics
  getAnalytics: () => fetch(`${BASE_URL}/analytics`).then(handle),
};
