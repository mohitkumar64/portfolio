"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  Mail,
  Copy,
  Check,
  Globe,
  Radio,
  Clock,
  MapPin,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import MinimalistDock, { type DockItem } from "@/components/ui/minimal-dock";

/* ─── theme tokens ─────────────────────────────────────────────── */
const mono = "var(--font-jetbrains, 'JetBrains Mono'), ui-monospace, monospace";
const grotesk =
  "var(--font-space-grotesk, 'Space Grotesk'), ui-sans-serif, sans-serif";
const ease = [0.22, 1, 0.36, 1] as const;
const IN_VIEW = { once: true, margin: "0px 0px -8% 0px" } as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease },
  },
};

/* masked line reveal matching About / Projects / Skills pattern */
function Line({ children }: { children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block origin-left"
        variants={{
          hidden: { y: "110%", rotate: 3 },
          show: { y: "0%", rotate: 0, transition: { duration: 1.0, ease } },
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ─── LinkedIn SVG Vector ───────────────────────────────────────── */
function LinkedInIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
    </svg>
  );
}

/* ─── Live India Clock ─────────────────────────────────────────── */
function IndiaClock() {
  const [timeStr, setTimeStr] = useState<string>("");
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istOptions: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat("en-US", istOptions);
      setTimeStr(formatter.format(now));

      const istHour = parseInt(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          hour12: false,
        }).format(now),
        10
      );
      setIsNight(istHour < 6 || istHour >= 19);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span
        className="text-[11px] font-mono tracking-wider text-neutral-300"
        style={{ fontFamily: mono }}
      >
        {timeStr ? (
          <>
            <span className="text-white font-medium">{timeStr}</span>
            <span className="text-neutral-400 ml-1.5 text-[10px]">
              IST (UTC+5:30) {isNight ? "🌙" : "☀️"}
            </span>
          </>
        ) : (
          <span className="text-neutral-500">CALCULATING IST...</span>
        )}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONNECT SECTION
═══════════════════════════════════════════════════════════════ */
export default function ConnectSection() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  /* Scroll-driven parallax values */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  const glowY = useTransform(p, [0, 1], [-80, 100]);
  const sideY = useTransform(p, [0, 1], [30, -30]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("mohitkumar.dev@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  /* Minimalist Dock Items for Connect */
  const dockConnectItems: DockItem[] = [
    {
      id: "email",
      icon: <Mail size={20} className="text-[#e8814a] transition-colors" />,
      label: "Email: mohitkumar.dev@gmail.com",
      href: "mailto:mohitkumar.dev@gmail.com",
    },
    {
      id: "copy",
      icon: copied ? (
        <Check size={20} className="text-emerald-400" />
      ) : (
        <Copy size={20} className="text-neutral-300 hover:text-white" />
      ),
      label: copied ? "Copied to clipboard!" : "Copy Email",
      onClick: handleCopyEmail,
    },
    {
      id: "github",
      icon: (
        <div className="relative h-5 w-5">
          <Image
            src="/logo/github.svg"
            alt="GitHub"
            fill
            className="object-contain brightness-0 invert"
          />
        </div>
      ),
      label: "GitHub: @mohitkumar64",
      href: "https://github.com/mohitkumar64",
    },
    {
      id: "linkedin",
      icon: <LinkedInIcon className="w-5 h-5 text-[#38bdf8]" />,
      label: "LinkedIn: Mohit Kumar",
      href: "https://www.linkedin.com/in/mohit-kumar-339a84330",
    },
  ];

  return (
    <section
      ref={ref}
      id="connect"
      aria-label="Connect"
      className="relative z-30 w-full border-t border-white/[0.08] bg-[#0a0a0a]"
      style={{ minHeight: "80svh" }}
    >
      {/* ambient glow shifting on scroll */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          y: glowY,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 35%, rgba(232,129,74,0.09), transparent 75%)",
        }}
      />

      {/* subtle grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 85%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-6 pt-24 pb-28 sm:px-10 lg:px-16">
        {/* ── SECTION HEADER (matches About / Projects / Skills pattern) ──── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW}
        >
          {/* kicker with expanding line */}
          <motion.div variants={rise} className="flex items-center gap-5">
            <motion.span
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 1, ease } },
              }}
              className="block h-px w-14 origin-left bg-white/40"
            />
            <span
              className="text-[11px] tracking-[0.22em] text-neutral-400"
              style={{ fontFamily: mono }}
            >
              05 / CONNECT
            </span>
          </motion.div>

          {/* subtitle kicker */}
          <motion.div
            variants={rise}
            className="mt-8 flex items-center gap-3 text-[10px] tracking-[0.2em] text-neutral-400 sm:text-[11px]"
            style={{ fontFamily: mono }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8814a] shadow-[0_0_10px_#e8814a]" />
            SIGNALS ACTIVE • CONNECT & COLLABORATE
          </motion.div>

          {/* heading */}
          <h2
            className="mt-5"
            style={{
              fontFamily: grotesk,
              letterSpacing: "-0.02em",
              lineHeight: 1.04,
              textTransform: "uppercase" as const,
            }}
          >
            <Line>
              <span
                className="font-semibold text-white"
                style={{ fontSize: "clamp(2.1rem, 4.6vw, 4.1rem)" }}
              >
                Let&apos;s build
              </span>
            </Line>
            <Line>
              <motion.span
                className="font-bold"
                style={{
                  fontSize: "clamp(2.1rem, 4.6vw, 4.1rem)",
                  backgroundImage:
                    "linear-gradient(90deg, #ffd9bd 0%, #f2a878 45%, #fff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Something extraordinary.
              </motion.span>
            </Line>
          </h2>

          <motion.p
            variants={rise}
            className="mt-6 max-w-2xl text-[14px] leading-relaxed text-neutral-400 sm:text-[16px]"
            style={{ fontFamily: grotesk }}
          >
            Have a project in mind, an exciting role to discuss, or want to connect?
            Hover and click any channel below to reach out directly.
          </motion.p>
        </motion.div>

        {/* ── MAIN CONTENT: DOCK ON LEFT + FLEXIBLE SPACE ON RIGHT ──── */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Interactive Minimalist Dock (6 cols) */}
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            className="flex flex-col items-start gap-8 lg:col-span-6"
          >
            <div>
              <span
                className="block text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-4"
                style={{ fontFamily: mono }}
              >
                QUICK ACCESS DOCK
              </span>

              {/* Minimalist Dock for Connect Logos */}
              <div className="pb-16">
                <MinimalistDock items={dockConnectItems} />
              </div>
            </div>

            {/* Quick status indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-[12px] text-neutral-400" style={{ fontFamily: mono }}>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span>Inbox Monitored</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#e8814a] shadow-[0_0_8px_#e8814a]" />
                <span>Open for Opportunities</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean Telemetry Side Hub (6 cols) */}
          <motion.div
            style={{ y: reduce ? 0 : sideY }}
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            className="flex flex-col gap-5 lg:col-span-6"
          >
            {/* Ambient Glass Telemetry Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0e0e12]/80 p-6 sm:p-7 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
              {/* Top ambient highlight */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8814a]/30 to-transparent"
                aria-hidden
              />

              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-[#e8814a]" />
                  <span
                    className="text-[11px] font-mono tracking-wider text-neutral-300 font-semibold uppercase"
                    style={{ fontFamily: mono }}
                  >
                    LIVE PRESENCE
                  </span>
                </div>
                <IndiaClock />
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <Radio size={14} className="animate-pulse" />
                  </div>
                  <div>
                    <span
                      className="block text-[10px] tracking-wider text-neutral-400 uppercase"
                      style={{ fontFamily: mono }}
                    >
                      CURRENT STATUS
                    </span>
                    <p
                      className="text-[13px] font-medium text-neutral-200 mt-0.5"
                      style={{ fontFamily: grotesk }}
                    >
                      Available for select opportunities & engineering roles
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-neutral-300">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <span
                      className="block text-[10px] tracking-wider text-neutral-400 uppercase"
                      style={{ fontFamily: mono }}
                    >
                      LOCATION
                    </span>
                    <p
                      className="text-[13px] font-medium text-neutral-200 mt-0.5"
                      style={{ fontFamily: grotesk }}
                    >
                      India (New Delhi) • 28.6139° N, 77.2090° E
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick direct chat invitation */}
              <div className="mt-6 rounded-2xl border border-white/[0.06] bg-black/40 p-4">
                <div className="flex items-center gap-2.5 text-[#e8814a]">
                  <Sparkles size={15} />
                  <span
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ fontFamily: mono }}
                  >
                    15-Minute Sync
                  </span>
                </div>
                <p
                  className="mt-1.5 text-[12px] text-neutral-400 leading-relaxed"
                  style={{ fontFamily: grotesk }}
                >
                  Prefer a short voice/video discussion over Google Meet or Discord?
                  Feel free to request a sync anytime.
                </p>
                <a
                  href="mailto:mohitkumar.dev@gmail.com?subject=Quick%2015-Minute%20Introductory%20Sync"
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#e8814a] hover:underline"
                  style={{ fontFamily: mono }}
                >
                  REQUEST A CALL ↗
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
