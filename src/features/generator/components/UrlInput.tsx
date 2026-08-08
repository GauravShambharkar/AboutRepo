"use client";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { CgClose } from "react-icons/cg";

export function UrlInput() {
  const { url, setUrl } = useGeneratorStore();

  return (
    <div className="">
      <label className="text-[12px]  tracking-widest text-gray-500 font-semibold pl-1">
        GitHub Repository URL
      </label>
      <div className="relative flex items-center group py-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/username/repo"
          className="w-full bg-black/50 border border-white/10 rounded-[8px] px-4 py-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-gray-600 text-white"
        />
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-3 p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear URL"
          >
            <CgClose size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
