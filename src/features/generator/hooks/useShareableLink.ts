"use client";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { toast } from "sonner";

export function useShareableLink() {
  const { url } = useGeneratorStore();

  const getShareableLink = (customUrl?: string) => {
    const targetUrl = customUrl || url;
    if (!targetUrl) return;

    try {
      // Validate the GitHub URL structure
      new URL(targetUrl);

      const cleanPath = targetUrl.replace(/^https?:\/\//, "");
      const shareableUrl = `${window.location.origin}/${cleanPath}`;
      navigator.clipboard.writeText(shareableUrl);
      toast.success("Shareable link copied to clipboard!");
    } catch (error) {
      console.error("Failed to generate shareable link:", error);
      toast.error("Invalid URL format. Please enter a valid GitHub URL.");
    }
  };

  return { getShareableLink };
}
