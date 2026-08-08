import { GoogleGenAI } from "@google/genai";
import { RepoData } from "./github";

export async function generateRepoDescription(
  data: RepoData,
  features?: string,
  benefits?: string,
): Promise<string> {
  const groqApiKey = process.env.GROQ_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!groqApiKey && !geminiApiKey) {
    throw new Error(
      "AI API Key is missing. Please set GEMINI_API_KEY or GROQ_API_KEY in your .env file."
    );
  }

  const techStack = data.languages.slice(0, 3).join(", ");
  const deps = data.packageJson?.dependencies
    ? Object.keys(data.packageJson.dependencies).slice(0, 5).join(", ")
    : "";

  const prompt = `
Generate a concise, high-impact GitHub "About" description for the following repository.

RULES:
- Max 280 characters.
- NO emojis.
- Focus heavily on core functionality, product features, and key user/developer benefits.
- DO NOT waste characters listing tech stacks, dependencies, or language names unless essential.
- Format: [Primary Purpose & What It Does] + [Key Feature / Functionality] + [Core Value & Benefit].
- Output ONLY the description text. No quotes, no markdown formatting.

CONTEXT:
Repo Name: ${data.name}
Current Description: ${data.description || "None"}
Languages: ${techStack}
Files: ${data.fileStructure.join(", ")}
${deps ? `Key Dependencies: ${deps}` : ""}
README Snippet: ${data.readme ? data.readme : "N/A"}
${features ? `Core Features: ${features}` : ""}
${benefits ? `Key Benefits: ${benefits}` : ""}

DESCRIPTION:
`;

  try {
    let textOutput = "";

    if (groqApiKey) {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            max_tokens: 150,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Groq API error (${response.status}): ${errorText}`
        );
      }

      const result = await response.json();
      textOutput = result.choices?.[0]?.message?.content || "";
    } else if (geminiApiKey) {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      textOutput = response.text || "";
    }

    if (!textOutput) {
      throw new Error("AI response was empty or invalid");
    }

    let text = textOutput.trim();

    // Remove quotes and keep only the first line
    text = text.replace(/^["']|["']$/g, "").split("\n")[0];

    return text.slice(0, 280);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("AI Generation Error:", error);

    const message = error.message || "";

    if (message.includes("429")) {
      throw new Error(
        "AI Error: Rate limit exceeded. Please try again in a minute."
      );
    }

    if (message.includes("404")) {
      throw new Error("AI Error: Model not found or unavailable.");
    }

    throw new Error(
      `AI Error: ${message || "Failed to generate description"}`
    );
  }
}