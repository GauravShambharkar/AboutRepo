"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BsGithub, BsClipboard, BsCheck2 } from "react-icons/bs";
import { RiAiGenerate } from "react-icons/ri";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import Link from "next/link";

export default function AnalyzePage() {
    const params = useParams();
    const pathSegments = params.path as string[];

    // Reconstruct the repository URL from path segments
    // Example: /github.com/user/repo -> https://github.com/user/repo
    const repoUrl = pathSegments ? `https://${pathSegments.join("/")}` : null;

    const [features, setFeatures] = useState("");
    const [benefits, setBenefits] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (repoUrl) {
            console.log("Repository URL from path parameters:", repoUrl);
        }
    }, [repoUrl]);

    const handleGenerate = async () => {
        if (!repoUrl) return;
        setLoading(true);
        setError(null);
        setResult(null);

        const startTime = Date.now();
        console.log("Generating description for:", repoUrl);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: repoUrl, features, benefits }),
            });

            const data = await response.json();

            if (data.success) {
                setResult(data.description);
                const duration = ((Date.now() - startTime) / 1000).toFixed(2);
                console.log(`Successfully generated in ${duration}s`);
                toast.success("Description generated successfully!");
            } else {
                const errorMsg = data.error || "Failed to generate description";
                console.error("Generation error:", data);
                setError(errorMsg);
                toast.error("Failed to generate description. Check console for details.");
            }
        } catch (err) {
            console.error("Request error:", err);
            setError("Something went wrong. Please try again.");
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Validate that we have a repo URL
    if (!repoUrl) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
                <div className="text-center space-y-6 max-w-lg">
                    <BsGithub className="text-6xl text-red-500 mx-auto" />
                    <h1 className="text-3xl font-light">Missing Repository URL</h1>
                    <p className="text-gray-400 leading-relaxed">
                        Please provide a GitHub repository URL in the path.
                    </p>
                    <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 text-left">
                        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Example:</p>
                        <code className="text-sm text-green-400 break-all">
                            /github.com/username/repository
                        </code>
                    </div>
                    <Link
                        href="/"
                        className="inline-block mt-4 px-6 py-3 bg-white text-black rounded-2xl hover:bg-green-400 transition-all"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Validate GitHub URL format
    const isValidGitHubUrl = repoUrl.match(/^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/);
    if (!isValidGitHubUrl) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
                <div className="text-center space-y-6 max-w-lg">
                    <BsGithub className="text-6xl text-red-500 mx-auto" />
                    <h1 className="text-3xl font-light">Invalid GitHub URL</h1>
                    <p className="text-gray-400 leading-relaxed">
                        The provided URL doesn't appear to be a valid GitHub repository URL.
                    </p>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-left">
                        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Provided URL:</p>
                        <code className="text-sm text-red-400 break-all">
                            {repoUrl}
                        </code>
                    </div>
                    <Link
                        href="/"
                        className="inline-block mt-4 px-6 py-3 bg-white text-black rounded-2xl hover:bg-green-400 transition-all"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 selection:bg-green-500/30">
            <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <BsGithub className="text-8xl text-green-500/50 blur-2xl absolute inset-0 animate-pulse" />
                            <BsGithub className="text-8xl relative z-10" />
                        </div>
                    </div>
                    <h1 className="text-6xl font-light tracking-tight sm:text-7xl">
                        Its About Repo
                    </h1>
                    <p className="text-gray-400 text-lg font-light">
                        Generate developer-focused GitHub "About" descriptions in seconds.
                    </p>
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                        <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-2">
                            Repository
                        </p>
                        <p className="text-green-400 font-mono text-sm break-all">
                            {repoUrl}
                        </p>
                    </div>
                </div>

                <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold pl-1">
                                    Core Features
                                </label>
                                <input
                                    type="text"
                                    value={features}
                                    onChange={(e) => setFeatures(e.target.value)}
                                    placeholder="e.g. Real-time sync, auth"
                                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold pl-1">
                                    Key Benefits
                                </label>
                                <input
                                    type="text"
                                    value={benefits}
                                    onChange={(e) => setBenefits(e.target.value)}
                                    placeholder="e.g. Speed, Security"
                                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !repoUrl}
                        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-medium transition-all duration-300 ${loading || !repoUrl
                            ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                            : "bg-white text-black hover:bg-green-400 border border-white"
                            }`}
                    >
                        {loading ? (
                            <CgSpinner className="animate-spin" size={24} />
                        ) : (
                            <>
                                <RiAiGenerate size={24} />
                                Generate Description
                            </>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="bg-[#111111] border border-green-500/20 rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Generated Description
                            </span>
                            <span className={`text-xs ${result.length > 160 ? 'text-red-400' : 'text-gray-500'}`}>
                                {result.length} / 160
                            </span>
                        </div>

                        <div className="relative group">
                            <p className="text-xl font-light leading-relaxed text-gray-200 py-2">
                                {result}
                            </p>
                            <button
                                onClick={copyToClipboard}
                                className="absolute -right-2 -top-12 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm transition-all active:scale-95 group-hover:border-green-500/30"
                            >
                                {copied ? (
                                    <>
                                        <BsCheck2 className="text-green-500" />
                                        <span className="text-green-500">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <BsClipboard />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <footer className="mt-20 text-gray-600 text-sm font-light">
                Built with Gemini AI & GitHub REST API
            </footer>
        </div>
    );
}
