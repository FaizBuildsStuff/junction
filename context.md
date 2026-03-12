## Context: Junction backend (Neon + auth)

This document explains how authentication and persistence work in this project, end-to-end.

### Overview

Junction uses **email/password auth** backed by **Neon Postgres**.

- The backend stores:
  - Users (email/username/password hash)
  - Sessions (server-validated cookie sessions)
  - “Service keys” captured during signup (per user, per service)
- The frontend uses:
  - **HTTP-only cookie** as the source of truth for being logged in
  - **localStorage** only as a fast UI hint (Header rendering) and to avoid a blank state before the `/api/auth/me` check completes

### Key files

- **DB connection + schema**: `lib/db.ts`
- **Auth helpers**: `lib/auth.ts`
- **Auth routes**:
  - `app/api/auth/signup/route.ts`
  - `app/api/auth/signin/route.ts`
  - `app/api/auth/me/route.ts`
  - `app/api/auth/signout/route.ts`
- **Protected dashboard**: `app/(root)/dashboard/page.tsx`
- **Header auth UI**: `components/Header.tsx`

---

## Database

### Connection

`lib/db.ts` creates a `pg.Pool` using `process.env.DATABASE_URL` and reuses it across hot reloads in dev.

Neon requires SSL; the pool is configured with:

- `ssl: { rejectUnauthorized: false }`

### Schema creation (“auto-migrations”)

On first auth request, `ensureAuthSchema()` runs and creates needed tables and indexes if they don’t exist.

This is intentionally simple (no Prisma/Drizzle). It keeps setup friction low for hackathon-style iteration.

### Tables

#### `users`

- `id` (uuid, pk)
- `username` (text)
- `email` (text, unique)
- `password_hash` (text, bcrypt)
- `created_at` (timestamptz)

#### `sessions`

- `id` (uuid, pk)
- `user_id` (uuid → `users.id`)
- `token_sha256` (text, unique)
- `expires_at` (timestamptz)
- `created_at` (timestamptz)

Why hash the session token?
- The cookie stores the **raw token**
- The DB stores **sha256(token)**, so the raw cookie token isn’t stored in plaintext in the database

#### `user_service_keys`

Stores the “keys” entered on signup for different services (OpenAI, AWS, etc.).

- `id` (uuid, pk)
- `user_id` (uuid → `users.id`)
- `service_id` (text) — the service identifier from the signup UI (e.g. `"openai"`)
- `value_text` (text) — the value the user entered
- `created_at` (timestamptz)
- unique constraint on `(user_id, service_id)` so each user has at most one value per service

Important security note:
- Right now `value_text` is stored as **plaintext** in the DB.
- If you need production-grade handling, add encryption-at-rest (e.g. `pgcrypto` `pgp_sym_encrypt`) and/or a KMS-backed secret.

---

## Authentication flow

### Signup

Frontend: `app/(auth)/signup/page.tsx`

1. User fills:
   - username, email, password
   - optional “service keys” in the expandable list
2. The page sends:

```json
{
  "username": "...",
  "email": "...",
  "password": "...",
  "services": {
    "openai": "sk-...",
    "aws": "AKIA..."
  }
}
```

Backend: `POST /api/auth/signup`

- Validates required fields
- Hashes password with bcrypt
- Inserts into `users`
- Upserts each service key into `user_service_keys`
- Creates a session and sets an **HTTP-only cookie**

### Signin

Frontend: `app/(auth)/signin/page.tsx`

- Sends `{ email, password }` to `POST /api/auth/signin`

Backend:
- Looks up the user by email
- `bcrypt.compare` against `password_hash`
- Creates a new session row + sets cookie

### Session cookie

Implemented in `lib/auth.ts`:

- Cookie name: `junction_session`
- Properties:
  - `httpOnly: true` (JS can’t read it)
  - `sameSite: "lax"`
  - `secure: true` in production
  - `expires`: 14 days

### “Am I logged in?”

Source of truth:
- `GET /api/auth/me` reads the cookie, hashes it, and checks `sessions` + `users`.

UI hint:
- `localStorage.junction_logged_in` is set to `"true"` after successful signin/signup.
- `components/Header.tsx` uses localStorage as a fast first render hint, then confirms by calling `/api/auth/me`.

### Signout

`POST /api/auth/signout`
- Deletes the session row matching the current cookie token
- Expires the cookie in the browser

The dashboard’s `SignOutButton` also clears localStorage and redirects to `/signin`.

---

## Route protection (dashboard)

`app/(root)/dashboard/page.tsx` is a **server component** and calls:

- `getUserFromRequestSession()`

If no user is returned, it performs a server-side redirect to `/signin`.

This means:
- Even if localStorage says “logged in”, `/dashboard` still blocks access without a valid cookie session.

