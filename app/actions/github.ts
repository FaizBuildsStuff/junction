"use server";

import { getUserFromRequestSession } from "@/lib/auth";
import { getUserServiceKeys } from "@/lib/service-keys";

async function getGitHubKey() {
  const user = await getUserFromRequestSession();
  if (!user) throw new Error("Unauthorized");

  const keys = await getUserServiceKeys(user.id);
  const githubKey = keys.find((k) => k.service_id === "github")?.value_text;
  if (!githubKey) throw new Error("GitHub key not found");

  return githubKey;
}

export async function getGitHubRepos() {
  const apiKey = await getGitHubKey();

  const res = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=50",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch repositories");
  }

  return res.json();
}

export async function getGitHubIssues(owner: string, repo: string) {
  const apiKey = await getGitHubKey();

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=20`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch issues");
  }

  return res.json();
}

export async function createGitHubIssue(
  owner: string,
  repo: string,
  title: string,
  body: string,
) {
  const apiKey = await getGitHubKey();

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create issue");
  }

  return res.json();
}

export async function createGitHubPR(
  owner: string,
  repo: string,
  title: string,
  head: string,
  base: string,
  body: string,
) {
  const apiKey = await getGitHubKey();

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, head, base, body }),
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create PR");
  }

  return res.json();
}
export async function getGitHubCommits(owner: string, repo: string) {
  const apiKey = await getGitHubKey();
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=15`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch commits");
  return res.json();
}

export async function getGitHubWorkflowRuns(owner: string, repo: string) {
  const apiKey = await getGitHubKey();
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=10`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch workflow runs");
  return res.json();
}

export async function getGitHubReleases(owner: string, repo: string) {
  const apiKey = await getGitHubKey();
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases?per_page=10`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch releases");
  return res.json();
}

export async function getGitHubDependabotAlerts(owner: string, repo: string) {
  const apiKey = await getGitHubKey();
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/dependabot/alerts?state=open&per_page=10`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    },
  );
  if (res.status === 404 || res.status === 403) return []; // Dependabot might be disabled or unauthorized
  if (!res.ok) return []; 
  return res.json();
}

export async function getGitHubPRs(owner: string, repo: string) {
  const apiKey = await getGitHubKey();
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=10`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch PRs");
  return res.json();
}
export async function createGitHubRepo(name: string, description: string, isPrivate: boolean) {
  const apiKey = await getGitHubKey();
  const res = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "X-GitHub-Api-Version": "2022-11-28",
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
      private: isPrivate,
      auto_init: true,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create repository");
  }

  return res.json();
}

export async function createGitHubBranch(owner: string, repo: string, branchName: string, fromBranch: string = "main") {
  const apiKey = await getGitHubKey();
  
  // 1. Get the SHA of the base branch
  const baseRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${fromBranch}`, {
    headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
    },
  });
  if (!baseRes.ok) throw new Error("Failed to fetch base branch");
  const baseData = await baseRes.json();
  const sha = baseData.object.sha;

  // 2. Create the new reference
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "X-GitHub-Api-Version": "2022-11-28",
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create branch");
  }

  return res.json();
}

export async function getGitHubBranches(owner: string, repo: string) {
  const apiKey = await getGitHubKey();
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "X-GitHub-Api-Version": "2022-11-28",
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch branches");
  return res.json();
}
export async function triggerGitHubWorkflow(owner: string, repo: string, workflowId: string | number, ref: string = "main") {
  const apiKey = await getGitHubKey();
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "X-GitHub-Api-Version": "2022-11-28",
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to trigger workflow");
  }

  return { success: true };
}
