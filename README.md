# 🌦️ SkyCache — Weather Cache Platform

A full-stack weather application demonstrating **Redis caching (cache-aside pattern)** in a real-world context. Search any city's weather — the backend checks Redis first before hitting the external API, and the UI visibly shows whether you got a **Cache Hit** or **Cache Miss**, along with the response time.

## ✨ Highlights

- **Cache-aside pattern**: first request to a city ~3000-5000ms (live API call), repeat requests within 10 minutes ~3-5ms (Redis) — a ~1000x speedup, visible live in the UI
- JWT authentication (register/login/logout)
- Favorite cities with live weather previews & personal search history (PostgreSQL)
- Global popular cities (Redis Sorted Set) & recent searches (Redis List)
- Clean REST API, raw SQL (no ORM), Dockerized Postgres + Redis
- CI pipeline: boots real Postgres/Redis containers, verifies backend starts and frontend builds on every push

## 🖥️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS v4, Axios, React Router DOM, lucide-react
**Backend:** Node.js, Express, PostgreSQL (`pg`, raw SQL), Redis, JWT, bcryptjs, Helmet, Morgan, CORS
**External API:** [Open-Meteo](https://open-meteo.com/) (free, no API key required)
**Infrastructure:** Docker Compose (Postgres + Redis), GitHub Actions (CI)

## 🏗️ Architecture

User → React Frontend → Express API → Redis (cache-aside) → Open-Meteo API
↓
PostgreSQL (users, favorites, history)


**Cache-aside flow for weather search:**
1. Check Redis for `weather:<city>`
2. If found → return immediately (**Cache Hit**)
3. If not found → call Open-Meteo → store in Redis with a 10-minute TTL → return (**Cache Miss**)

Every search also updates two global Redis structures:
- `popular-cities` (Sorted Set) — search count leaderboard, via `ZINCRBY`
- `recent-searches` (List) — last 10 searched cities, via `LPUSH` + `LTRIM`

## 📁 Project Structure

weather-cache-platform/
├── .github/workflows/ci.yml # CI: backend boot check + frontend build check
├── backend/
│ ├── src/
│ │ ├── config/ # Postgres pool, Redis client
│ │ ├── controllers/ # Request handlers
│ │ ├── routes/ # Express routers
│ │ ├── middleware/ # Auth guard, error handler
│ │ ├── services/ # Weather API + Redis cache logic
│ │ └── utils/ # JWT helpers, response formatting
│ ├── sql/schema.sql # Database schema
│ └── docker-compose.yml
└── frontend/
└── src/
├── components/ # SearchBar, WeatherCard, Navbar, FavoriteCities, etc.
├── pages/ # Home, Login, Register, Favorites, Profile, NotFound
├── context/ # AuthContext
└── services/ # Axios instance


## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop

### 1. Clone the repo
```bash
git clone https://github.com/HamdiNur/weather-cache-platform.git
cd weather-cache-platform
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values
docker compose up -d   # starts Postgres + Redis containers
```

Create the database tables:
```bash
docker exec -i weather_cache_postgres psql -U postgres -d weather_cache_platform < sql/schema.sql
```

Start the server:
```bash
npm run dev
```
Runs on `http://localhost:5000`. Health check: `GET /api/health`

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/auth/logout` | No | Logout |
| GET | `/api/weather?city=` | No | Get weather (cache-aside) |
| GET | `/api/favorites` | Yes | List favorite cities |
| POST | `/api/favorites` | Yes | Add a favorite |
| DELETE | `/api/favorites/:id` | Yes | Remove a favorite |
| GET | `/api/history` | Yes | Personal search history |
| GET | `/api/popular` | No | Top searched cities (global) |
| GET | `/api/recent` | No | Last 10 searches (global) |

## 🔑 Redis Keys Used

| Key pattern | Type | Purpose | TTL |
|---|---|---|---|
| `weather:<city>` | String (JSON) | Cached weather response | 600s |
| `popular-cities` | Sorted Set | Search count per city | None |
| `recent-searches` | List | Last 10 searched cities | None (capped at 10) |

## 🔄 CI

Every push to `main` triggers `.github/workflows/ci.yml`, which:
- Spins up real Postgres + Redis containers
- Applies `schema.sql` to a fresh database
- Boots the actual Express server and hits `/api/health`
- Installs and builds the frontend with Vite

## 📚 What This Project Demonstrates

- The cache-aside pattern and when to use Redis vs. a database
- Measuring and communicating real performance gains to end users
- Secure JWT auth with bcrypt password hashing
- Raw SQL with parameterized queries (SQL injection safe) — no ORM
- Clean separation of concerns: controllers, services, routes, middleware
- Full-stack integration between React and an Express REST API
- Basic CI with GitHub Actions

## 🗺️ Roadmap
- [ ] Deployment (Render/Railway + Vercel)