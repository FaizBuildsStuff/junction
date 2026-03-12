import { NextResponse } from "next/server";
import { dbQuery, ensureAuthSchema } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

type SigninBody = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as SigninBody;
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Missing email or password." }, { status: 400 });
  }

  await ensureAuthSchema();

  const result = await dbQuery<{
    id: string;
    username: string;
    email: string;
    password_hash: string;
  }>(`select id, username, email, password_hash from users where email = $1 limit 1`, [email]);

  if (result.rowCount === 0) {
    return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
  }

  const userRow = result.rows[0];
  const ok = await verifyPassword(password, userRow.password_hash);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
  }

  await createSession(userRow.id);
  const user = { id: userRow.id, username: userRow.username, email: userRow.email };
  return NextResponse.json({ ok: true, user });
}

