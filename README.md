# Student Study Partner and Peer Tutoring Application

A decentralized, campus-scoped peer-to-peer (P2P) academic support
platform that connects students with verified peer tutors for free,
accessible study sessions.

## Problem

Students often struggle to find compatible study partners or accessible
academic assistance within their institutions. At the same time, capable
students who are willing to volunteer lack an organized, central way to
offer structured tutoring to their peers.

## Proposed solution

The platform creates a dedicated campus ecosystem for collaborative learning
and altruistic knowledge-sharing. Students can discover verified peer tutors,
agree on a study session, and schedule a meeting digitally. The actual
knowledge delivery remains localized and in person, allowing students to
learn through direct physical communication within their institution.

## Application architecture

The existing application has a React 18 / Vite frontend in `frontend/` and a
NestJS / TypeORM backend in `backend/`. The backend uses PostgreSQL. The
frontend calls the real API; features not implemented by the backend are shown
as unavailable rather than simulated.

## Run locally

Use Node.js 20 or newer, pnpm, and a PostgreSQL database. Start the backend in
one terminal:

```bash
cd backend
pnpm install --frozen-lockfile
cp .env.example .env
```

Edit `backend/.env` with the PostgreSQL connection details, then run:

```bash
pnpm start:dev
```

In a second terminal, start the frontend:

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173` or the forwarded port 5173 URL shown in the
Codespaces **Ports** panel. Vite binds to the Codespace interface and proxies
`/api/v1` requests to the backend on port 3000, so the browser does not call its
own `localhost` for the API. Keep the forwarded ports private and both services
running. Registration and password recovery need either a `RESEND_API_KEY` or
`BREVO_API_KEY` in `backend/.env`, plus a sender verified with that provider;
without them, email requests return an error and OTPs are not printed to logs.
Resend generally needs an authenticated sending domain; Brevo can verify a
single sender address by email for a demo, though a domain gives better
deliverability. The API health check is at
`http://localhost:3000/api/v1/health`; Swagger is at
`http://localhost:3000/docs`.

For a deployed frontend, set `VITE_API_URL` to the deployed backend's API base
URL (for example, `https://api.example.com/api/v1`) in the frontend build
environment. Configure the backend `CORS_ORIGIN` as the exact deployed
frontend origin, without a trailing slash. Never use the sample development
credentials or database synchronization setting for production.

## Documentation

- [Problem Statement](docs/01-problem-statement.md)
- [Personas](docs/02-personas.md)
- [User Flows](docs/03-user-flows.md)
- [MVP Features](docs/04-mvp-features.md)

## Team

- Name — role
- Olubiyi Elijah (Fullstack Dev)

- Name - role
- Hammed Abdulhamid - Frontend dev

- Name - role
- Oyediran Usman Oyetolani - Backend dev

- Name — role
- Oguntona Samuel (Version control engineer)

