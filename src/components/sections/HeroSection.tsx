"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import TihmoSignature from "@/components/ui/TihmoSignature";

const ease = [0.22, 1, 0.36, 1] as const;
const grotesk = "var(--font-space-grotesk, 'Space Grotesk'), sans-serif";
const mono = "var(--font-jetbrains, 'JetBrains Mono'), ui-monospace, monospace";


/* ─── Hero Name ───────────────────────────────────────────── */
function HeroName() {
  const word = (text: string, outline: boolean, baseDelay: number) =>
    text.split("").map((char, i) => (
      <span
        key={`${text}-${i}`}
        className="block overflow-hidden select-none pointer-events-none text-[14vw] sm:text-[15vw] md:text-[clamp(4.4rem,13.5vw,23rem)]"
        style={{ paddingBottom: "0.06em", userSelect: "none", WebkitUserSelect: "none" }}
      >
        <motion.span
          className="block select-none"
          initial={{ y: "105%", rotate: 6, opacity: 0 }}
          animate={{ y: "0%", rotate: 0, opacity: 1 }}
          transition={{
            duration: 1.0,
            ease,
            delay: baseDelay + i * 0.055,
          }}
          style={{
            fontFamily: grotesk,
            fontSize: "1em",
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            willChange: "transform",
            userSelect: "none",
            WebkitUserSelect: "none",
            ...(outline
              ? {
                WebkitTextStroke: "1.5px rgba(245,245,245,0.85)",
                color: "transparent",
              }
              : { color: "#f5f5f5" }),
          }}
        >
          {char}
        </motion.span>
      </span>
    ));

  return (
    <h1
      aria-label="Mohit Kumar — Software Engineer"
      className="select-none pointer-events-none flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-20 w-full m-0 whitespace-nowrap"
    >
      <span className="flex items-baseline leading-none" aria-hidden="true">
        {word("MOHIT", true, 0.1)}
      </span>
      <span className="flex items-baseline leading-none" aria-hidden="true">
        {word("KUMAR", false, 0.22)}
      </span>
    </h1>
  );
}

