"use client";

import { BsGithub } from "react-icons/bs";

interface HeaderProps {
  repoUrl?: string | null;
}

export function Header({ repoUrl }: HeaderProps) {
  return (
    <div className="text-center space-y-3">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <BsGithub className="text-7xl text-green-500/50 blur-2xl absolute inset-0 animate-pulse" />
          <BsGithub className="text-7xl relative z-10" />
        </div>
      </div>
      <h1 className="text-[48px] leading-tight font-light tracking-tight text-white">
        Its About Repo
      </h1>
      <p className="text-gray-400 text-[18px] font-light leading-snug">
        Generate developer-focused GitHub "About" descriptions in seconds.
      </p>

      {repoUrl && (
        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-[8px]">
          <p className="text-[12px] text-gray-400 tracking-widest font-semibold mb-1">
            Repository
          </p>
          <p className="text-green-400 font-mono text-[12px] break-all">
            {repoUrl}
          </p>
        </div>
      )}
    </div>
  );
}
