import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { dbQuery, ensureAuthSchema } from "@/lib/db";

export const SESSION_COOKIE_NAME = "junction_session";
const SESSION_TTL_DAYS = 14;

function sha256Hex(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function newSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

function getExpiresAt() {
  const ms = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSession(userId: string) {
  await ensureAuthSchema();

  const token = newSessionToken();
  const tokenSha256 = sha256Hex(token);
  const expiresAt = getExpiresAt();

  await dbQuery(
    `insert into sessions (user_id, token_sha256, expires_at) values ($1, $2, $3)`,
    [userId, tokenSha256, expiresAt]
  );

  (await cookies()).set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return { token, expiresAt };
}

export async function clearSessionCookie() {
  (await cookies()).set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export type AuthUser = { id: string; username: string; email: string };

export async function getUserFromRequestSession(): Promise<AuthUser | null> {
  await ensureAuthSchema();

  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenSha256 = sha256Hex(token);

  const result = await dbQuery<{
    id: string;
    username: string;
    email: string;
  }>(
    `
    select u.id, u.username, u.email
    from sessions s
    join users u on u.id = s.user_id
    where s.token_sha256 = $1
      and s.expires_at > now()
    limit 1
  `,
    [tokenSha256]
  );

  if (result.rowCount === 0) return null;
  return result.rows[0];
}

export async function deleteSessionByCookieToken() {
  await ensureAuthSchema();
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return;
  const tokenSha256 = sha256Hex(token);
  await dbQuery(`delete from sessions where token_sha256 = $1`, [tokenSha256]);
}

