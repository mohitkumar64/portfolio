"use client";

import React, { useCallback, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowUpRight,
  ShieldCheck,
  Network,
  Box,
  FileSearch,
  type LucideIcon,
} from "lucide-react";

/* ─── theme tokens (match the rest of the site) ─────────────────── */
const mono = "var(--font-jetbrains, 'JetBrains Mono'), ui-monospace, monospace";
const grotesk = "var(--font-space-grotesk, 'Space Grotesk'), sans-serif";
const ease = [0.22, 1, 0.36, 1] as const;
/* vertical-only viewport margin — negative horizontal margins orphan edge nodes */
const IN_VIEW = { once: true, margin: "0px 0px -10% 0px" } as const;

/* ─── data shape — swap these demo entries for real projects ────── */
export type Project = {
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  image: string;
  link?: string;
  icon: LucideIcon;
};

const demoProjects: Project[] = [
  {
    title: "EdgeIDS",
    tagline: "Edge AI Intrusion Detection System",
    description:
      "Real-time network intrusion detection platform combining TensorFlow Lite inference with rule-based threat detection for port scans, SYN floods and volumetric attacks. Built to process live packet metadata at the edge.",
    tech: [
      "Python",
      "TensorFlow Lite",
      "Scapy",
      "React",
      "Node.js",
      "WebSockets",
    ],
    image: "",
    link: "#",
    icon: ShieldCheck,
  },

  {
    title: "Atlas",
    tagline: "Distributed Workflow Engine",
    description:
      "Distributed workflow execution platform built with a decoupled API, Redis-backed job queue and worker architecture. Deployed on AWS with EC2, RDS PostgreSQL, ElastiCache Redis and private VPC networking.",
    tech: [
      "Node.js",
      "PostgreSQL",
      "Redis",
      "AWS EC2",
      "AWS RDS",
      "Docker",
    ],
    image: "",
    link: "#",
    icon: Network,
  },

  {
    title: "3D Portfolio",
    tagline: "Interactive Developer Experience",
    description:
      "Immersive 3D portfolio built around interactive scenes, animated transitions and spatial UI. Uses WebGL-powered components to turn a traditional developer portfolio into an interactive experience.",
    tech: [
      "Next.js",
      "Three.js",
      "React Three Fiber",
      "Framer Motion",
      "Tailwind CSS",
    ],
    image: "",
    link: "#",
    icon: Box,
  },
  {
    title: "ATS",
    tagline: "AI Resume Intelligence Platform",
    description:
      "AI-powered resume analysis platform that evaluates resumes against job requirements using NLP, semantic similarity and structured skill extraction to identify gaps and improve job-match relevance.",
    tech: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "NLP",
      "Embeddings",
      "MongoDB",
    ],
    image: "",
    link: "#",
    icon: FileSearch,
  },
];

/* ─── animation variants ────────────────────────────────────────── */
const panelStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const panelIn: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.96, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease },
  },
};

