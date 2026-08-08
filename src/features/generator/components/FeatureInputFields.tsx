"use client";

import { useGeneratorStore } from "../store/useGeneratorStore";

export function FeatureInputFields() {
  const { features, setFeatures, benefits, setBenefits } = useGeneratorStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="">
        <label className="text-[12px] tracking-widest text-gray-500 font-semibold pl-1">
          Core Features
        </label>
        <div className="py-2">
          <input
            type="text"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="e.g. Real-time sync, auth"
            className="w-full bg-black/50 border border-white/10 rounded-[8px] px-4 py-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-gray-600 text-white"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-[12px] tracking-widest text-gray-500 font-semibold pl-1">
          Key Benefits
        </label>{" "}
        <div className="py-2">
          <input
            type="text"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="e.g. Speed, Security"
            className="w-full bg-black/50 border border-white/10 rounded-[8px] px-4 py-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-gray-600 text-white"
          />{" "}
        </div>
      </div>
    </div>
  );
}
