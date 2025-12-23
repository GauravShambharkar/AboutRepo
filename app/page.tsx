"use client";

import { useState } from "react";
import { BsGithub, BsClipboard, BsCheck2 } from "react-icons/bs";
import { RiAiGenerate } from "react-icons/ri";
import { CgClose, CgSpinner } from "react-icons/cg";
import { toast } from "sonner";

export default function Home() {
  const [url, setUrl] = useState("");
  const [features, setFeatures] = useState("");
  const [benefits, setBenefits] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const startTime = Date.now();
    console.log("Generating description for:", url);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, features, benefits }),
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

  const getShareableLink = () => {
    if (!url) return;
    try {
      // Validate the GitHub URL
      const urlObj = new URL(url);

      // Construct the shareable URL using the catch-all path
      // Example: https://github.com/user/repo -> /github.com/user/repo
      const cleanPath = url.replace(/^https?:\/\//, "");
      const shareableUrl = `${window.location.origin}/${cleanPath}`;
      navigator.clipboard.writeText(shareableUrl);
      toast.success("Shareable link copied to clipboard!");
    } catch (error) {
      console.error("Failed to generate shareable link:", error);
      toast.error("Invalid URL format. Please enter a valid GitHub URL.");
    }
  };

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
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold pl-1">
                GitHub Repository URL
              </label>
              <div className="relative flex items-center group">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-gray-600"
                />
                {url && (
                  <button
                    onClick={() => setUrl("")}
                    className="absolute right-4 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <CgClose size={20} />
                  </button>
                )}
              </div>
            </div>

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
            disabled={loading || !url}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-medium transition-all duration-300 ${loading || !url
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

          {url && !loading && (
            <button
              onClick={getShareableLink}
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all duration-300 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
            >
              <BsClipboard size={18} />
              Get Shareable Link
            </button>
          )}
        </div>

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