export default function InteractiveSelector({
  projects = demoProjects,
}: {
  projects?: Project[];
}) {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);

  const select = useCallback((i: number) => setActive(i), []);

  return (
    <div className="w-full select-none">
      {/* ── EXPANDING PANELS ─────────────────────────────────────── */}
      <motion.div
        variants={panelStagger}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW}
        className="flex h-[340px] w-full gap-1.5 overflow-hidden sm:h-[420px] lg:h-[460px] sm:gap-2"
      >
        {projects.map((p, i) => {
          const isActive = active === i;
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title}
              variants={panelIn}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-label={`${p.title} — ${p.tagline}`}
              className="group relative min-w-0 cursor-pointer overflow-hidden rounded-xl outline-none"
              style={{
                border: `1px solid ${isActive ? "rgba(232,129,74,0.65)" : "rgba(255,255,255,0.08)"
                  }`,
                boxShadow: isActive
                  ? "0 24px 70px rgba(0,0,0,0.55), 0 0 40px rgba(232,129,74,0.12)"
                  : "0 12px 32px rgba(0,0,0,0.35)",
              }}
              animate={{
                flexGrow: isActive ? 6.5 : 1,
                flexShrink: 1,
                flexBasis: "0%",
              }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 170, damping: 22, mass: 0.9 }
              }
              onClick={() => select(i)}
              onPointerEnter={() => select(i)}
              onFocus={() => select(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select(i);
                }
              }}
            >
              {/* image — zoomed out & desaturated when collapsed */}
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${p.image}')` }}
                animate={{
                  scale: isActive ? 1.02 : 1.16,
                  filter: isActive
                    ? "saturate(1.05) brightness(0.9)"
                    : "saturate(0.35) brightness(0.55)",
                }}
                transition={{ duration: 0.9, ease }}
              />

              {/* bottom fade */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(6,6,8,0.92) 0%, rgba(6,6,8,0.35) 42%, rgba(6,6,8,0) 68%)",
                }}
              />
              {/* active accent wash */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.7, ease }}
                style={{
                  background:
                    "linear-gradient(to top, rgba(232,129,74,0.16), transparent 45%)",
                }}
              />

              {/* index number */}
              <span
                className="absolute left-3 top-3 z-10 rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[9px] tracking-[0.18em] text-neutral-300 backdrop-blur-md sm:left-4 sm:top-4 sm:text-[10px]"
                style={{ fontFamily: mono }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* icon badge */}
              <motion.div
                aria-hidden
                className="absolute right-3 top-3 z-10 flex items-center justify-center rounded-full border backdrop-blur-md sm:right-4 sm:top-4"
                style={{
                  width: 38,
                  height: 38,
                  borderColor: isActive
                    ? "rgba(232,129,74,0.7)"
                    : "rgba(255,255,255,0.18)",
                  background: isActive
                    ? "rgba(232,129,74,0.22)"
                    : "rgba(14,14,18,0.7)",
                  transition: "border-color .4s, background .4s",
                }}
                animate={reduce ? undefined : { y: isActive ? 0 : -2 }}
                transition={{ type: "spring", stiffness: 320, damping: 14 }}
              >
                <Icon
                  size={17}
                  strokeWidth={1.6}
                  className={
                    isActive ? "text-[#e8814a]" : "text-neutral-300"
                  }
                />
              </motion.div>

              {/* collapsed: vertical tagline */}
              <span
                aria-hidden
                className="absolute bottom-4 left-1/2 z-10 hidden origin-bottom -translate-x-1/2 text-[10px] tracking-[0.28em] text-neutral-300 sm:block"
                style={{
                  fontFamily: mono,
                  writingMode: "vertical-rl",
                  opacity: isActive ? 0 : 1,
                  transition: "opacity .4s",
                }}
              >
                {p.tagline.toUpperCase()}
              </span>

              {/* active: title bar */}
              <motion.div
                className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5"
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : 16,
                }}
                transition={{ duration: 0.55, ease }}
              >
                <div
                  className="truncate text-lg font-bold tracking-[0.04em] text-white sm:text-xl"
                  style={{ fontFamily: grotesk }}
                >
                  {p.title}
                </div>
                <div
                  className="mt-0.5 truncate text-[10px] tracking-[0.2em] text-[#e8814a] sm:text-[11px]"
                  style={{ fontFamily: mono }}
                >
                  {p.tagline.toUpperCase()}
                </div>
              </motion.div>

            </motion.div>
          );
        })}
      </motion.div>

      {/* ── INFO UNDER THE IMAGES (changes with the active panel) ── */}
      <div className="relative mt-5 min-h-[128px] sm:mt-6 sm:min-h-[132px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 18, filter: "blur(6px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: -14, filter: "blur(6px)" }
            }
            transition={{ duration: 0.4, ease }}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
              {/* description */}
              <div className="min-w-0 flex-1">
                <div
                  className="text-[10px] tracking-[0.24em] text-[#e8814a]"
                  style={{ fontFamily: mono }}
                >
                  {projects[active].tagline.toUpperCase()}
                </div>
                <p
                  className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-[15px]"
                  style={{ fontFamily: mono }}
                >
                  {projects[active].description}
                </p>
              </div>

              {/* tech stack chips */}
              <div className="shrink-0 sm:w-[300px]">
                <div
                  className="text-[10px] tracking-[0.24em] text-neutral-500"
                  style={{ fontFamily: mono }}
                >
                  TECH STACK
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {projects[active].tech.map((t, ti) => (
                    <motion.span
                      key={`${active}-${t}`}
                      initial={
                        reduce ? undefined : { opacity: 0, y: 8, scale: 0.9 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.35,
                        ease,
                        delay: 0.08 + ti * 0.05,
                      }}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] tracking-[0.08em] text-neutral-200 transition-colors hover:border-[#e8814a]/60 hover:text-white sm:text-[11px]"
                      style={{ fontFamily: mono }}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
                {projects[active].link && (
                  <motion.a
                    href={projects[active].link}
                    initial={reduce ? undefined : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-4 inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] text-neutral-400 transition-colors hover:text-[#e8814a]"
                    style={{ fontFamily: mono }}
                  >
                    VIEW PROJECT
                    <ArrowUpRight size={13} strokeWidth={1.6} />
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

