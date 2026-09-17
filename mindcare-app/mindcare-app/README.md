# MindCare — Stress & Emotional Management App

A full-stack web app for daily mood tracking, journaling, and stress relief,
with a custom-built machine learning layer that detects emotion from what
you write. Built with React (frontend) and Node/Express (backend).

## What it does

- **Journal** — write freely; each entry is automatically analyzed for
  emotion (stressed / anxious / sad / angry / calm / happy) and sentiment,
  and produces a 0–100 stress score plus a relevant suggestion.
- **Quick check-in** — log a one-tap mood (great/good/okay/low/awful) for
  days you don't want to write a full entry.
- **Breathe** — a guided 4-7-8 breathing exercise with an animated pacing
  circle.
- **History** — charts of your stress score trend and mood distribution
  over time.
- **Overview dashboard** — streaks, latest stress score, and an emotion
  breakdown pie chart.

## The machine learning part

This is the part worth explaining in a report or viva — it's not calling
any external AI API, everything runs locally:

1. **Sentiment scoring** (`sentiment` npm package): a lexicon-based (AFINN)
   scorer that rates words as positive/negative and produces an overall
   sentiment score for the text.

2. **Emotion classification** (`backend/ml/naiveBayesEmotion.js`): a
   **Multinomial Naive Bayes classifier**, written from scratch (no ML
   library), trained on a small hand-labeled dataset
   (`backend/ml/trainingData.js`) of short phrases mapped to six emotions.
   It tokenizes the input text, strips stopwords, and computes
   `P(class | words) ∝ P(class) × Π P(word | class)` in log-space with
   Laplace smoothing, then converts scores to probabilities via softmax.
   This is the same algorithm taught for spam/ham text classification —
   applied here to emotion detection instead.

3. **Stress score** (`backend/ml/stressScore.js`): a transparent rule layer
   that combines the emotion label and the sentiment score into a single
   0–100 number, plus picks a relevant coping suggestion. Kept rule-based
   (rather than another black-box model) so it's easy to justify and explain.

You can improve accuracy by adding more labeled examples to
`trainingData.js` — more (and more varied) examples per class is the
single biggest lever.

## Project structure

```
mindcare-app/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── ml/
│   │   ├── trainingData.js    # labeled training examples
│   │   ├── naiveBayesEmotion.js  # the classifier
│   │   └── stressScore.js     # stress score + suggestions
│   ├── routes/
│   │   ├── journal.js         # POST/GET/DELETE journal entries
│   │   ├── mood.js            # POST/GET quick mood check-ins
│   │   └── analytics.js       # GET aggregated stats for charts
│   ├── utils/db.js            # simple JSON-file persistence
│   └── data/db.json           # your data lives here (auto-created)
└── frontend/
    └── src/
        ├── App.jsx, main.jsx
        ├── api.js             # fetch wrapper for the backend
        ├── components/        # Dashboard, Journal, MoodCheckin, Breathing, History
        └── styles/index.css
```

## How to run it

You need [Node.js](https://nodejs.org) (v18 or later) installed. Check with:
```bash
node -v
```

### Opening in VS Code

1. Open VS Code → **File → Open Folder…** → select the `mindcare-app` folder
   (the one containing `backend/`, `frontend/`, and this README).
2. VS Code will prompt to install recommended extensions (Prettier, ESLint,
   React snippets) — click **Install All**, though the app runs fine without them.
3. Install dependencies: press `Ctrl+Shift+P` / `Cmd+Shift+P` → type
   **"Run Task"** → choose **Install All** (runs `npm install` in both
   `backend` and `frontend`).
4. Start both servers at once: `Ctrl+Shift+P` → **Run Task** → **Run MindCare
   (Backend + Frontend)**. Two terminal panels open — one for the backend
   (port 5000), one for the frontend (port 5173).
5. Open the URL shown in the frontend terminal (usually
   `http://localhost:5173`) in your browser.
6. To stop, click the trash/stop icon on each terminal panel, or `Ctrl+C`
   in each.

If you'd rather not use tasks, the manual terminal steps below do the same
thing — open two terminals in VS Code (`` Ctrl+` `` to open one, click the
`+` to split) and run one command set in each.

### 1. Start the backend

```bash
cd backend
npm install
npm start
```
You should see `MindCare backend running on http://localhost:5000`.
Leave this terminal running.

### 2. Start the frontend (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```
Vite will print a local URL, usually `http://localhost:5173`. Open that
in your browser.

The frontend is already configured (see `vite.config.js`) to forward any
`/api/...` request to the backend on port 5000, so both must be running
at the same time.

### Troubleshooting

- **"Couldn't reach the backend" on the dashboard** → the backend isn't
  running, or isn't on port 5000. Check the backend terminal for errors.
- **Port already in use** → close whatever else is using port 5000 or
  5173, or change the port (`PORT=5001 npm start` for the backend; edit
  `vite.config.js` for the frontend).
- **Data resets** → your data is stored in `backend/data/db.json`. Don't
  delete it if you want to keep your history; back it up if you reinstall.

## API reference

| Method | Endpoint             | Description                          |
|--------|----------------------|---------------------------------------|
| GET    | `/api/health`         | Health check                          |
| POST   | `/api/journal`        | `{ text }` → creates entry + analysis |
| GET    | `/api/journal`        | List all journal entries              |
| DELETE | `/api/journal/:id`    | Delete an entry                       |
| POST   | `/api/mood`           | `{ mood, note? }` → logs a check-in   |
| GET    | `/api/mood`           | List all mood check-ins               |
| GET    | `/api/analytics`      | Aggregated stats for dashboard/history|

## Ideas for extending this (good for a "future scope" section)

- Swap the JSON file for SQLite or MongoDB for multi-user support and login.
- Add user accounts (JWT auth) so more than one person can use it.
- Add push/email reminders for daily check-ins.
- Train the classifier on a larger public emotion dataset (e.g. a labeled
  tweets/journal dataset) instead of the small hand-written one here.
- Add voice-based mood input using the Web Speech API, transcribing before
  running it through the same classifier.
- Deploy the backend (Render/Railway) and frontend (Vercel/Netlify) so it's
  usable from a phone.
