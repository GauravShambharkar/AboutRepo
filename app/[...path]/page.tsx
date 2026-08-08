"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Header,
  GeneratorForm,
  ResultCard,
  Footer,
  InvalidRepoNotice,
  useGeneratorStore,
} from "@/src/features/generator";

export default function AnalyzePage() {
  const params = useParams();
  const pathSegments = params.path as string[];
  const repoUrl = pathSegments ? `https://${pathSegments.join("/")}` : null;

  const setUrl = useGeneratorStore((state) => state.setUrl);

  useEffect(() => {
    if (repoUrl) {
      setUrl(repoUrl);
    }
  }, [repoUrl, setUrl]);

  if (!repoUrl) {
    return (
      <InvalidRepoNotice
        title="Missing Repository URL"
        description="Please provide a GitHub repository URL in the path."
        exampleUrl="/github.com/username/repository"
      />
    );
  }

  const isValidGitHubUrl = repoUrl.match(
    /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/,
  );

  if (!isValidGitHubUrl) {
    return (
      <InvalidRepoNotice
        title="Invalid GitHub URL"
        description="The provided URL doesn't appear to be a valid GitHub repository URL."
        providedUrl={repoUrl}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 selection:bg-green-500/30">
      <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Header repoUrl={repoUrl} />
        <GeneratorForm hideUrlInput targetUrl={repoUrl} />
        <ResultCard />
      </div>
      <Footer />
    </div>
  );
}
