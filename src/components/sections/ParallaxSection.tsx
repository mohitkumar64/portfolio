"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

const grotesk = "var(--font-space-grotesk, 'Space Grotesk'), sans-serif";

/* ─── Giant marquee row driven by scroll ─────────────────── */
function Row({
  text,
  progress,
  from,
  to,
  outline,
}: {
  text: string;
  progress: MotionValue<number>;
  from: string;
  to: string;
  outline?: boolean;
}) {
  const x = useTransform(progress, [0, 1], [from, to]);
  const content = Array.from({ length: 4 }, () => text).join("  ✦  ");
  return (
    <motion.div
      aria-hidden
      className="whitespace-nowrap leading-[0.95] will-change-transform"
      style={{
        x,
        fontFamily: grotesk,
        fontWeight: 900,
        fontSize: "clamp(4rem, 13vw, 12rem)",
        letterSpacing: "-0.03em",
        ...(outline
          ? { WebkitTextStroke: "1.5px rgba(245,245,245,0.12)", color: "transparent" }
          : { color: "rgba(245,245,245,0.035)" }),
      }}
    >
      {content}
    </motion.div>
  );
}

/* ─── Word that lights up as you scroll ──────────────────── */
function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span
      className="inline-block mr-[0.26em]"
      style={{ opacity, color: accent ? "#f59a62" : "#fafafa" }}
    >
      {children}
    </motion.span>
  );
}

/* ─── Rope ────────────────────────────────────────────────── */
type Pt = [number, number];

/** Quadratic rope that hangs by gravity (sy) and/or bulges sideways (sx). */
function ropePath(a: Pt, b: Pt, sx: number, sy: number) {
  const cx = (a[0] + b[0]) / 2 + sx * 2;
  const cy = (a[1] + b[1]) / 2 + sy * 2;
  return `M ${a[0]} ${a[1]} Q ${cx} ${cy} ${b[0]} ${b[1]}`;
}

function Rope({
  a,
  b,
  sx = 0,
  sy = 0,
  progress,
  delay = 0,
  reduce,
}: {
  a: Pt;
  b: Pt;
  sx?: number;
  sy?: number;
  progress: MotionValue<number>;
  delay?: number;
  reduce: boolean;
}) {
  const draw = useTransform(progress, [0.02 + delay, 0.2 + delay], [0, 1]);
  const d1 = ropePath(a, b, sx, sy);
  const d2 = ropePath(a, b, sx * 1.35, sy * 1.35);
  const animate = reduce
    ? { d: d1 }
    : { d: [d1, d2, d1] };
  const transition = {
    duration: 5 + delay * 10,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };
  const common = {
    fill: "none",
    strokeLinecap: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <g>
      {/* thin line, same language as the About Me network */}
      <motion.path
        {...common}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth={1.2}
        style={{ pathLength: draw }}
        animate={animate}
        transition={transition}
      />
      {/* travelling spark */}
      {!reduce && (
        <motion.path
          {...common}
          stroke="#ffb888"
          strokeWidth={2.4}
          pathLength={1}
          strokeDasharray="0.035 0.965"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: [0, -1], d: [d1, d2, d1] }}
          transition={{
            strokeDashoffset: {
              duration: 3.6 + delay * 8,
              repeat: Infinity,
              ease: "linear",
            },
            d: transition,
          }}
          style={{ opacity: draw, filter: "drop-shadow(0 0 3px #e8814a)" }}
        />
      )}
    </g>
  );
}

