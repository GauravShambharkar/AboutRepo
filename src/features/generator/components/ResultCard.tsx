"use client";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { useCopyClipboard } from "../hooks/useCopyClipboard";
import { BsClipboard, BsCheck2 } from "react-icons/bs";

export function ResultCard() {
  const { result, error } = useGeneratorStore();
  const { copyToClipboard, copied } = useCopyClipboard();

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-[8px] p-4 text-[12px] animate-in fade-in">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="bg-[#111111] border border-green-500/20 rounded-[8px] p-5 space-y-3 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center text-[12px]">
        <span className="text-gray-400 tracking-widest font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Generated Description
        </span>
      </div>

      <div className="relative group pt-1">
        <p className="text-[14px] font-light leading-relaxed text-gray-200 pr-24">
          {result}
        </p>
        <button
          type="button"
          onClick={copyToClipboard}
          className="absolute right-0 top-0 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[6px] px-3 py-1.5 text-[12px] transition-all active:scale-95 group-hover:border-green-500/30 text-white"
        >
          {copied ? (
            <>
              <BsCheck2 className="text-green-500" size={14} />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <BsClipboard size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
