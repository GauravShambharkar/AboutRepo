import { GoogleGenAI } from "@google/genai";
import { RepoData } from "./github";

export async function generateRepoDescription(data: RepoData): Promise<string> {
    const apiKey = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
        throw new Error("AI API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const techStack = data.languages.slice(0, 3).join(", ");
    const deps = data.packageJson?.dependencies ? Object.keys(data.packageJson.dependencies).slice(0, 5).join(", ") : "";

    const prompt = `
Generate a 4-line GitHub "About" description for the following repository. 

RULES:
- Max 160 characters.
- NO emojis.
- NO marketing fluff.
- Practical and developer-friendly.
- Format: [Brief Purpose] + [Main Tech Stack].
- Output ONLY the description text. No quotes.

CONTEXT:
Repo Name: ${data.name}
Current Description: ${data.description || "None"}
Languages: ${techStack}
Files: ${data.fileStructure.join(", ")}
${deps ? `Key Dependencies: ${deps}` : ""}
README Snippet: ${data.readme ? data.readme.slice(0, 300) : "N/A"}

DESCRIPTION:
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    let text = response.text || "";
    text = text.trim();

    // Clean up if AI added quotes or extra lines
    text = text.replace(/^["']|["']$/g, "").split("\n")[0];

    return text.slice(0, 160);
}
