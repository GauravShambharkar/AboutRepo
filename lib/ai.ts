import { GoogleGenAI } from "@google/genai";
import { RepoData } from "./github";

export async function generateRepoDescription(data: RepoData, features?: string, benefits?: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("AI API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const techStack = data.languages.slice(0, 3).join(", ");
    const deps = data.packageJson?.dependencies ? Object.keys(data.packageJson.dependencies).slice(0, 5).join(", ") : "";

    const prompt = `
Generate a 4-line GitHub "About" description for the following repository. 

RULES:
- Max 280 characters.
- NO emojis.
- little marketing fluff.
- Practical and developer-friendly.
- Format: [Brief Purpose] + [Main Tech Stack] + [Detailed Value Proposition].
- Aim for a detailed description that utilizes the full character limit (approx 280-299 chars).
- Output ONLY the description text. No quotes.

CONTEXT:
Repo Name: ${data.name}
Current Description: ${data.description || "None"}
Languages: ${techStack}
Files: ${data.fileStructure.join(", ")}
${deps ? `Key Dependencies: ${deps}` : ""}
README Snippet: ${data.readme ? data.readme : "N/A"}
${features ? `Product Features: ${features}` : ""}
${benefits ? `User Benefits: ${benefits}` : ""}

DESCRIPTION:
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        // The response structure in the new SDK:
        // response is the GenerateContentResponse object
        const textOutput = response.text || "";

        if (!textOutput) {
            throw new Error("AI response was empty or invalid");
        }

        let text = textOutput.trim();

        // Clean up if AI added quotes or extra lines
        text = text.replace(/^["']|["']$/g, "").split("\n")[0];

        return text.slice(0, 300);
    } catch (err: any) {
        console.error("AI Generation Error:", err);
        const message = err.message || "";

        if (message.includes("429")) {
            throw new Error("AI Error: Rate limit exceeded. Please try again in a minute.");
        }
        if (message.includes("404")) {
            throw new Error("AI Error: Model not found or unavailable.");
        }

        throw new Error(`AI Error: ${message || "Failed to generate description"}`);
    }
}
