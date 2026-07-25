import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'scores.json');
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

app.use(cors());
app.use(express.json());

// Root Health Check Route for Render Uptime Monitoring
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Neon Arcade REST API',
    timestamp: new Date().toISOString()
  });
});

// Helper: Prune scores older than 7 days
const pruneExpiredScores = (scoresList) => {
  if (!Array.isArray(scoresList)) return [];
  const now = Date.now();
  return scoresList.filter(entry => {
    if (!entry.date) return true;
    const entryTime = new Date(entry.date).getTime();
    if (isNaN(entryTime)) return true;
    return (now - entryTime) <= SEVEN_DAYS_MS;
  });
};

// Read or initialize score data with 7-day auto-cleanup
const getScoresData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      const pruned = pruneExpiredScores(parsed);
      
      // Save back if any expired items were pruned
      if (pruned.length !== parsed.length) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(pruned, null, 2));
      }
      return pruned;
    }
  } catch (err) {
    console.error("Error reading scores file:", err.message);
  }

  // Fresh start: empty scores array
  const freshScores = [];
  fs.writeFileSync(DATA_FILE, JSON.stringify(freshScores, null, 2));
  return freshScores;
};

const saveScoresData = (scores) => {
  try {
    const pruned = pruneExpiredScores(scores);
    fs.writeFileSync(DATA_FILE, JSON.stringify(pruned, null, 2));
  } catch (err) {
    console.error("Error saving scores file:", err.message);
  }
};

// ---------------- REST API ROUTES ----------------

// 1. GET /api/scores - Fetch all active scores (prunes entries older than 7 days)
app.get('/api/scores', (req, res) => {
  const scores = getScoresData();
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  res.json(sorted);
});

// 2. GET /api/scores/game/:game - Fetch scores by game
app.get('/api/scores/game/:game', (req, res) => {
  const { game } = req.params;
  const scores = getScoresData();
  const filtered = scores
    .filter(s => s.game.toLowerCase() === game.toLowerCase())
    .sort((a, b) => b.score - a.score);
  res.json(filtered);
});

// 3. POST /api/scores - Save new score
app.post('/api/scores', (req, res) => {
  const { playerName, game, score, mode, date } = req.body;

  if (!playerName || !game || score === undefined) {
    return res.status(400).json({ error: 'Missing required fields: playerName, game, score' });
  }

  const scores = getScoresData();
  const newEntry = {
    id: Date.now(),
    playerName: playerName.trim(),
    game: game.trim(),
    score: Number(score),
    mode: mode || 'Standard',
    date: date || new Date().toISOString()
  };

  scores.unshift(newEntry);
  saveScoresData(scores);

  res.status(201).json(newEntry);
});

// 4. GET /api/stats - Arcade platform stats
app.get('/api/stats', (req, res) => {
  const scores = getScoresData();
  const sorted = [...scores].sort((a, b) => b.score - a.score);

  res.json({
    totalGamesRecorded: scores.length,
    topPlayer: sorted.length > 0 ? sorted[0].playerName : 'N/A',
    highestScore: sorted.length > 0 ? sorted[0].score : 0,
    serverType: 'Node.js Express'
  });
});

// 5. POST /api/admin/reset-fresh-start - Reset all handles and scores for a fresh start
app.post('/api/admin/reset-fresh-start', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  res.json({ success: true, message: 'All handles and scores reset for a fresh start.' });
});

// Write empty array to DATA_FILE right now for fresh start
fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Node.js Arcade Backend running on http://localhost:${PORT}`);
});
