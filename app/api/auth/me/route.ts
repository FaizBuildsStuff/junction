import { NextResponse } from "next/server";
import { getUserFromRequestSession } from "@/lib/auth";

export async function GET() {
  const user = await getUserFromRequestSession();
  return NextResponse.json({ ok: true, user });
}

