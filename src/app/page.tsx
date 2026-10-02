"use client";

import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ParallaxSection from "@/components/sections/ParallaxSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import HowIBuildSection from "@/components/sections/HowIBuildSection";
import SmoothScroll from "@/components/ui/SmoothScroll";
import OrganicBubbleIntro from "@/components/ui/OrganicBubbleIntro";

import ConnectSection from "@/components/sections/ConnectSection";
import Footer from "@/components/layout/Footer";

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
      <SkillsSection />
      <HowIBuildSection />
      <ConnectSection />
      <Footer />
    </main>
  );
}
