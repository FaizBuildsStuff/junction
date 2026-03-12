import { NextResponse } from "next/server";
import { getUserFromRequestSession } from "@/lib/auth";
import { upsertServiceKey } from "@/app/(dashboard)/dashboard/infrastructure/actions"; // We need to reuse this action logic, but actions are tied to client calls typically.
// Actually, let's just write to the db directly or import the db logic here.
import { dbQuery } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  if (error) {
    console.error("GitHub OAuth Error:", error);
    return NextResponse.redirect(
      `${baseUrl}/dashboard/infrastructure?error=github_oauth_failed`,
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${baseUrl}/dashboard/infrastructure?error=missing_code`,
    );
  }

  const user = await getUserFromRequestSession();
  if (!user) {
    return NextResponse.redirect(
      `${baseUrl}/signin?redirect=/dashboard/infrastructure`,
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error(
      "Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET environment variable.",
    );
    return NextResponse.redirect(
      `${baseUrl}/dashboard/infrastructure?error=github_not_configured`,
    );
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Junction-Dashboard",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      },
    );

    const tokenText = await tokenRes.text();
    let tokenData: any = {};

    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      console.warn(
        "GitHub did not return JSON. Attempting urlencoded parse. Raw response:",
        tokenText.substring(0, 200),
      );
      // Sometimes it returns a form-urlencoded string despite the Accept header
      const params = new URLSearchParams(tokenText);
      tokenData = Object.fromEntries(params.entries());
    }

    if (tokenData.error) {
      console.error(
        "GitHub Token Exchange Error:",
        tokenData.error_description || tokenData.error,
      );
      return NextResponse.redirect(
        `${baseUrl}/dashboard/infrastructure?error=github_token_exchange_failed`,
      );
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.redirect(
        `${baseUrl}/dashboard/infrastructure?error=github_no_access_token`,
      );
    }

    // Save the access token to the database using the same logic as upsertServiceKey
    await dbQuery(
      `
      INSERT INTO user_service_keys (user_id, service_id, value_text)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, service_id)
      DO UPDATE SET value_text = EXCLUDED.value_text, created_at = now()
      `,
      [user.id, "github", accessToken],
    );

    // Redirect back to infrastructure page
    return NextResponse.redirect(
      `${baseUrl}/dashboard/infrastructure?success=github_connected`,
    );
  } catch (err) {
    console.error("Error during GitHub OAuth callback:", err);
    return NextResponse.redirect(
      `${baseUrl}/dashboard/infrastructure?error=github_internal_error`,
    );
  }
}
