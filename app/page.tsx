"use client";

import { useState } from "react";
import { BsGithub, BsClipboard, BsCheck2 } from "react-icons/bs";
import { RiAiGenerate } from "react-icons/ri";
import { CgClose, CgSpinner } from "react-icons/cg";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.description);
      } else {
        setError(data.error || "Failed to generate description");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
          <div className="space-y-2">
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
            {error && (
              <p className="text-red-400 text-sm pl-2 animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
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
