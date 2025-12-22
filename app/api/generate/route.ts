import { NextRequest, NextResponse } from "next/server";
import { parseGitHubUrl, fetchRepoData } from "@/lib/github";
import { generateRepoDescription } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "GitHub URL is required" }, { status: 400 });
        }

        const repoInfo = parseGitHubUrl(url);
        if (!repoInfo) {
            return NextResponse.json({ error: "Invalid GitHub repository URL" }, { status: 400 });
        }

        // 1. Fetch Repository Data
        const repoData = await fetchRepoData(repoInfo.owner, repoInfo.repo);

        // 2. Generate Description via AI
        const description = await generateRepoDescription(repoData);

        return NextResponse.json({
            success: true,
            description,
            metadata: {
                name: repoData.name,
                languages: repoData.languages.slice(0, 3)
            }
        });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "An unexpected error occurred"
            },
            { status: 500 }
        );
    }
}