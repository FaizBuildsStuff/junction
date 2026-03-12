import { NextResponse } from "next/server";
import { getUserFromRequestSession } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getUserFromRequestSession();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    console.error("Missing GITHUB_CLIENT_ID environment variable.");
    return new NextResponse("GitHub OAuth not configured.", { status: 500 });
  }

  // Determine the base URL statically
  // For local development it's localhost:3000, for prod it would be the real domain.
  // We can infer it from the request url.
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/oauth/github`;

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthUrl.searchParams.set("scope", "repo user");

  return NextResponse.redirect(githubAuthUrl.toString());
}
