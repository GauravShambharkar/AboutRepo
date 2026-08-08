"use client";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { toast } from "sonner";

export function useGenerateDescription() {
  const {
    url: storeUrl,
    features,
    benefits,
    loading,
    setLoading,
    setResult,
    setError,
  } = useGeneratorStore();

  const handleGenerate = async (customUrl?: string) => {
    const targetUrl = customUrl || storeUrl;
    if (!targetUrl) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const startTime = Date.now();
    console.log("Generating description for:", targetUrl);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, features, benefits }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.description);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`Successfully generated in ${duration}s`);
        toast.success("Description generated successfully!");
      } else {
        const errorMsg = data.error || "Failed to generate description";
        console.error("Generation error:", data);
        setError(errorMsg);
        toast.error("Failed to generate description. Check console for details.");
      }
    } catch (err) {
      console.error("Request error:", err);
      setError("Something went wrong. Please try again.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { handleGenerate, loading };
}
