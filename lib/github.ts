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
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
        throw new Error(`GitHub API error: ${repoRes.statusText}`);
    }
    const repoJson = await repoRes.json();

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
            packageJson = JSON.parse(atob(pkgData.content));
        }
    }

    // 5. Fetch README.md (optional context)
    let readme = "";
    const readmeFiles = fileStructure.filter(f => f.toLowerCase().startsWith("readme.md"));
    if (readmeFiles.length > 0) {
        const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${readmeFiles[0]}`, { headers });
        if (readmeRes.ok) {
            const readmeData = await readmeRes.json();
            readme = atob(readmeData.content).slice(0, 1000); // Only take first 1000 chars for context
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
    const regex = /github\.com\/([^/]+)\/([^/]+)/;
    const match = url.match(regex);
    if (match) {
        let repo = match[2];
        if (repo.endsWith(".git")) repo = repo.slice(0, -4);
        return { owner: match[1], repo };
    }
    return null;
}
