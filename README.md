# 🍅 Pomodoro App

A full-stack productivity app built around the Pomodoro technique. Track focus sessions, take structured breaks, and build better work habits with a clean interface and secure authentication.

🔗 **Live Demo:** [pomodoro-murex-beta.vercel.app](https://pomodoro-murex-beta.vercel.app)

---

## Features

- **Pomodoro Timer** — 25-minute focus sessions with 5-minute short breaks and 15-minute long breaks
- **Session History** — Review completed pomodoros and track progress over time
- **Secure Auth** — JWT-based authentication with optional 2FA (TOTP), plus Google and GitHub OAuth
- **Validation** — Client and server-side validation with clear error messages
- **Responsive UI** — Modern interface built with Next.js and Tailwind CSS

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 16, React 19, Tailwind CSS, Zustand, React Hook Form, Zod |
| Backend | NestJS 11, TypeORM, PostgreSQL, Passport.js, bcrypt |
| Auth | JWT, Passport (local, JWT, Google, GitHub), 2FA (TOTP) |
| Deployment | Vercel (frontend), Railway (backend + PostgreSQL) |

---

## Prerequisites

- **Node.js** 18+
- **npm** or **pnpm**
- **PostgreSQL** 14+ (or use Docker)
- **Docker** (optional, for running PostgreSQL via Docker Compose)

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/estherdev03/pomodoro-app.git
cd pomodoro-app

cd frontend && npm install
cd ../backend && npm install
```

### 2. Start PostgreSQL

Using Docker:

```bash
cd backend
docker compose up -d
```

Or connect to an existing PostgreSQL instance.

### 3. Environment variables

Create a `.env` in the **backend** directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=pomodoro_app

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=1d

# Server
PORT=8000
CORS_ORIGIN=http://localhost:3000

# OAuth redirects
FRONTEND_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

Create a `.env.local` in the **frontend** directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run the app

**Terminal 1 — Backend**

```bash
cd backend
npm run start:dev
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000

---

## Deployment

This project is deployed with the **frontend on Vercel** and the **backend + PostgreSQL on Railway**.

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import this repo
2. Set the **Root Directory** to `frontend`
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
   ```
4. Click **Deploy**

### Backend — Railway

1. Go to [railway.app](https://railway.app) → New Project
2. Add a **PostgreSQL** database service
3. Add a second service → Deploy from GitHub → set Root Directory to `backend`
4. Set **Build Command:** `npm run build`
5. Set **Start Command:** `npm run start:prod`
6. Add environment variables:
   ```env
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_USERNAME=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}

   JWT_SECRET=your-strong-secret
   JWT_EXPIRATION=1d
   PORT=8000
   CORS_ORIGIN=https://your-vercel-frontend.vercel.app
   FRONTEND_URL=https://your-vercel-frontend.vercel.app

   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```
7. Click **Generate Domain** under Public Networking on the backend service

### OAuth Callback URIs

Update the redirect URIs in your OAuth provider consoles to point to your Railway backend:

| Provider | Callback URL |
|----------|-------------|
| Google | `https://your-backend.up.railway.app/auth/google/callback` |
| GitHub | `https://your-backend.up.railway.app/auth/github/callback` |

- **Google:** [console.cloud.google.com](https://console.cloud.google.com) → Credentials → OAuth Client → Authorized Redirect URIs
- **GitHub:** [github.com/settings/developers](https://github.com/settings/developers) → OAuth App → Authorization Callback URL

---

## Project Structure

```
pomodoro-app/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── auth/               # Auth, JWT, 2FA, OAuth strategies
│   │   ├── users/              # User entities and service
│   │   ├── pomodoro-session/   # Pomodoro session logic
│   │   └── main.ts
│   ├── docker-compose.yml      # PostgreSQL service
│   └── package.json
├── frontend/                   # Next.js app
│   ├── app/                    # App router pages
│   ├── components/             # UI and auth components
│   ├── lib/                    # API client, stores, types
│   └── package.json
└── README.md
```

---

## API Overview

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login with email and password |
| POST | `/auth/logout` | Logout and clear session |
| GET | `/auth/profile` | Get current user (JWT required) |
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/github` | Initiate GitHub OAuth |
| POST | `/auth/2fa/generate` | Generate 2FA secret |
| POST | `/auth/2fa/verify` | Verify 2FA TOTP code |
| POST | `/auth/2fa/enable` | Enable 2FA for the user |

### Pomodoro Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/pomodoro-session/start` | Start a new pomodoro session |
| PATCH | `/pomodoro-session/:id/end` | End an active session |
| GET | `/pomodoro-session/current` | Get the current active session |
| GET | `/pomodoro-session/history` | List the user's session history |

---

## Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start dev server with watch mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Run the production build |
| `npm run test` | Run unit tests |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |

---

## License

MIT License