# 🚀 Neon Arcade - Backend REST API (Node.js + Express)

> 🤖 **NOTE FOR AI AGENTS**:
> Please refer to [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) for full architectural specs. Whenever you make code modifications in this repository, **you MUST update `PROJECT_CONTEXT.md` and this `README.md`** to keep documentation completely up to date.

Independent REST API service for high scores, leaderboard persistence, and platform statistics for the Neon Arcade games platform.

---

## 🛠️ Tech Stack
* **Runtime**: Node.js v18+
* **Framework**: Express.js
* **Middleware**: CORS
* **Database**: JSON file persistence (`scores.json`)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root Health Check endpoint (returns `{ status: "ok" }`) |
| `GET` | `/api/scores` | Returns top high scores sorted descending |
| `GET` | `/api/scores/game/:game` | Filters scores by game name (`Ping Pong`, `Breakout`, `Minesweeper`, `Sky Letters`) |
| `POST` | `/api/scores` | Saves a new score entry |
| `GET` | `/api/stats` | Returns platform statistics (total games, top player, highest score) |

---

## 💻 Local Setup (Without Docker)

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start
```

* API will run on **`http://localhost:8080`**.

---

## 🐳 Docker Deployment

### **Build & Run Image**
```bash
docker build -t arcade-backend .
docker run -p 8080:8080 arcade-backend
```

### **Run with Docker Compose**
```bash
docker compose up --build
```

---

## ☁️ Free Cloud Deployment (Render.com)

1. Push this folder to a GitHub repository.
2. Sign up on [Render.com](https://render.com) (No credit card required).
3. Create a **Web Service**, connect your GitHub repo, and configure:
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. Render will provide a public HTTPS URL (e.g. `https://arcade-backend.onrender.com`).
