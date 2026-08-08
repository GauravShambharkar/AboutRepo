"use client";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { useGenerateDescription } from "../hooks/useGenerateDescription";
import { RiAiGenerate } from "react-icons/ri";
import { CgSpinner } from "react-icons/cg";

interface GenerateButtonProps {
  targetUrl?: string;
}

export function GenerateButton({ targetUrl }: GenerateButtonProps) {
  const { url, loading } = useGeneratorStore();
  const { handleGenerate } = useGenerateDescription();

  const currentUrl = targetUrl || url;
  const isDisabled = loading || !currentUrl;

  return (
    <button
      type="button"
      onClick={() => handleGenerate(targetUrl)}
      disabled={isDisabled}
      className={`w-full py-3 rounded-[8px] flex items-center justify-center gap-2 font-medium text-[12px] transition-all duration-300 ${
        isDisabled
          ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
          : "bg-white text-black hover:bg-green-400 border border-white"
      }`}
    >
      {loading ? (
        <CgSpinner className="animate-spin" size={18} />
      ) : (
        <>
          <RiAiGenerate size={18} />
          <span>Generate Description</span>
        </>
      )}
    </button>
  );
}
