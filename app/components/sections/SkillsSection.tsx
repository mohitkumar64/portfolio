"use client";

import { useRef, useState, useCallback } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import {
  AppWindow,
  BrainCircuit,
  CloudCog,
  Database,
  Radio,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/* ─── theme tokens ─────────────────────────────────────────────── */
const mono = "var(--font-jetbrains, 'JetBrains Mono'), ui-monospace, monospace";
const grotesk =
  "var(--font-space-grotesk, 'Space Grotesk'), ui-sans-serif, sans-serif";
const ease = [0.22, 1, 0.36, 1] as const;
const IN_VIEW = { once: true, margin: "0px 0px -8% 0px" } as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease },
  },
};

/* masked line reveal (matches About / Projects) */
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

/* ─── data ─────────────────────────────────────────────────────── */
type Tech = {
  name: string;
  slug?: string;
  level: number;
  dark?: boolean;
  mono?: string;
};

type SkillCategory = {
  id: string;
  name: string;
  blurb: string;
  icon: LucideIcon;
  color: string;
  tech: Tech[];
  stats: { metric: string; value: number }[];
};

const categories: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend",
    blurb: "Interfaces, motion and the rendering layer.",
    icon: AppWindow,
    color: "#e8814a",
    stats: [
      { metric: "UI/UX", value: 88 },
      { metric: "PERF", value: 78 },
      { metric: "ANIM", value: 92 },
      { metric: "A11Y", value: 72 },
      { metric: "STATE", value: 80 },
      { metric: "BUILD", value: 76 },
    ],
    tech: [
      { name: "React", slug: "react", level: 90 },
      { name: "Next.js", slug: "nextjs", dark: true, level: 85 },
      { name: "TypeScript", slug: "typescript", level: 88 },
      { name: "JavaScript", slug: "javascript", level: 92 },
      { name: "Tailwind CSS", slug: "tailwindcss", level: 85 },
      { name: "Three.js", slug: "threejs", level: 55 },
      { name: "Framer Motion", level: 82, mono: "FM" },
      { name: "HTML5", slug: "html5", level: 95 },
      { name: "CSS3", slug: "css3", level: 90 },
      { name: "Vite", slug: "vite", level: 70 },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    blurb: "APIs, services and the machinery behind them.",
    icon: Server,
    color: "#7b8cff",
    stats: [
      { metric: "APIs", value: 85 },
      { metric: "AUTH", value: 78 },
      { metric: "SCALE", value: 72 },
      { metric: "CACHE", value: 68 },
      { metric: "SEC", value: 74 },
      { metric: "ARCH", value: 80 },
    ],
    tech: [
      { name: "Node.js", slug: "nodejs", level: 88 },
      { name: "Express", slug: "express", level: 82 },
      { name: "FastAPI", slug: "fastapi", level: 70 },
      { name: "Python", slug: "python", level: 82 },
      { name: "Socket.IO", slug: "socketio", level: 72 },
      { name: "REST APIs", level: 88, mono: "API" },
      { name: "Auth / JWT", level: 75, mono: "JWT" },
      { name: "Redis", slug: "redis", level: 68 },
      { name: "NGINX", slug: "nginx", level: 55 },
    ],
  },
  {
    id: "aiml",
    name: "AI / ML",
    blurb: "Models, pipelines and practical intelligence.",
    icon: BrainCircuit,
    color: "#a78bfa",
    stats: [
      { metric: "MODELS", value: 72 },
      { metric: "DATA", value: 78 },
      { metric: "NLP", value: 65 },
      { metric: "CV", value: 58 },
      { metric: "DEPLOY", value: 62 },
      { metric: "MATH", value: 70 },
    ],
    tech: [
      { name: "Python", slug: "python", level: 82 },
      { name: "PyTorch", slug: "pytorch", level: 68 },
      { name: "TensorFlow", slug: "tensorflow", level: 60 },
      { name: "Keras", slug: "keras", level: 58 },
      { name: "Pandas", slug: "pandas", level: 78 },
      { name: "NumPy", slug: "numpy", level: 80 },
    ],
  },
  {
    id: "databases",
    name: "Databases",
    blurb: "Schemas, queries and data that scales.",
    icon: Database,
    color: "#34d399",
    stats: [
      { metric: "SQL", value: 82 },
      { metric: "NOSQL", value: 78 },
      { metric: "MODEL", value: 75 },
      { metric: "INDEX", value: 70 },
      { metric: "SCALE", value: 68 },
      { metric: "ORM", value: 72 },
    ],
    tech: [
      { name: "PostgreSQL", slug: "postgresql", level: 60 },
      { name: "MongoDB", slug: "mongodb", level: 78 },
      { name: "MySQL", slug: "mysql", level: 40 },
      { name: "Redis", slug: "redis", level: 68 },
      { name: "Firebase", slug: "firebase", level: 70 },
    ],
  },
  {
    id: "devops",
    name: "Cloud & DevOps",
    blurb: "Shipping, running and keeping it alive.",
    icon: CloudCog,
    color: "#38bdf8",
    stats: [
      { metric: "CI/CD", value: 72 },
      { metric: "DOCKER", value: 78 },
      { metric: "K8S", value: 55 },
      { metric: "IaC", value: 58 },
      { metric: "LINUX", value: 75 },
      { metric: "CLOUD", value: 70 },
    ],
    tech: [
      { name: "Docker", slug: "docker", level: 78 },
      { name: "Kubernetes", slug: "kubernetes", level: 55 },
      { name: "Terraform", slug: "terraform", level: 55 },
      { name: "NGINX", slug: "nginx", level: 65 },
      { name: "Linux", slug: "linux", level: 75 },
      { name: "Vercel", slug: "vercel", level: 80 },
      { name: "Git", slug: "git", dark: true, level: 90 },
    ],
  },
  {
    id: "realtime",
    name: "Real-Time",
    blurb: "Low-latency systems that stay in sync.",
    icon: Radio,
    color: "#fb923c",
    stats: [
      { metric: "WS", value: 78 },
      { metric: "EVENTS", value: 82 },
      { metric: "SYNC", value: 75 },
      { metric: "PUBSUB", value: 68 },
      { metric: "LATENCY", value: 72 },
      { metric: "SCALE", value: 62 },
    ],
    tech: [
      { name: "Socket.IO", slug: "socketio", level: 78 },
      { name: "WebSockets", level: 75, mono: "WS" },
      { name: "Node.js", slug: "nodejs", level: 85 },
      { name: "Redis Pub/Sub", slug: "redis", level: 65 },
      { name: "Firebase", slug: "firebase", level: 70 },
    ],
  },
  {
    id: "tools",
    name: "Tools",
    blurb: "The daily drivers.",
    icon: Wrench,
    color: "#f472b6",
    stats: [
      { metric: "GIT", value: 90 },
      { metric: "IDE", value: 88 },
      { metric: "TEST", value: 68 },
      { metric: "DEBUG", value: 82 },
      { metric: "PKG", value: 78 },
      { metric: "DESIGN", value: 65 },
    ],
    tech: [
      { name: "Git", slug: "git", dark: true, level: 90 },
      { name: "GitHub", slug: "github", dark: true, level: 88 },
      { name: "VS Code", slug: "vscode", level: 92 },
      { name: "Postman", slug: "postman", level: 75 },
      { name: "Figma", slug: "figma", level: 65 },
      { name: "Jest", slug: "jest", level: 68 },
      { name: "npm", slug: "npm", level: 85 },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   SKILL RADAR — recharts-based radar with glow + gradient fill
═══════════════════════════════════════════════════════════════ */
function SkillRadar({
  cat,
  gradientId,
}: {
  cat: SkillCategory;
  gradientId: string;
}) {
  const chartConfig = {
    value: { label: "Score", color: cat.color },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-h-[340px]"
    >
      <RadarChart data={cat.stats} cx="50%" cy="50%" outerRadius="75%">
        <defs>
          <linearGradient id={`${gradientId}-fill`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.08} />
          </linearGradient>
          <filter
            id={`${gradientId}-glow`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="border-white/10 bg-[#0e0e10]/95 text-neutral-200 backdrop-blur-xl"
            />
          }
        />
        <PolarAngleAxis
          dataKey="metric"
          tick={{
            fontSize: 10,
            fill: "#9a9a9e",
            fontFamily: mono,
          }}
        />
        <PolarGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.07)"
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <Radar
          dataKey="value"
          fill={`url(#${gradientId}-fill)`}
          stroke="var(--color-value)"
          strokeWidth={2}
          filter={`url(#${gradientId}-glow)`}
          dot={{
            r: 4,
            fill: "#0a0a0a",
            strokeWidth: 2.5,
            stroke: "var(--color-value)",
          }}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </RadarChart>
    </ChartContainer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TECH LOGO BADGE
═══════════════════════════════════════════════════════════════ */
function TechBadge({
  tech,
  color,
  reduce,
  delay,
}: {
  tech: Tech;
  color: string;
  reduce: boolean;
  delay: number;
}) {
  const [failed, setFailed] = useState(false);
  const initials =
    tech.mono ?? tech.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();

  return (
    <motion.div
      className="group/logo relative flex flex-col items-center gap-2.5"
      initial={{ opacity: 0, y: reduce ? 0 : 20, scale: 0.85, filter: reduce ? "blur(0px)" : "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.55,
        ease,
        delay,
        scale: { type: "spring", stiffness: 260, damping: 20, delay },
      }}
      whileHover={reduce ? undefined : { y: -6, scale: 1.08 }}
    >
      {/* glow on hover */}
      <div
        className="absolute -inset-4 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/logo:opacity-100"
        style={{
          background: `radial-gradient(circle, ${color}18, transparent 70%)`,
        }}
      />

      {/* logo box */}
      <div
        className="flex h-[52px] w-[52px] items-center justify-center rounded-xl border transition-all duration-300"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = `${color}55`;
          el.style.background = `${color}12`;
          el.style.boxShadow = `0 0 30px ${color}22, inset 0 1px 0 rgba(255,255,255,0.06)`;
          el.style.transform = "scale(1.06)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "rgba(255,255,255,0.08)";
          el.style.background = "rgba(255,255,255,0.03)";
          el.style.boxShadow = "none";
          el.style.transform = "scale(1)";
        }}
      >
        {tech.slug && !failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/logo/${tech.slug}.svg`}
            alt=""
            aria-hidden
            width={24}
            height={24}
            loading="lazy"
            onError={() => setFailed(true)}
            className="opacity-60 transition-opacity duration-300 group-hover/logo:opacity-100"
            style={tech.dark ? { filter: "invert(1)" } : undefined}
          />
        ) : (
          <span
            className="text-[11px] font-bold tracking-[0.06em] text-neutral-400 transition-colors group-hover/logo:text-neutral-200"
            style={{ fontFamily: mono }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* name */}
      <span
        className="max-w-[76px] truncate text-center text-[10px] text-neutral-500 transition-colors duration-300 group-hover/logo:text-neutral-200"
        style={{ fontFamily: mono }}
      >
        {tech.name}
      </span>

      {/* skill bar */}
      <div className="h-[2px] w-10 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full origin-left rounded-full"
          style={{ background: color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: tech.level / 100 }}
          transition={{ duration: 0.9, ease, delay: delay + 0.15 }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY PILL BAR
═══════════════════════════════════════════════════════════════ */
function CategoryBar({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="relative -mx-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      {categories.map((cat, i) => {
        const Icon = cat.icon;
        const on = i === active;
        return (
          <motion.button
            key={cat.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={on}
            className="relative flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2.5 outline-none transition-all duration-300 sm:px-4"
            style={{
              borderColor: on ? `${cat.color}50` : "rgba(255,255,255,0.07)",
              background: on ? `${cat.color}14` : "rgba(255,255,255,0.02)",
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {on && (
              <motion.span
                layoutId="skill-pill-glow"
                className="absolute inset-0 rounded-full"
                style={{
                  background: `${cat.color}0c`,
                  border: `1px solid ${cat.color}30`,
                  boxShadow: `0 0 20px ${cat.color}15`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            )}
            <Icon
              size={14}
              strokeWidth={1.8}
              className="relative z-10"
              style={{
                color: on ? cat.color : "#6b6b70",
                transition: "color 0.3s",
              }}
              aria-hidden
            />
            <span
              className="relative z-10 text-[10px] font-medium tracking-[0.14em] whitespace-nowrap sm:text-[11px]"
              style={{
                fontFamily: mono,
                color: on ? "#f0f0f0" : "#7a7a7e",
                transition: "color 0.3s",
              }}
            >
              {cat.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SKILLS SECTION — main export
═══════════════════════════════════════════════════════════════ */
export default function SkillsSection() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const cat = categories[active];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });
  const glowY = useTransform(p, [0, 1], [-80, 120]);

  const select = useCallback((i: number) => setActive(i), []);

  return (
    <section
      ref={ref}
      id="skills"
      aria-label="Skills"
      className="relative z-30 w-full border-t border-white/[0.08] bg-[#0a0a0a]"
      style={{ minHeight: "100svh" }}
    >
      {/* ambient glow that shifts with the category color */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          y: glowY,
          background: `radial-gradient(ellipse 55% 50% at 50% 35%, ${cat.color}10, transparent 70%)`,
          transition: "background 0.8s ease",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 40%, #000 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 40%, #000 20%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-6 pt-28 pb-24 sm:px-10 lg:px-16">
        {/* ── HEADER (matches About section pattern) ──────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW}
        >
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
              03 / SKILLS
            </span>
          </motion.div>

          <motion.div
            variants={rise}
            className="mt-8 flex items-center gap-3 text-[10px] tracking-[0.2em] text-neutral-400 sm:text-[11px]"
            style={{ fontFamily: mono }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8814a] shadow-[0_0_10px_#e8814a]" />
            LEARN → BUILD → MASTER
          </motion.div>

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
                What I
              </span>
            </Line>
            <Line>
              <motion.span
                className="font-bold"
                style={{
                  fontSize: "clamp(2.1rem, 4.6vw, 4.1rem)",
                  backgroundImage:
                    "linear-gradient(90deg, #ffd9bd 0%, #f2a878 45%, #fff 100%)",
                  backgroundSize: "220% 100%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
                animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
                transition={{
                  duration: 4.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              >
                work with
              </motion.span>
            </Line>
          </h2>

          <motion.p
            variants={rise}
            className="mt-8 max-w-[34rem] text-[15px] leading-[1.75] text-neutral-400 sm:text-base"
            style={{ fontFamily: grotesk }}
          >
            Click a category to see how the stat profile shifts —
            each axis is a self-assessed proficiency area.
          </motion.p>
        </motion.div>

        {/* ── CATEGORY BAR ────────────────────────────────────── */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={IN_VIEW}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          <CategoryBar active={active} onSelect={select} />
        </motion.div>

        {/* ── MAIN: RADAR + TECH GRID ─────────────────────────── */}
        <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-16 xl:gap-20">
          {/* LEFT: RADAR */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={IN_VIEW}
            transition={{ duration: 1, ease }}
          >
            <div className="relative w-full max-w-[400px]">
              {/* slow-rotating dashed ring */}
              <motion.div
                aria-hidden
                className="absolute left-1/2 top-1/2 -z-10 rounded-full"
                style={{
                  width: "115%",
                  height: "115%",
                  x: "-50%",
                  y: "-50%",
                  border: `1px dashed ${cat.color}28`,
                  transition: "border-color 0.8s ease",
                }}
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{
                  duration: 80,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* the radar chart */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.88, rotate: reduce ? 0 : -6, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.88, rotate: reduce ? 0 : 6, filter: "blur(8px)" }}
                  transition={{ duration: 0.6, ease }}
                >
                  <SkillRadar cat={cat} gradientId={`radar-${cat.id}`} />
                </motion.div>
              </AnimatePresence>

              {/* center icon badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={cat.id}
                  className="pointer-events-none absolute left-1/2 top-1/2 flex flex-col items-center gap-1.5"
                  style={{ x: "-50%", y: "-50%" }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.4, ease }}
                >
                  {(() => {
                    const Icon = cat.icon;
                    return (
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-500"
                        style={{
                          borderColor: `${cat.color}35`,
                          background: `${cat.color}12`,
                          boxShadow: `0 0 24px ${cat.color}18`,
                        }}
                      >
                        <Icon
                          size={19}
                          strokeWidth={1.8}
                          style={{ color: cat.color }}
                        />
                      </span>
                    );
                  })()}
                  <span
                    className="text-[9px] font-semibold tracking-[0.2em]"
                    style={{ fontFamily: mono, color: cat.color }}
                  >
                    {cat.name.toUpperCase()}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT: TECH GRID + BLURB */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={cat.id}
                initial={{
                  opacity: 0,
                  x: reduce ? 0 : 30,
                  filter: "blur(8px)",
                }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  x: reduce ? 0 : -20,
                  filter: "blur(8px)",
                }}
                transition={{ duration: 0.55, ease }}
              >
                {/* category header */}
                <div className="mb-8 flex items-center gap-4">
                  {(() => {
                    const Icon = cat.icon;
                    return (
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-500"
                        style={{
                          borderColor: `${cat.color}30`,
                          background: `${cat.color}10`,
                        }}
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.8}
                          style={{ color: cat.color }}
                        />
                      </span>
                    );
                  })()}
                  <div className="min-w-0">
                    <h3
                      className="text-lg font-semibold tracking-tight text-white"
                      style={{ fontFamily: grotesk }}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className="mt-0.5 text-[12px] text-neutral-500"
                      style={{ fontFamily: mono }}
                    >
                      {cat.blurb}
                    </p>
                  </div>
                </div>

                {/* tech logo grid */}
                <div className="grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-5 lg:grid-cols-5">
                  {cat.tech.map((tech, i) => (
                    <TechBadge
                      key={`${cat.id}-${tech.name}`}
                      tech={tech}
                      color={cat.color}
                      reduce={reduce}
                      delay={0.06 + i * 0.045}
                    />
                  ))}
                </div>

                {/* bottom stats bar */}
                <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-white/[0.06] pt-5 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] tracking-[0.2em] text-neutral-600"
                      style={{ fontFamily: mono }}
                    >
                      TOOLS
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: mono, color: cat.color }}
                    >
                      {String(cat.tech.length).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] tracking-[0.2em] text-neutral-600"
                      style={{ fontFamily: mono }}
                    >
                      AVG
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: mono, color: cat.color }}
                    >
                      {Math.round(
                        cat.tech.reduce((s, t) => s + t.level, 0) /
                        cat.tech.length
                      )}
                      %
                    </span>
                  </div>
                  <span className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] tracking-[0.2em] text-neutral-600"
                      style={{ fontFamily: mono }}
                    >
                      AXES
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: mono, color: cat.color }}
                    >
                      {String(cat.stats.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <p
          className="mt-16 text-right text-[10px] tracking-[0.2em] text-neutral-600"
          style={{ fontFamily: mono }}
        >
          /S &nbsp;SELF-ASSESSED PROFICIENCY · NOT A BENCHMARK
        </p>
      </div>
    </section>
  );
}