"use client";

import { Header } from "@/src/features/generator/components/Header";
import { GeneratorForm } from "@/src/features/generator/components/GeneratorForm";
import { ResultCard } from "@/src/features/generator/components/ResultCard";
import { Footer } from "@/src/features/generator/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 selection:bg-green-500/30">
      <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Header />
        <GeneratorForm />
        <ResultCard />
      </div>
      <Footer />
    </div>
  );
}
