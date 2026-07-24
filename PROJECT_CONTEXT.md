# 🤖 BACKEND PROJECT_CONTEXT.md — Agent Specification

> **MANDATORY AI AGENT INSTRUCTION**:
> Whenever an AI agent modifies code in `backend/`, **THE AGENT MUST IMMEDIATELY UPDATE THIS `PROJECT_CONTEXT.md` AND `README.md`** so future AI sessions remain 100% synchronized with the project state.

---

## 📌 Backend Architecture
* **Runtime**: Node.js v18+
* **Framework**: Express.js with CORS middleware
* **Port**: `8080`
* **Persistence**: Local JSON database (`scores.json`) with auto-seeding

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
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
