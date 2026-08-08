"use client";

import { UrlInput } from "./UrlInput";
import { FeatureInputFields } from "./FeatureInputFields";
import { GenerateButton } from "./GenerateButton";
import { ShareButton } from "./ShareButton";

interface GeneratorFormProps {
  hideUrlInput?: boolean;
  targetUrl?: string;
}

export function GeneratorForm({ hideUrlInput, targetUrl }: GeneratorFormProps) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-[8px] p-6 shadow-2xl space-y-5">
      {!hideUrlInput && <UrlInput />}
      <FeatureInputFields />
      <GenerateButton targetUrl={targetUrl} />
      {!hideUrlInput && <ShareButton targetUrl={targetUrl} />}
    </div>
  );
}
