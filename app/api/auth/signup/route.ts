import { NextResponse } from "next/server";
import { dbQuery, ensureAuthSchema } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";

type SignupBody = {
  username?: string;
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as SignupBody;
  const username = (body.username ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!username || !email || !password) {
    return NextResponse.json(
      { ok: false, error: "Missing username, email, or password." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  await ensureAuthSchema();
  const passwordHash = await hashPassword(password);

  try {
    const inserted = await dbQuery<{ id: string; username: string; email: string }>(
      `insert into users (username, email, password_hash)
       values ($1, $2, $3)
       returning id, username, email`,
      [username, email, passwordHash]
    );

    const user = inserted.rows[0];
    await createSession(user.id);

    return NextResponse.json({ ok: true, user });
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : "";
    if (message.includes("users_email_key") || message.toLowerCase().includes("unique")) {
      return NextResponse.json({ ok: false, error: "Email already exists." }, { status: 409 });
    }
    return NextResponse.json({ ok: false, error: "Failed to sign up." }, { status: 500 });
  }
}

