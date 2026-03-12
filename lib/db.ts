import { Pool, type QueryResultRow } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __junctionPgPool: Pool | undefined;
}

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL");
  return url;
}

export function getPool() {
  if (process.env.NODE_ENV !== "production") {
    if (!global.__junctionPgPool) {
      global.__junctionPgPool = new Pool({
        connectionString: getDatabaseUrl(),
        ssl: { rejectUnauthorized: false },
      });
    }
    return global.__junctionPgPool;
  }

  return new Pool({
    connectionString: getDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
  });
}

export async function dbQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  const pool = getPool();
  return pool.query<T>(text, params);
}

let schemaEnsured: Promise<void> | null = null;

export function ensureAuthSchema() {
  if (schemaEnsured) return schemaEnsured;
  schemaEnsured = (async () => {
    await dbQuery(`create extension if not exists pgcrypto;`);

    await dbQuery(`
      create table if not exists users (
        id uuid primary key default gen_random_uuid(),
        username text not null,
        email text not null unique,
        password_hash text not null,
        created_at timestamptz not null default now()
      );
    `);

    await dbQuery(`
      create table if not exists sessions (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null references users(id) on delete cascade,
        token_sha256 text not null unique,
        expires_at timestamptz not null,
        created_at timestamptz not null default now()
      );
    `);

    await dbQuery(`create index if not exists sessions_user_id_idx on sessions(user_id);`);
    await dbQuery(`create index if not exists sessions_expires_at_idx on sessions(expires_at);`);
  })();

  return schemaEnsured;
}

