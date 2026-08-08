import { create } from "zustand";

interface GeneratorState {
  url: string;
  features: string;
  benefits: string;
  loading: boolean;
  result: string | null;
  error: string | null;
  copied: boolean;

  setUrl: (url: string) => void;
  setFeatures: (features: string) => void;
  setBenefits: (benefits: string) => void;
  setLoading: (loading: boolean) => void;
  setResult: (result: string | null) => void;
  setError: (error: string | null) => void;
  setCopied: (copied: boolean) => void;
  reset: () => void;
}

export const useGeneratorStore = create<GeneratorState>((set) => ({
  url: "",
  features: "",
  benefits: "",
  loading: false,
  result: null,
  error: null,
  copied: false,

  setUrl: (url) => set({ url }),
  setFeatures: (features) => set({ features }),
  setBenefits: (benefits) => set({ benefits }),
  setLoading: (loading) => set({ loading }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setCopied: (copied) => set({ copied }),
  reset: () =>
    set({
      url: "",
      features: "",
      benefits: "",
      loading: false,
      result: null,
      error: null,
      copied: false,
    }),
}));
