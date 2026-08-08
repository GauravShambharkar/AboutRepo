"use client";

import { Header, GeneratorForm, ResultCard, Footer } from "@/src/features/generator";

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
