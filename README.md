## Junction

Junction is a Next.js App Router project with a Neon Postgres-backed authentication system (email/password) and a protected dashboard. The signup flow also captures and stores “service keys” (e.g., provider API keys) the user enters during onboarding.

### Tech stack

- **Next.js** (App Router)
- **Postgres** (Neon)
- **`pg`** for DB access
- **`bcryptjs`** for password hashing
- **Cookies** (HTTP-only) for sessions + **localStorage** as a UI hint

### Requirements

- Node.js 18+ (recommended)
- A Neon Postgres database

### Environment variables

Create `.env` in the project root:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

Notes:
- `DATABASE_URL` is used server-side only.
- Tables are created automatically on first auth request (see `lib/db.ts`).

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Auth routes (API)

- **POST** `/api/auth/signup`
  - Body: `{ username, email, password, services? }`
  - `services` is a map of `{ [serviceId]: value }` captured from the signup UI
- **POST** `/api/auth/signin`
  - Body: `{ email, password }`
- **GET** `/api/auth/me`
  - Returns the currently authenticated user (or `null`)
- **POST** `/api/auth/signout`
  - Clears the session cookie and deletes the session row

### Pages

- `/signup`: creates a user, stores selected service keys, sets session cookie, redirects to `/dashboard`
- `/signin`: authenticates, sets session cookie, redirects to `/dashboard`
- `/dashboard`: **protected** (server checks session cookie and redirects to `/signin` if missing/invalid)

### Where to look

- **DB + schema**: `lib/db.ts`
- **Sessions + password hashing**: `lib/auth.ts`
- **Auth endpoints**: `app/api/auth/*/route.ts`
- **Signup/Signin UI**: `app/(auth)/*/page.tsx`
- **Protected dashboard**: `app/(root)/dashboard/page.tsx`
- **Header login/dashboard toggle**: `components/Header.tsx`

### Backend deep-dive

See `context.md` for a detailed explanation of the backend design and data flow.
