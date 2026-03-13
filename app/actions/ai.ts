"use server";

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.CHATGPT_API || "",
});

const modelId = "gpt-4o-mini";

/**
 * Robustly clean and parse JSON from AI's response.
 */
function cleanAndParseJSON(text: string) {
  try {
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.warn("AI JSON Parse Warning:", e, "Text:", text);
    // Extract anything that looks like a JSON object as a last resort
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerE) {
        return null;
      }
    }
    return null;
  }
}

export async function analyzePR(prData: any) {
  const prompt = `
    Analyze this GitHub Pull Request and provide a "Risk Score" (0-100) and 3 short architectural suggestions.
    PR Title: ${prData.title}
    PR Body: ${prData.body}
    Branch: ${prData.head?.ref} -> ${prData.base?.ref}
    
    CRITICAL: Return ONLY valid JSON in this format:
    {
      "riskScore": number,
      "suggestions": [string, string, string],
      "summary": string
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: modelId,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    
    const text = response.choices[0].message.content || "";
    const parsed = cleanAndParseJSON(text);
    return parsed || {
      riskScore: 30,
      suggestions: ["Architectural review recommended", "Check for breaking changes", "Audit dependency updates"],
      summary: "Manual review requested."
    };
  } catch (error) {
    console.error("OpenAI PR Analysis Error:", error);
    return {
      riskScore: 0,
      suggestions: ["AI Analysis unavailable", "Connection to OpenAI failed", "Verify API key permissions"],
      summary: "Intelligence Layer Offline."
    };
  }
}

export async function summarizeCommits(commits: any[]) {
  const commitMessages = commits.map(c => c.commit.message).join("\n- ");
  const prompt = `
    Summarize these ${commits.length} commits into a professional "Executive Briefing" (max 3 sentences) for a CTO.
    Commits:
    - ${commitMessages}
    
    Return as a single string.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: modelId,
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Commit Summary Error:", error);
    return "Recent activity focuses on system stability and codebase refinement.";
  }
}

export async function predictWorkflowFailure(runHistory: any[]) {
  const historyString = runHistory.map(r => `${r.name}: ${r.conclusion}`).join("\n");
  const prompt = `
    Based on this GitHub Action run history, predict the "Failure Probability" (0-100%) for a new run and give one warning sentence.
    History:
    ${historyString}
    
    CRITICAL: Return ONLY valid JSON in this format:
    {
      "probability": number,
      "warning": string
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: modelId,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    const text = response.choices[0].message.content || "";
    const parsed = cleanAndParseJSON(text);
    return parsed || {
      probability: 0,
      warning: "Predictive analysis unavailable."
    };
  } catch (error) {
    console.error("OpenAI Workflow Prediction Error:", error);
    return {
      probability: 0,
      warning: "Model analysis offline."
    };
  }
}

export async function getProjectBriefing(repoName: string, recentCommits: any[]) {
  const commitSnippet = recentCommits.slice(0, 5).map(c => c.commit.message).join(", ");
  const prompt = `
    Provide a brief and professional "Architecture Briefing" for the repository "${repoName}" based on recent activity: "${commitSnippet}".
    Focus on strategic direction and technical architecture. Max 3 concise bullets.
    
    Return as a single string where each bullet is on a new line starting with an emoji.
    Keep it extremely professional and strategic.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: modelId,
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Briefing Error:", error);
    return "🚀 Stabilizing core repository infrastructure\n⚡ Enhancing observability for complex workflows\n🌐 Optimizing CI/CD for high-performance development";
  }
}
