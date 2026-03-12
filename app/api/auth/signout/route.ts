import { NextResponse } from "next/server";
import { clearSessionCookie, deleteSessionByCookieToken } from "@/lib/auth";

export async function POST() {
  await deleteSessionByCookieToken();
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}

