# 🤖 BACKEND PROJECT_CONTEXT.md — Agent Specification

> **MANDATORY AI AGENT INSTRUCTION**:
> 1. Whenever an AI agent modifies code in `backend/`, **THE AGENT MUST IMMEDIATELY UPDATE THIS `PROJECT_CONTEXT.md` AND `README.md`** so future AI sessions remain 100% synchronized with the project state.
> 2. **ALWAYS COMMIT AND PUSH**: At the end of every task execution, the agent MUST automatically commit and push all backend changes to origin main (`git add . && git commit -m "..." && git push origin main`).

## 📌 Backend Overview
Node.js Express REST API backend for high score persistence, global leaderboards, and arcade statistics.

* **Mandatory Representation Rule**: Every active arcade game (`Sky Letters`, `Ping Pong`, `Breakout`, `Minesweeper`) MUST be represented in `SAMPLE_SCORES` seeds and filtered endpoints.

---

## 📌 Backend Architecture
* **Runtime**: Node.js v18+
* **Framework**: Express.js with CORS middleware
* **Port**: `8080`
* **Persistence**: Local JSON database (`scores.json`) with auto-seeding

---

## ☁️ Deployment Specs
* **Render Free Web Service**: Managed via `render.yaml` Blueprint.
* **Live Base URL**: `https://arcade-backend-gtgl.onrender.com`
* **Health Check**: `GET /` -> Returns `{ status: "ok" }`.
* **24/7 Zero-Cold-Start Monitoring**: Active **UptimeRobot** HTTP monitor pings `https://arcade-backend-gtgl.onrender.com/` 24/7 every 5–10 minutes to prevent Render free tier service sleep.
* **7-Day Auto-Pruning & Top 3 Immunity**: Scores older than 7 days are automatically pruned, except Top 3 scores in any game or overall which remain permanent.

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root Health Check endpoint (returns `{ status: "ok" }`) |
| `GET` | `/api/scores` | Returns high scores ordered descending |
| `GET` | `/api/scores/game/:game` | Returns high scores for a specific game |
| `POST` | `/api/scores` | Saves player score entry |
| `GET` | `/api/stats` | Returns arcade platform stats |

---

## 💻 Running & Docker Deployment
```bash
# Local
npm install && npm start

# Docker
docker build -t arcade-backend .
docker run -p 8080:8080 arcade-backend
```
