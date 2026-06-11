# Match Alert

## Frontends

Este repositorio contiene tres superficies frontend:

- `frontend`: landing/login actual de Match Alert. Corre en `http://localhost:3000`.
- `match-alert-panel`: panel operativo de Match Alert, derivado de `community-agent-template`. Corre en `http://localhost:3002`.
- `community-agent-template`: repo clonado original de Vercel Labs, sin editar, guardado como base de componentes y referencia.

Para levantar el panel junto al stack actual:

```bash
docker compose up -d --build match-alert-panel
```

Para levantar todo:

```bash
docker compose up -d --build
```

Base inicial fullstack para Match Alert.

## Stack

- Backend: NestJS, TypeScript, Prisma, PostgreSQL, JWT, Passport
- Frontend: Next.js, TypeScript, App Router, Tailwind CSS
- Base de datos: PostgreSQL con Docker Compose
- API externa: API-Football desde backend

## Credenciales de desarrollo PostgreSQL

- Host: `localhost`
- Port: `5432`
- Database: `match_alert_db`
- User: `match_alert_user`
- Password: `match_alert_password`

`DATABASE_URL`:

```bash
postgresql://match_alert_user:match_alert_password@localhost:5432/match_alert_db?schema=public
```

## 1. Levantar PostgreSQL

```bash
docker compose up -d
```

## 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run start:dev
```

Backend:

```text
http://localhost:3001
```

## 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## OAuth y API-Football

Las credenciales reales no están incluidas. Completa estos placeholders en `backend/.env`:

```bash
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
FACEBOOK_CLIENT_ID="your_facebook_client_id"
FACEBOOK_CLIENT_SECRET="your_facebook_client_secret"
API_FOOTBALL_KEY="your_api_football_key"
```

La key de API-Football solo se usa en el backend.

## Endpoints principales

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PATCH /auth/me`
- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /auth/facebook`
- `GET /auth/facebook/callback`
- `GET /football/odds/live`
- `GET /football/fixtures/live`
