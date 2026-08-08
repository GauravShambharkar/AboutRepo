"use client";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { useShareableLink } from "../hooks/useShareableLink";
import { BsClipboard } from "react-icons/bs";

interface ShareButtonProps {
  targetUrl?: string;
}

export function ShareButton({ targetUrl }: ShareButtonProps) {
  const { url, loading } = useGeneratorStore();
  const { getShareableLink } = useShareableLink();

  const currentUrl = targetUrl || url;
  if (!currentUrl || loading) return null;

  return (
    <button
      type="button"
      onClick={() => getShareableLink(targetUrl)}
      className="w-full py-2.5 rounded-[8px] flex items-center justify-center gap-2 font-medium text-[12px] transition-all duration-300 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
    >
      <BsClipboard size={14} />
      <span>Get Shareable Link</span>
    </button>
  );
}