/* ─── Hero Section ───────────────────────────────────────────── */
export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  const k = reduce ? 0 : 1;
  const nameY = useTransform(p, [0, 1], [0, 140 * k]);
  const nameScale = useTransform(p, [0, 1], [1, 1 + 0.08 * k]);
  const boyY = useTransform(p, [0, 1], [0, 70 * k]);
  const boyScale = useTransform(p, [0, 1], [1, 1 + 0.06 * k]);
  const contentY = useTransform(p, [0, 1], [0, -60 * k]);
  const contentOpacity = useTransform(p, [0, 0.55], [1, 0]);
  const sigY = useTransform(p, [0, 1], [0, -160 * k]);
  const glowOpacity = useTransform(p, [0, 1], [1, 0.2]);

  return (
    <section
      ref={ref}
      id="home"
      aria-label="Hero"
      className="relative w-full overflow-hidden h-[75svh] min-h-[520px] md:h-[100svh] md:min-h-[560px]"
      style={{ background: "#0a0a0a" }}
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: glowOpacity,
          background:
            "radial-gradient(ellipse 70% 55% at 50% 100%, rgba(232,129,74,0.14) 0%, transparent 70%)",
        }}
      />

      {/* ── NAME (behind boy) ── */}
      <motion.div
        className="absolute inset-x-0 z-0 pointer-events-none select-none top-[20%] md:top-[35%]"
        style={{
          y: nameY,
          scale: nameScale,
          translateY: "-50%",
          paddingInline: "clamp(4px, 1vw, 16px)",
        }}
      >
        <HeroName />
      </motion.div>

      {/* ── BOY ── */}
      <motion.div
        className="absolute bottom-0 z-10 pointer-events-none flex justify-center items-end"
        style={{
          left: "50%",
          x: "-50%",
          y: boyY,
          scale: boyScale,
          transformOrigin: "50% 100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.15 }}
          className="relative flex justify-center items-end"
        >
          {/* Ambient rim glow */}
          <div
            aria-hidden
            className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: "clamp(260px, 85vw, 650px)",
              height: "clamp(180px, 45vh, 480px)",
              background:
                "radial-gradient(ellipse at 50% 80%, rgba(232,129,74,0.42) 0%, rgba(232,129,74,0.12) 40%, transparent 75%)",
              filter: "blur(28px)",
            }}
          />
          <Image
            src="/boy.png"
            alt="Mohit Kumar"
            width={1312}
            height={1199}
            priority
            unoptimized
            className="w-auto h-[62svh] max-h-[560px] max-w-none md:max-w-full md:h-auto md:max-h-[82vh] md:w-[clamp(420px,65vw,1200px)] object-contain object-bottom select-none drop-shadow-[0_-12px_45px_rgba(232,129,74,0.32)]"
          />
        </motion.div>
      </motion.div>

      {/* ── LEFT CONTENT ── */}
      <motion.div
        className="absolute z-20"
        style={{
          bottom: "clamp(44px, 8vh, 160px)",
          left: "clamp(20px, 4vw, 72px)",
          right: "clamp(20px, 4vw, 72px)",
          maxWidth: "min(clamp(300px, 36vw, 520px), calc(100vw - 40px))",
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        {/* Soft borderless ambient backdrop blur — feathered edges, no box/border */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-4 sm:-inset-8 rounded-3xl backdrop-blur-md md:backdrop-blur-nonebg-black/40 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_95%)]"
        />

        <div className="relative flex flex-col gap-5 sm:gap-6">
          {/* Role */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.5 }}
          >
            <motion.span
              className="block h-[2px] origin-left"
              style={{
                width: 48,
                background: "linear-gradient(90deg,#e8814a,transparent)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.6 }}
            />
            <span
              style={{
                fontSize: "clamp(1.25rem, 2.3vw, 2rem)",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontFamily: grotesk,
                backgroundImage:
                  "linear-gradient(100deg,#f5a26b 0%,#e8814a 45%,#ffd2b0 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "0 0 40px rgba(232,129,74,0.25)",
              }}
            >
              Software Engineer
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.65 }}
            style={{
              fontSize: "clamp(1.1rem, 1.7vw, 1.5rem)",
              lineHeight: 1.6,
              color: "#d9d9de",
              fontWeight: 400,
              fontFamily: grotesk,
              letterSpacing: "-0.01em",
              textShadow: "0 2px 16px rgba(0,0,0,0.85)",
            }}
          >
            let me show you my journey so far —{" "}
            <span style={{ color: "#e8814a", fontWeight: 500 }}>
              what I learn and how I learn it.
            </span>
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#projects"
            className="group inline-flex items-center gap-4 w-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.8 }}
            whileTap={{ scale: 0.96 }}
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "#f5f5f5",
              textDecoration: "none",
              fontFamily: grotesk,
            }}
          >
            <span className="relative flex items-center">
              <span className="block h-[1.5px] w-12 bg-[#f5f5f5]/85 transition-all duration-200 ease-out group-hover:w-20 group-hover:bg-[#e8814a]" />
              <svg
                width="16"
                height="16"
                viewBox="0 0 14 14"
                fill="none"
                className="-ml-1 transition-all duration-200 ease-out group-hover:translate-x-1 group-hover:text-[#e8814a]"
                aria-hidden
              >
                <path
                  d="M2 7H12M12 7L8.5 3.5M12 7L8.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="transition-colors duration-200 group-hover:text-[#e8814a]">
              view my work
            </span>
          </motion.a>
        </div>
      </motion.div>


      {/* ── TIHMO SIGNATURE (desktop only, hidden on mobile to prevent overlap) ── */}
      <motion.div
        className="hidden md:block absolute z-20 pointer-events-none md:bottom-[clamp(150px,27vh,300px)]"
        style={{
          right: "clamp(12px, 5vw, 110px)",
          y: sigY,
        }}
      >
        <motion.div
          style={{ rotate: -18, transformOrigin: "bottom right" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: 1.0 }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          >
            <TihmoSignature delay={1.2} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 pointer-events-none z-20"
      >
        <div className="h-7 w-4.5 rounded-full border border-white/20 p-1 flex justify-center">
          <motion.div
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-[#e8814a]"
          />
        </div>
      </motion.div>

    </section>
  );
}
