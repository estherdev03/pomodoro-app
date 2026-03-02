# Pomodoro App

A full-stack productivity app built around the Pomodoro technique. Track focus sessions, take structured breaks, and build better work habits with a clean interface and secure authentication.

## Features

- **Pomodoro Timer** — 25-minute focus sessions with 5-minute short breaks and 15-minute long breaks
- **Session History** — Review completed pomodoros and track progress over time
- **Secure Auth** — JWT-based authentication with optional 2FA, plus Google and GitHub OAuth
- **Validation** — Client and server-side validation with clear error messages
- **Responsive UI** — Modern interface built with Next.js and Tailwind CSS

## Tech Stack

| Layer      | Technologies                                                |
|------------|-------------------------------------------------------------|
| Frontend   | Next.js 16, React 19, Tailwind CSS, Zustand, React Hook Form, Zod |
| Backend    | NestJS 11, TypeORM, PostgreSQL, Passport.js, bcrypt         |
| Auth       | JWT, Passport (local, JWT, Google, GitHub), 2FA (TOTP)      |

## Prerequisites

- **Node.js** 18+
- **npm** or **pnpm**
- **PostgreSQL** 14+ (or use Docker)
- **Docker** (optional, for running Postgres via Docker Compose)

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd pomodoro-app
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Start PostgreSQL

Using Docker:

```bash
cd backend
docker compose up -d
```

Or use an existing PostgreSQL instance.

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

# OAuth redirects (for Google/GitHub login)
FRONTEND_URL=http://localhost:3000
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

## Project Structure

```
pomodoro-app/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/            # Auth, JWT, 2FA, OAuth
│   │   ├── users/           # User entities and service
│   │   ├── pomodoro-session/# Pomodoro session logic
│   │   └── main.ts
│   ├── docker-compose.yml   # PostgreSQL service
│   └── package.json
├── frontend/                # Next.js app
│   ├── app/                 # App router pages
│   ├── components/          # UI and auth components
│   ├── lib/                 # API client, stores, types
│   └── package.json
└── README.md
```

## Scripts

### Backend

| Command           | Description              |
|------------------|--------------------------|
| `npm run start:dev` | Start dev server with watch |
| `npm run build`    | Build for production      |
| `npm run start`    | Run production build      |
| `npm run test`     | Run unit tests            |

### Frontend

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start Next.js dev server |
| `npm run build`| Build for production     |
| `npm run start`| Run production build     |

## API Overview

| Method | Endpoint            | Description                    |
|--------|---------------------|--------------------------------|
| POST   | `/auth/register`    | Register new user              |
| POST   | `/auth/login`       | Login                          |
| POST   | `/auth/logout`      | Logout                         |
| GET    | `/auth/profile`     | Get current user (JWT required)|
| GET    | `/auth/google`      | Google OAuth                   |
| GET    | `/auth/github`      | GitHub OAuth                   |
| POST   | `/auth/2fa/generate`| Generate 2FA secret            |
| POST   | `/auth/2fa/verify`  | Verify 2FA code                |
| POST   | `/auth/2fa/enable`  | Enable 2FA for user            |
| POST   | `/pomodoro-session/start`   | Start pomodoro session     |
| PATCH  | `/pomodoro-session/:id/end` | End session                |
| GET    | `/pomodoro-session/current` | Get active session         |
| GET    | `/pomodoro-session/history` | List user's session history|

## License

MIT License
