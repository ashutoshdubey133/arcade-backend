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

// Sample Initial Scores
const SAMPLE_SCORES = [
  { id: 1, playerName: 'WordNinja', game: 'Sky Letters', score: 1850, mode: 'Wave 4 | 72s | 98% acc', date: new Date().toISOString() },
  { id: 2, playerName: 'CyberKnight', game: 'Ping Pong', score: 15, mode: 'single (impossible)', date: new Date().toISOString() },
  { id: 3, playerName: 'PixelMaster', game: 'Breakout', score: 450, mode: 'Level 2', date: new Date().toISOString() },
  { id: 4, playerName: 'NeonRider', game: 'Minesweeper', score: 320, mode: 'medium', date: new Date().toISOString() },
  { id: 5, playerName: 'RetroKing', game: 'Ping Pong', score: 10, mode: 'twoPlayer', date: new Date().toISOString() },
];

// Read or initialize score data
const getScoresData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading scores file, resetting:", err.message);
  }

  // Seed sample scores
  fs.writeFileSync(DATA_FILE, JSON.stringify(SAMPLE_SCORES, null, 2));
  return SAMPLE_SCORES;
};

const saveScoresData = (scores) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2));
  } catch (err) {
    console.error("Error saving scores file:", err.message);
  }
};

// ---------------- REST API ROUTES ----------------

// 1. GET /api/scores - Fetch all scores ordered by score DESC
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

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Node.js Arcade Backend running on http://localhost:${PORT}`);
});
