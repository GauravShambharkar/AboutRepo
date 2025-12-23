export interface RepoData {
    name: string;
    description: string | null;
    languages: string[];
    fileStructure: string[];
    packageJson?: any;
    readme?: string;
}

export async function fetchRepoData(owner: string, repo: string): Promise<RepoData> {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
    };
    if (GITHUB_TOKEN) {
        headers.Authorization = `token ${GITHUB_TOKEN}`;
    }

    // 1. Fetch Repo Metadata
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const repoRes = await fetch(url, { headers });

    if (!repoRes.ok) {
        if (repoRes.status === 404) {
            // 404 can mean either the repo doesn't exist OR it's private and we don't have access
            // If there's no token, it's likely a private repo
            if (!GITHUB_TOKEN) {
                throw new Error(`Repository not found. If "${owner}/${repo}" is a private repository, this app only works with public repositories.`);
            }
            throw new Error(`Repository not found: ${owner}/${repo}. Please verify the repository exists and is public.`);
        }
        if (repoRes.status === 401) {
            throw new Error(`Unauthorized: Invalid GITHUB_TOKEN.`);
        }
        if (repoRes.status === 403) {
            throw new Error(`Access forbidden. This app only works with public repositories.`);
        }
        throw new Error(`GitHub API error (${repoRes.status}): ${repoRes.statusText} at ${url}`);
    }
    const repoJson = await repoRes.json();

    // Check if the repository is private
    if (repoJson.private === true) {
        throw new Error(`This repository is private. This app only works with public repositories.`);
    }

    // 2. Fetch Languages
    const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
    const languages = langRes.ok ? Object.keys(await langRes.json()) : [];

    // 3. Fetch Top-level File Structure
    const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers });
    const contents = contentsRes.ok ? await contentsRes.json() : [];
    const fileStructure = Array.isArray(contents) ? contents.map((c: any) => c.name) : [];

    // 4. Fetch package.json (if exists)
    let packageJson = null;
    if (fileStructure.includes("package.json")) {
        const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, { headers });
        if (pkgRes.ok) {
            const pkgData = await pkgRes.json();
            const decoded = Buffer.from(pkgData.content, "base64").toString("utf-8");
            packageJson = JSON.parse(decoded);
        }
    }

    // 5. Fetch README.md (optional context)
    let readme = "";
    const readmeFiles = fileStructure.filter(f => f.toLowerCase().startsWith("readme.md"));
    if (readmeFiles.length > 0) {
        const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${readmeFiles[0]}`, { headers });
        if (readmeRes.ok) {
            const readmeData = await readmeRes.json();
            readme = Buffer.from(readmeData.content, "base64").toString("utf-8").slice(0, 1000); // Only take first 1000 chars for context
        }
    }

    return {
        name: repoJson.name,
        description: repoJson.description,
        languages,
        fileStructure,
        packageJson,
        readme,
    };
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    try {
        const cleanUrl = url.trim().replace(/\/$/, ""); // Remove trailing slash
        const parts = cleanUrl.split("github.com/")[1]?.split("/");

        if (!parts || parts.length < 2) return null;

        const owner = parts[0];
        let repo = parts[1];

        if (repo.endsWith(".git")) repo = repo.slice(0, -4);

        return { owner, repo };
    } catch (e) {
        return null;
    }
}
