"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TihmoSignature from "@/components/ui/TihmoSignature";

/* ─── Helpers ─────────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

/* ─── Hero Name (full-width, boy peeks through center) ───── */
function HeroName() {
  const firstName = "MOHIT".split("");
  const lastName = "KUMAR".split("");

  const letterVariants = (baseDelay: number) => ({
    initial: { opacity: 0, y: 60 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 2.1, ease, delay: baseDelay + i * 0.04 },
    }),
  });

  return (
    <div
      aria-label="Mohit Kumar"
      className="absolute inset-x-0 z-0 pointer-events-none select-none flex items-center justify-center gap-25"
      style={{
        top: "35%",
        transform: "translateY(-50%)",
        paddingLeft: "clamp(4px, 1vw, 16px)",
        paddingRight: "clamp(4px, 1vw, 16px)",
      }}
    >
      {/* ── MOHIT — outline, flush left ── */}
      <div className="flex items-baseline leading-none">
        {firstName.map((char, i) => (
          <motion.span
            key={`f-${i}`}
            custom={i}
            variants={letterVariants(0)}
            initial="initial"
            animate="animate"
            style={{
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk'), sans-serif",
              fontSize: "clamp(4.4rem, 13.5vw, 23rem)",
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: "-0.03em",
              WebkitTextStroke: "2px rgba(245,245,245,0.80)",
              color: "transparent",
              display: "block",
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* ── KUMAR — filled white, flush right ── */}
      <div className="flex items-baseline leading-none">
        {lastName.map((char, i) => (
          <motion.span
            key={`l-${i}`}
            custom={i}
            variants={letterVariants(0.12)}
            initial="initial"
            animate="animate"
            style={{
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk'), sans-serif",
              fontSize: "clamp(4.4rem, 13.5vw, 23rem)",
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: "-0.03em",
              color: "#f5f5f5",
              display: "block",
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ─── Boy Image ─────────────────────────────────────────────── */
function BoyImage() {
  return (
    <motion.div
      className="absolute bottom-0 z-10 pointer-events-none"
      style={{ left: "28%", transform: "translateX(-50%)" }}
      initial={{ opacity: 0, y: 75 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2.2, ease, delay: 0 }}
    >
      {/* Floor glow */}
      <div
        aria-hidden
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "clamp(180px, 28vw, 1000px)",
          height: "clamp(80px, 14vw, 1000px)",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(232,129,74,0.30) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />
      {/* Boy */}
      <Image
        src="/boy.png"
        alt="Mohit Kumar"
        width={500}
        height={680}
        priority
        style={{
          width: "clamp(300px, 44vw, 1200px)",
          height: "auto",
          maxHeight: "130vh",
          objectFit: "contain",
          objectPosition: "bottom",
          filter: "drop-shadow(0 -20px 80px rgba(232,129,74,0.18))",
        }}
      />
    </motion.div>
  );
}

/* ─── Left Content ───────────────────────────────────────────── */
function LeftContent() {
  return (
    <motion.div
      className="absolute z-20 flex flex-col gap-6"
      style={{
        bottom: "clamp(80px, 14vh, 160px)",
        left: "clamp(20px, 4vw, 72px)",
        maxWidth: "clamp(280px, 32vw, 460px)",
      }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 2.0, ease, delay: 0.08 }}
    >
      {/* Role badge */}
      <div className="flex items-center gap-3">
        <span
          className="block h-[2px]"
          style={{ width: 34, background: "#e8814a" }}
        />
        <span
          style={{
            fontSize: "clamp(0.95rem, 1.35vw, 1.2rem)",
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: "#e8814a",
            textTransform: "uppercase",
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk'), sans-serif",
          }}
        >
          Software Engineer
        </span>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)",
          lineHeight: 1.65,
          color: "#e2e2e6",
          fontWeight: 400,
          fontFamily: "var(--font-space-grotesk, 'Space Grotesk'), sans-serif",
          letterSpacing: "-0.01em",
        }}
      >
        let me show you my journey so far —{" "}
        <em
          style={{
            color: "#e8814a",
            fontWeight: 500,
            fontStyle: "normal",
          }}
        >
          what I learn and how I learn it.
        </em>
      </p>

      {/* CTA */}
      <motion.a
        href="#projects"
        className="group inline-flex items-center gap-3.5 w-fit mt-1"
        style={{
          fontSize: "clamp(0.95rem, 1.3vw, 1.12rem)",
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: "#f5f5f5",
          textDecoration: "none",
          fontFamily: "var(--font-space-grotesk, 'Space Grotesk'), sans-serif",
        }}
        whileHover={{ x: 6 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
      >
        <span className="flex items-center gap-0">
          {/* Long animated line */}
          <motion.span
            style={{
              display: "inline-block",
              height: "1.5px",
              width: 44,
              background: "rgba(245,245,245,0.85)",
            }}
            whileHover={{ width: 62 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          />
          {/* Arrow head */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 14 14"
            fill="none"
            className="transition-transform duration-200 group-hover:translate-x-1.5"
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
        <span>view my work</span>
      </motion.a>
    </motion.div>
  );
}

/* ─── Hero Section ───────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section
      id="home"
      aria-label="Hero"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: 560, background: "#0a0a0a" }}
    >
      {/* Deep amber radial from bottom-center */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 100%, rgba(232,129,74,0.09) 0%, transparent 70%)",
        }}
      />

      {/* ── NAME (z:0, behind boy) ── */}
      <HeroName />

      {/* ── BOY IMAGE (z:10, center) ── */}
      <BoyImage />

      {/* ── LEFT CONTENT (z:20, over everything on left) ── */}
      <LeftContent />

      {/* ── TIHMO WATERMARK (bottom-right, tilted) ── */}
      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{
          bottom: "clamp(56px, 12vh, 120px)",
          right: "clamp(8px, 2.5vw, 48px)",
          transform: "rotate(-14deg)",
          transformOrigin: "bottom right",
        }}
        initial={{ opacity: 0, rotate: -22, scale: 0.85 }}
        animate={{ opacity: 1, rotate: -14, scale: 1 }}
        transition={{ duration: 2.0, ease, delay: 0.12 }}
      >
        <TihmoSignature />
      </motion.div>

      {/* ── SCROLL INDICATOR (center-bottom) ── */}
      <motion.div
        aria-hidden
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 1.6, ease }}
      >
        <div
          className="overflow-hidden"
          style={{
            width: "1px",
            height: 44,
            background: "rgba(255,255,255,0.08)",
          }}
        >
          <motion.div
            style={{
              width: "100%",
              height: "45%",
              background: "rgba(232,129,74,0.7)",
            }}
            animate={{ y: ["0%", "222%"] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.3,
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
