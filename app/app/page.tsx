"use client";

import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import OrganicBubbleIntro from "@/components/ui/OrganicBubbleIntro";

export default function Home() {
  return (
    <main className="relative min-h-[220vh] w-full bg-[#0a0a0a]">
      {/* ── Linear Organic Bubble Loading Intro ── */}
      <OrganicBubbleIntro duration={1800} accentColor="#e8814a" />

      <Navbar />
      <HeroSection />

      {/* ── Scroll Section to verify Hero Parallax ── */}
      <section
        id="projects"
        className="relative z-30 min-h-screen w-full bg-[#0c0c0f] border-t border-white/[0.08] px-6 py-24 flex flex-col items-center justify-center text-center"
      >
        <div className="max-w-xl mx-auto flex flex-col items-center gap-5">
          <span className="text-xs uppercase tracking-[0.25em] text-[#e8814a] font-semibold">
            Next Section
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f5f5f5] tracking-tight">
            Parallax &amp; Transitions
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Scroll up and down to observe the multi-layered hero depth, and refresh the page anytime to replay the slow organic bubble intro.
          </p>
        </div>
      </section>
    </main>
  );
}
