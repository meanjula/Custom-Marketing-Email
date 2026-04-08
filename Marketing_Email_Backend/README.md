# Marketing Email — Backend API

Express.js REST API for the Custom Marketing Email platform. Uses PostgreSQL with Prisma ORM for persistent storage.

---

## Project Structure

```
Marketing_Email_Backend/
├── index.js                    # Entry point — Express app setup
├── prisma.config.ts            # Prisma configuration (DB connection)
├── package.json
├── .env                        # Environment variables (git ignored)
├── .env.example                # Template for required env vars
├── prisma/
│   ├── schema.prisma           # Database schema (Campaign model)
│   ├── seed.js                 # Seed script — populates 5 sample campaigns
│   └── migrations/             # Auto-generated SQL migration history
└── src/
    ├── lib/
    │   └── prisma.js           # Shared Prisma client instance
    ├── db/
    │   └── campaigns.js        # CRUD helpers using Prisma
    ├── generated/
    │   └── prisma/             # Auto-generated Prisma client (do not edit)
    └── routes/
        └── campaigns.js        # Campaign REST route handlers
```

---

## Tech Stack

| Package | Purpose |
|---|---|
| `express` | HTTP server & routing |
| `cors` | Allow requests from the frontend (localhost:5173) |
| `helmet` | Set secure HTTP headers |
| `prisma` | ORM — schema, migrations, query builder |
| `@prisma/client` | Auto-generated type-safe DB client |
| `@prisma/adapter-pg` | Prisma adapter for PostgreSQL (required by Prisma 7) |
| `pg` | PostgreSQL driver |
| `dotenv` | Load `.env` variables |
| `nodemon` | Auto-restart on file changes (dev only) |

---

## Prerequisites

- Node.js 18+
- PostgreSQL running locally

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://<user>@localhost:5432/marketing_email_db?schema=public"
```

### 3. Create the database

```bash
createdb marketing_email_db
```

### 4. Run migrations

```bash
npx prisma migrate dev
```

### 5. Seed the database

```bash
npm run seed
```

### 6. Start the development server

```bash
npm run dev
```

Server runs at: `http://localhost:3000`

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `nodemon index.js` | Start server with auto-reload |
| `start` | `node index.js` | Start server (production) |
| `seed` | `node prisma/seed.js` | Seed DB with 5 sample campaigns |

---

## Database Schema

```prisma
model Campaign {
  id            Int      @id @default(autoincrement())
  name          String
  subject       String
  content       String?
  status        Int      @default(1)
  emailType     Int      @default(1)
  ccEmails      String[] @default([])
  manualEmails  String[] @default([])
  created       DateTime @default(now())
}
```

---

## API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/campaigns` | Get all campaigns |
| `GET` | `/api/campaigns/:id` | Get a single campaign by ID |
| `POST` | `/api/campaigns` | Create a new campaign |
| `PUT` | `/api/campaigns/:id` | Update an existing campaign |
| `DELETE` | `/api/campaigns/:id` | Delete a campaign |

---

### Request & Response Examples

#### GET `/api/campaigns`
```json
[
  {
    "id": 1,
    "name": "Summer Sale 2025",
    "subject": "Exclusive summer deals just for you!",
    "status": 1,
    "content": "<p>Check out our summer deals!</p>",
    "emailType": 1,
    "ccEmails": [],
    "manualEmails": [],
    "created": "2026-04-07T11:05:59.681Z"
  }
]
```

#### POST `/api/campaigns`

Request body:
```json
{
  "name": "New Campaign",
  "subject": "Hello World",
  "content": "<p>Email body</p>",
  "emailType": 2,
  "CcEmails": ["cc@example.com"],
  "manual_emails": ["user@example.com"],
  "status": 0
}
```

Response `201`:
```json
{
  "id": 6,
  "name": "New Campaign",
  "subject": "Hello World",
  "status": 0,
  "created": "2026-04-07T11:10:00.000Z"
}
```

#### PUT `/api/campaigns/:id`
Request body: any fields to update. Returns the updated campaign object.

#### DELETE `/api/campaigns/:id`
Returns `204 No Content` on success.

---

## Status Values

| Value | Meaning |
|---|---|
| `0` | Draft |
| `1` | Sent |

---

## Step-by-Step Build Process

### Step 1 — Initialise the project
Bootstrapped with `npm init`. Set `"type": "module"` for ES module syntax throughout.

### Step 2 — Install core packages
```bash
npm install express cors helmet
npm install --save-dev nodemon
```

### Step 3 — Set up the Express app (`index.js`)
- Applied `helmet()`, `cors()`, and `express.json()` middleware globally
- Mounted campaign router at `/api/campaigns`
- Added root health check at `GET /`

### Step 4 — Create fake in-memory database (`src/db/campaigns.js`)
- Defined a `campaigns` array with 5 seed records
- Exported `getAll`, `getById`, `create`, `update`, `remove` helpers
- Data lived in RAM — lost on every server restart

### Step 5 — Build campaign routes (`src/routes/campaigns.js`)
- Implemented five REST handlers: GET all, GET by ID, POST, PUT, DELETE
- Mounted in `index.js`

### Step 6 — Connect the React frontend
- Created `campaignApi.js` in the frontend with a `fetch` wrapper
- Replaced sync Redux reducers with `createAsyncThunk` actions
- Added `loading` and `error` to Redux state
- Components now fetch/mutate data via the API

### Step 7 — Replace fake DB with PostgreSQL + Prisma
- Installed Prisma 7, `pg`, `@prisma/adapter-pg`, and `dotenv`
- Defined `Campaign` model in `prisma/schema.prisma`
- Ran `npx prisma migrate dev --name init` to create the table
- Created `src/lib/prisma.js` — shared `PrismaClient` using the `pg` adapter (required by Prisma 7)
- Rewrote `src/db/campaigns.js` to use async Prisma queries
- Updated all routes to `async/await`
- Created `prisma/seed.js` to populate sample data

---

## Next Steps

- [ ] Add authentication middleware (JWT)
- [ ] Add input validation (`zod` or `express-validator`)
- [ ] Deploy to production (Railway, Render, etc.)