/* ─── Card hanging on the ropes ───────────────────────────── */
function RopeCard({
  at,
  label,
  children,
  progress,
  index,
  reduce,
}: {
  at: Pt;
  label: string;
  children: React.ReactNode;
  progress: MotionValue<number>;
  index: number;
  reduce: boolean;
}) {
  const opacity = useTransform(progress, [0, 0.1], [0, 1]);
  const scale = useTransform(progress, [0, 0.1], [0.85, 1]);
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${at[0]}%`,
        top: `${at[1]}%`,
        x: "-50%",
        y: "-50%",
        opacity,
        scale,
      }}
    >
      <motion.div
        animate={reduce ? undefined : { rotate: [-1.6, 1.6, -1.6], y: [0, -6, 0] }}
        transition={{
          duration: 5 + index * 0.9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.05 }}
        className="relative rounded-xl px-3 py-2 md:rounded-2xl md:px-5 md:py-4 backdrop-blur-md"
        style={{
          background: "rgba(20,20,24,0.78)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        {/* rope anchors */}
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-[#e8814a] bg-[#0a0a0a] shadow-[0_0_10px_#e8814a]" />
        <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-[#e8814a] bg-[#0a0a0a] shadow-[0_0_10px_#e8814a]" />
        <p
          className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-[#e8814a]"
          style={{ fontFamily: grotesk }}
        >
          {label}
        </p>
        <div
          className="mt-0.5 md:mt-1 max-w-[7.5rem] md:max-w-none text-[12px] leading-tight md:text-lg font-semibold text-white md:whitespace-nowrap"
          style={{ fontFamily: grotesk }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

const sentence: { w: string; accent?: boolean }[] = [
  { w: "I" }, { w: "turn" }, { w: "curious" }, { w: "ideas", accent: true },
  { w: "into" }, { w: "clean," }, { w: "fast" }, { w: "software", accent: true },
  { w: "—" }, { w: "learning" }, { w: "in" }, { w: "public," },
  { w: "one" }, { w: "build" }, { w: "at" }, { w: "a" }, { w: "time." },
];

const DESKTOP: Pt[] = [[14, 20], [86, 24], [15, 82], [85, 78]];
const MOBILE: Pt[] = [[26, 9], [74, 12], [26, 91], [74, 88]];

export default function ParallaxSection() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const mq = window.matchMedia("(max-width: 767px)");
      const on = () => setIsMobile(mq.matches);
      on();
      mq.addEventListener("change", on);
      return () => mq.removeEventListener("change", on);
    }, []);
    const [A, B, C, D] = isMobile ? MOBILE : DESKTOP;
  const reduce = !!reduceMotion;
  const k = reduce ? 0 : 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 });

  const { scrollYProgress: pin } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const q = useSpring(pin, { stiffness: 90, damping: 24, mass: 0.35 });

  const orb1Y = useTransform(p, [0, 1], [200 * k, -300 * k]);
  const orb2Y = useTransform(p, [0, 1], [-100 * k, 260 * k]);
  const orb3Y = useTransform(p, [0, 1], [120 * k, -160 * k]);
  const gridY = useTransform(p, [0, 1], [0, -120 * k]);
  const ringRotate = useTransform(q, [0, 1], [0, 220 * k]);
  const ringScale = useTransform(q, [0, 0.5, 1], [0.8, 1.15, 0.9]);
  const kickerOpacity = useTransform(q, [0, 0.1], [0, 1]);
  const barScale = useTransform(q, [0.05, 0.75], [0, 1]);
  const frameY = useTransform(q, [0, 1], [40 * k, -60 * k]);
  const stageOpacity = useTransform(q, [0.88, 1], [1, 0]);

  const n = sentence.length;

  return (
    <section
      ref={ref}
      id="story"
      aria-label="Intro"
      className="relative w-full"
      style={{ height: "300vh", background: "#0a0a0a" }}
    >
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-40 z-30 pointer-events-none"
        style={{ background: "linear-gradient(#0a0a0a, transparent)" }}
      />

      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ opacity: stageOpacity }}
      >
        {/* Grid */}
        <motion.div
          aria-hidden
          className="absolute inset-[-10%] pointer-events-none"
          style={{
            y: gridY,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 75%)",
          }}
        />

        {/* Orbs */}
        <motion.div
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            y: orb1Y, top: "8%", left: "-8%", width: "42vw", height: "42vw",
            background: "radial-gradient(circle, rgba(232,129,74,0.22), transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            y: orb2Y, bottom: "-10%", right: "-6%", width: "38vw", height: "38vw",
            background: "radial-gradient(circle, rgba(120,140,255,0.14), transparent 65%)",
            filter: "blur(50px)",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            y: orb3Y, top: "55%", left: "40%", width: "18vw", height: "18vw",
            background: "radial-gradient(circle, rgba(232,129,74,0.14), transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Rotating ring */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
          style={{
            width: "min(70vw, 760px)",
            height: "min(70vw, 760px)",
            x: "-50%",
            y: "-50%",
            rotate: ringRotate,
            scale: ringScale,
            border: "1px dashed rgba(232,129,74,0.22)",
          }}
        >
          <span
            className="absolute rounded-full"
            style={{
              width: 12, height: 12, top: -6, left: "50%", marginLeft: -6,
              background: "#e8814a", boxShadow: "0 0 20px #e8814a",
            }}
          />
        </motion.div>

        {/* Giant marquee rows (very faint — texture only) */}
        <div
          aria-hidden
          className="absolute inset-0 flex flex-col justify-center gap-2 pointer-events-none select-none"
        >
          <Row text="BUILD" progress={q} from="0%" to={`${-40 * k}%`} />
          <Row text="EXPLORE" progress={q} from={`${-45 * k}%`} to="0%" outline />
          <Row text="CREATE" progress={q} from="0%" to={`${-40 * k}%`} />
        </div>

        {/* Rope frame: ropes + cards share one layer so anchors never drift */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: frameY }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <Rope a={A} b={B} sy={4} progress={q} reduce={reduce} />
            <Rope a={B} b={D} sx={isMobile ? 3 : 5} progress={q} delay={0.04} reduce={reduce} />
            <Rope a={D} b={C} sy={isMobile ? 4 : 7} progress={q} delay={0.08} reduce={reduce} />
            <Rope a={C} b={A} sx={isMobile ? -3 : -5} progress={q} delay={0.12} reduce={reduce} />
          </svg>

          <RopeCard at={A} label="Stack" progress={q} index={0} reduce={reduce}>
            React · Next.js · TS
          </RopeCard>
          <RopeCard at={B} label="Focus" progress={q} index={1} reduce={reduce}>
            Interfaces that feel alive
          </RopeCard>
          <RopeCard at={C} label="Mindset" progress={q} index={2} reduce={reduce}>
            Always learning
          </RopeCard>
          <RopeCard at={D} label="Status" progress={q} index={3} reduce={reduce}>
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              Open to work
            </span>
          </RopeCard>
        </motion.div>

        {/* Center copy */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          {/* dark backing so text always reads cleanly */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[70%] w-[min(92vw,1000px)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.7) 55%, transparent 100%)",
            }}
          />

          <motion.span
            style={{ opacity: kickerOpacity, fontFamily: grotesk }}
            className="mb-7 text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#e8814a]"
          >
            The short story
          </motion.span>

          <h2
            style={{
              fontFamily: grotesk,
              fontWeight: 600,
              fontSize: "clamp(1.9rem, 4.1vw, 3.6rem)",
              lineHeight: 1.22,
              letterSpacing: "-0.02em",
              maxWidth: "min(88vw, 24em)",
              textWrap: "balance",
            }}
          >
            {sentence.map((s, i) => {
              const start = 0.06 + (i / n) * 0.4;
              return (
                <Word key={i} progress={q} range={[start, start + 0.06]} accent={s.accent}>
                  {s.w}
                </Word>
              );
            })}
          </h2>

          <div className="mt-10 h-[2px] w-40 overflow-hidden rounded bg-white/10">
            <motion.div
              className="h-full w-full origin-left"
              style={{
                scaleX: barScale,
                background: "linear-gradient(90deg,#e8814a,#ffd2b0)",
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
