"use client";

import { useGeneratorStore } from "../store/useGeneratorStore";

export function useCopyClipboard() {
  const { result, copied, setCopied } = useGeneratorStore();

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return { copyToClipboard, copied };
}
