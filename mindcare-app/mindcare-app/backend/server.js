const express = require("express");
const cors = require("cors");

const journalRoutes = require("./routes/journal");
const moodRoutes = require("./routes/mood");
const analyticsRoutes = require("./routes/analytics");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "mindcare-backend" });
});

app.use("/api/journal", journalRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(PORT, HOST, () => {
  console.log(`MindCare backend running on http://${HOST}:${PORT}`);
});
