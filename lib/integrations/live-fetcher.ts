import { type MockCostSummary } from "./mock-costs";

export async function fetchLiveIntegrationData(
  serviceId: string,
  apiKey: string,
): Promise<MockCostSummary | null> {
  const now = new Date();

  try {
    switch (serviceId) {
      case "github": {
        // Fetch user profile stats
        const res = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github+json",
          },
          next: { revalidate: 3600 },
        });

        if (!res.ok) return null;
        const data = await res.json();

        return {
          serviceId: "github",
          currentSpend: data.public_repos || 0,
          monthlyLimit: null,
          renewalDate: new Date(
            now.getTime() + 365 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          currency: "REPOS",
          status: "active",
          details: [
            { label: "Followers", value: data.followers || 0 },
            { label: "Following", value: data.following || 0 },
            { label: "Public Gists", value: data.public_gists || 0 },
            { label: "Plan", value: data.plan?.name || "Free" },
          ],
        };
      }

      case "supabase": {
        // Fetch projects on Supabase
        const res = await fetch("https://api.supabase.com/v1/projects", {
          headers: { Authorization: `Bearer ${apiKey}` },
          next: { revalidate: 3600 },
        });

        if (!res.ok) return null;
        const data = await res.json();

        const latestProject = data[0];

        return {
          serviceId: "supabase",
          currentSpend: data.length || 0,
          monthlyLimit: 2, // Free tier limit
          renewalDate: new Date(
            now.getTime() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          currency: "PROJECTS",
          status: "active",
          details: [
            {
              label: "Latest Project",
              value: latestProject ? latestProject.name : "None",
            },
            {
              label: "Region",
              value: latestProject ? latestProject.region : "N/A",
            },
            {
              label: "Created At",
              value: latestProject
                ? new Date(latestProject.created_at).toLocaleDateString()
                : "N/A",
            },
          ],
        };
      }

      case "neon": {
        // Fetch projects on Neon
        const res = await fetch("https://console.neon.tech/api/v2/projects", {
          headers: { Authorization: `Bearer ${apiKey}` },
          next: { revalidate: 3600 },
        });

        if (!res.ok) return null;
        const data = await res.json();

        const projNames =
          data.projects && data.projects.length > 0
            ? data.projects
                .slice(0, 2)
                .map((p: any) => p.name)
                .join(", ")
            : "No active projects";

        return {
          serviceId: "neon",
          currentSpend: data.projects?.length || 0,
          monthlyLimit: null,
          renewalDate: new Date(
            now.getTime() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          currency: "PROJECTS",
          status: "active",
          details: [
            { label: "Project Limit", value: "Default Free Tier" },
            { label: "Active Project(s)", value: projNames },
            { label: "Platform", value: "AWS" },
          ],
        };
      }

      case "linear": {
        // Fetch teams on Linear via GraphQL
        const res = await fetch("https://api.linear.app/graphql", {
          method: "POST",
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: "{ teams { nodes { id name key } } }",
          }),
          next: { revalidate: 3600 },
        });

        if (!res.ok) return null;
        const data = await res.json();
        const teams = data.data?.teams?.nodes || [];
        const teamNames =
          teams.length > 0
            ? teams
                .slice(0, 3)
                .map((t: any) => t.name)
                .join(", ")
            : "None";

        return {
          serviceId: "linear",
          currentSpend: teams.length,
          monthlyLimit: null,
          renewalDate: new Date(
            now.getTime() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          currency: "TEAMS",
          status: "active",
          details: [
            { label: "Latest Teams", value: teamNames },
            { label: "Total Managed Teams", value: teams.length },
          ],
        };
      }

      default:
        // For services we haven't built a live fetcher for, return null
        // so the system can fallback to the mock generator
        return null;
    }
  } catch (error) {
    console.error(`Error fetching live data for ${serviceId}:`, error);
    return null;
  }
}
