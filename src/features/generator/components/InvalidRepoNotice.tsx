"use client";

import { BsGithub } from "react-icons/bs";
import Link from "next/link";

interface InvalidRepoNoticeProps {
  title: string;
  description: string;
  providedUrl?: string;
  exampleUrl?: string;
}

export function InvalidRepoNotice({
  title,
  description,
  providedUrl,
  exampleUrl,
}: InvalidRepoNoticeProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
      <div className="text-center space-y-5 max-w-lg">
        <BsGithub className="text-5xl text-red-500 mx-auto" />
        <h1 className="text-[24px] font-light">{title}</h1>
        <p className="text-gray-400 text-[12px] leading-relaxed">{description}</p>

        {exampleUrl && (
          <div className="bg-[#111111] border border-white/10 rounded-[8px] p-3 text-left">
            <p className="text-[12px] tracking-widest text-gray-500 font-semibold mb-1">
              Example:
            </p>
            <code className="text-[12px] text-green-400 break-all">{exampleUrl}</code>
          </div>
        )}

        {providedUrl && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-[8px] p-3 text-left">
            <p className="text-[12px] tracking-widest text-gray-500 font-semibold mb-1">
              Provided URL:
            </p>
            <code className="text-[12px] text-red-400 break-all">{providedUrl}</code>
          </div>
        )}

        <div>
          <Link
            href="/"
            className="inline-block mt-2 px-5 py-2.5 bg-white text-black rounded-[8px] text-[12px] font-medium hover:bg-green-400 transition-all"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
