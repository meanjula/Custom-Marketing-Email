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

#### Installed Prisma 7 and `dotenv`
```bash
  npm install prisma @prisma/client pg @prisma/adapter-pg
  npm install --save-dev dotenv
  ```
  - prisma — the CLI tool. Used to run commands like migrate, generate, seed
  - @prisma/client — the actual database client your code imports to run queries
  - pg — the low-level PostgreSQL driver. It knows how to open a connection to Postgres and send SQL
  - @prisma/adapter-pg — a bridge between Prisma 7 and pg. Prisma 7 no longer connects to the database directly — it needs an adapter to hand off the
  connection
  - dotenv — loads .env file variables into process.env so the app can read DATABASE_URL

#### Defined Campaign model in prisma/schema.prisma
```bash
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

  This file is the single source of truth for database structure. Each field maps to a column in PostgreSQL. Decorators like @id, @default,
  @default(now()) tell Prisma how to set up the column constraints. String? means nullable. String[] is a PostgreSQL array.

  #### Ran initial migration to create campaigns table

  ```npx prisma migrate dev --name init```

  Prisma read the schema, compared it to the database (which was empty), and generated a SQL file:

  ```bash
  CREATE TABLE "Campaign" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    ...
  );
  ```

  This SQL was saved in prisma/migrations/20260407_init/migration.sql and executed against the database. Every future schema change creates a new
  migration file — so have a full history of every change ever made to the database.

  #### Created src/lib/prisma.js as shared PrismaClient using pg adapter
  ```bash
  import pg from 'pg';
  import { PrismaPg } from '@prisma/adapter-pg';
  import { PrismaClient } from '../generated/prisma/index.js';

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  export const prisma = new PrismaClient({ adapter });
  ```

  - pg.Pool — creates a connection pool. Instead of opening a new connection to Postgres on every request, it reuses existing ones (faster, more
  efficient)
  - PrismaPg — wraps the pool so Prisma knows how to use it
  - PrismaClient({ adapter }) — creates the Prisma client wired to your actual database
  - This file is a singleton — imported everywhere so only one pool/client exists for the whole app


  #### Rewrote src/db/campaigns.js with async Prisma queries

  Before (fake in-memory):
  ```bash
  export function getAll() {
    return campaigns; // just returns an array
  }
  ```

  After (Prisma):
  ```bash
  export async function getAll() {
    return prisma.campaign.findMany({ orderBy: { created: 'desc' } });
  }
  ```

  Every function is now async because database calls take time (network I/O). Prisma translates each method call to SQL:
  - findMany → SELECT * FROM "Campaign" ORDER BY created DESC
  - findUnique → SELECT * FROM "Campaign" WHERE id = $1
  - create → INSERT INTO "Campaign" (...) VALUES (...)
  - update → UPDATE "Campaign" SET ... WHERE id = $1
  - delete → DELETE FROM "Campaign" WHERE id = $1

  ---
  #### Updated all routes to async/await

  Before:
  ```bash
  router.get('/', (req, res) => {
    res.json(db.getAll()); // returned array immediately
  });
  ```

  After:
  ```bash
  router.get('/', async (req, res) => {
    const campaigns = await db.getAll(); // wait for DB response
    res.json(campaigns);
  });
  ```

  #### Created prisma/seed.js to populate 5 sample campaigns
  ```bash
  await prisma.campaign.deleteMany(); // clear existing data
  await prisma.campaign.createMany({ data: [...] }); // insert 5 records
  ```



  - deleteMany() with no filter deletes everything — clean slate every time you seed
  - createMany() inserts all 5 records in a single SQL statement (efficient)
  - Run with npm run seed whenever you want to reset the database back to the original 5 campaigns  

### Step 8 Validation
#### validateCampaign.js middleware
  - status === 0 (draft) → skips all validation, saves immediately
  - status === 1 (sent) → validates name, subject, content are non-empty, and if emailType === 2 checks manual_emails has at least one entry
  - Returns 422 with { message, errors: { field: 'message' } } on failure

---

## Next Steps

- [ ] Add authentication middleware (JWT)
- [ ] Add input validation (`zod` or `express-validator`)
- [ ] Deploy to production (Railway, Render, etc.)
