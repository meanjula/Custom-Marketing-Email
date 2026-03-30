# Marketing Email — Backend API

Express.js REST API for the Custom Marketing Email platform. Uses an in-memory fake database for development.

---

## Project Structure

```
Marketing_Email_Backend/
├── index.js               # Entry point — Express app setup
├── package.json
└── src/
    ├── db/
    │   └── campaigns.js   # In-memory fake DB + CRUD helpers
    └── routes/
        └── campaigns.js   # Campaign REST route handlers
```

---

## Tech Stack

| Package | Purpose |
|---|---|
| `express` | HTTP server & routing |
| `cors` | Allow requests from the frontend (localhost:5173) |
| `helmet` | Set secure HTTP headers |
| `nodemon` | Auto-restart on file changes (dev only) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Server runs at: `http://localhost:3000`

---

## API Endpoints

Base URL: `http://localhost:3000/api`

### Campaigns

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
    "CcEmails": [],
    "manual_emails": [],
    "created": "2025-06-01T10:00:00Z"
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
  "created": "2026-03-30T10:00:00.000Z"
}
```

#### PUT `/api/campaigns/:id`

Request body: any fields to update.
Returns the updated campaign object.

#### DELETE `/api/campaigns/:id`

Returns `204 No Content` on success.

---

## Status Codes

| Status | Meaning |
|---|---|
| `0` | Draft |
| `1` | Sent |

---

## Step-by-Step Build Process

### Step 1 — Initialise the project
The project was bootstrapped with `npm init`. `"type": "module"` was set in `package.json` to use ES module syntax (`import`/`export`) throughout.

### Step 2 — Install core packages
```bash
npm install express cors helmet
npm install --save-dev nodemon
```
- **express** — web framework
- **cors** — configured to allow `http://localhost:5173` (the Vite frontend)
- **helmet** — adds security headers automatically
- **nodemon** — watches for file changes and restarts the server in dev

### Step 3 — Set up the Express app (`index.js`)
- Created the Express app instance
- Applied `helmet()`, `cors()`, and `express.json()` middleware globally
- Mounted the campaign router at `/api/campaigns`
- Added a root health check at `GET /`
- Started the server on port `3000`

### Step 4 — Create the fake in-memory database (`src/db/campaigns.js`)
- Defined a `campaigns` array with 5 seed records
- Exported helper functions: `getAll`, `getById`, `create`, `update`, `remove`
- `create` auto-increments an `id` counter and stamps `created` with the current ISO timestamp
- All operations mutate the in-memory array directly (no persistence between restarts)

### Step 5 — Build the campaign routes (`src/routes/campaigns.js`)
- Created an Express `Router`
- Implemented five handlers:
  - `GET /` — returns all campaigns via `db.getAll()`
  - `GET /:id` — returns one campaign or `404`
  - `POST /` — validates `name` + `subject`, calls `db.create()`, responds `201`
  - `PUT /:id` — merges request body into existing record or `404`
  - `DELETE /:id` — removes record or `404`, responds `204`
- Imported and mounted this router in `index.js`

---

## Next Steps

- [ ] Connect the React frontend (Redux thunks → API calls)
- [ ] Replace fake DB with a real database (e.g. PostgreSQL / MongoDB)
- [ ] Add authentication middleware
- [ ] Add input validation (e.g. `zod` or `express-validator`)
