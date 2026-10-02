"use client";

import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ParallaxSection from "@/components/sections/ParallaxSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SmoothScroll from "@/components/ui/SmoothScroll";
import OrganicBubbleIntro from "@/components/ui/OrganicBubbleIntro";


export default function Home() {
  return (
    <main className="relative w-full bg-[#0a0a0a]">
      <OrganicBubbleIntro duration={1800} accentColor="#e8814a" />

      <SmoothScroll />
      <Navbar />
      <HeroSection />
      <ParallaxSection />
      <AboutSection />
      <ProjectsSection />

      {/* Temp placeholder section for nav targets */}

      <section
        id="connect"
        className="relative z-30 min-h-[50vh] w-full bg-[#0a0a0a] border-t border-white/[0.08] px-6 pt-24 pb-32 flex flex-col items-center justify-center text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f5f5f5] tracking-tight">
          Let&apos;s connect
        </h2>
      </section>
    </main>
  );
}
