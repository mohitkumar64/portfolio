"use client";

import { useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const mono = "var(--font-jetbrains, 'JetBrains Mono'), ui-monospace, monospace";
const ease = [0.22, 1, 0.36, 1] as const;
/* vertical-only so elements near the viewport edges still trigger */
const IN_VIEW = { once: true, margin: "0px 0px 15% 0px" } as const;

type NodeDef = {
  id: string;
  label: string;
  x: number;
  y: number;
  side: "left" | "right";
  bend: number;
};

const CENTER = { x: 50, y: 50 };

const nodes: NodeDef[] = [
  { id: "ai", label: "AI / ML", x: 50, y: 9, side: "right", bend: 10 },
  { id: "fe", label: "FRONTEND", x: 17, y: 27, side: "left", bend: -9 },
  { id: "db", label: "DATABASES", x: 86, y: 33, side: "right", bend: 9 },
  { id: "be", label: "BACKEND", x: 12, y: 60, side: "left", bend: 8 },
  { id: "do", label: "DEVOPS", x: 92, y: 66, side: "right", bend: -9 },
  { id: "sd", label: "SYSTEM DESIGN", x: 22, y: 88, side: "left", bend: -10 },
  { id: "rt", label: "REAL TIME", x: 80, y: 91, side: "right", bend: 10 },
];

const links: [string, string][] = [
  ["fe", "ai"],
  ["ai", "db"],
  ["db", "do"],
  ["do", "rt"],
  ["rt", "sd"],
  ["sd", "be"],
  ["be", "fe"],
];

/* Round so server and client render identical attribute strings */
const r2 = (n: number) => Math.round(n * 100) / 100;

function curve(a: { x: number; y: number }, b: { x: number; y: number }, bend: number) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = r2(mx + (-dy / len) * bend);
  const cy = r2(my + (dx / len) * bend);
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

export default function IdeasNetwork() {
  const reduce = !!useReducedMotion();
  const [hover, setHover] = useState<string | null>(null);

  const particles = useMemo(() => {
    const r = seeded(42);
    return Array.from({ length: 44 }, () => {
      const ang = r() * Math.PI * 2;
      const rad = 8 + r() * 40;
      return {
        x: r2(50 + Math.cos(ang) * rad),
        y: r2(50 + Math.sin(ang) * rad),
        r: r2(0.18 + r() * 0.36),
        d: r2(2 + r() * 4),
        delay: r2(r() * 3),
        warm: r() > 0.72,
      };
    });
  }, []);

  /* pointer parallax (two depth layers) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.5 });
  const backX = useTransform(sx, (v) => v * 10);
  const backY = useTransform(sy, (v) => v * 10);
  const frontX = useTransform(sx, (v) => v * -18);
  const frontY = useTransform(sy, (v) => v * -18);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[680px] px-0"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      role="img"
      aria-label="Network diagram: ideas at the center connected to frontend, backend, AI/ML, databases, DevOps, system design and real-time systems"
    >
      {/* BACK layer: orbits, particles, links */}
      <motion.div className="absolute inset-0" style={{ x: backX, y: backY }}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          {/* orbit rings */}
          <motion.g
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
          >
            {[0, 58, 118].map((rot) => (
              <ellipse
                key={rot}
                cx={50}
                cy={50}
                rx={46}
                ry={19}
                transform={`rotate(${rot} 50 50)`}
                fill="none"
                stroke="rgba(255,255,255,0.09)"
                strokeWidth={0.18}
              />
            ))}
          </motion.g>
          <circle cx={50} cy={50} r={30} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={0.15} />

          {/* node-to-node web */}
          {links.map(([a, b], i) => (
            <motion.path
              key={a + b}
              d={curve(byId[a], byId[b], i % 2 ? 7 : -7)}
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth={0.18}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.05 }}
            />
          ))}

          {/* spokes from the center */}
          {nodes.map((n, i) => {
            const d = curve(CENTER, n, n.bend);
            const active = hover === n.id;
            return (
              <g key={n.id}>
                <motion.path
                  d={d}
                  fill="none"
                  animate={{
                    stroke: active ? "rgba(232,129,74,0.9)" : "rgba(255,255,255,0.22)",
                    strokeWidth: active ? 0.35 : 0.2,
                  }}
                  initial={{ pathLength: 0, strokeWidth: 0.2 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={IN_VIEW}
                  transition={{
                    pathLength: { duration: 0.8, ease, delay: 0.1 + i * 0.06 },
                    default: { duration: 0.3 },
                  }}
                />
                {!reduce && (
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="#ffb888"
                    strokeWidth={0.55}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="0.035 0.965"
                    animate={{ strokeDashoffset: [0, -1] }}
                    transition={{
                      duration: 3.2 + (i % 4) * 0.6,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.45,
                    }}
                    style={{ filter: "drop-shadow(0 0 1px #e8814a)" }}
                  />
                )}
              </g>
            );
          })}

          {/* particles */}
          {particles.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill={p.warm ? "#e8814a" : "#cfcfd6"}
              initial={{ opacity: 0 }}
              animate={reduce ? { opacity: 0.5 } : { opacity: [0.15, 0.9, 0.15] }}
              transition={{
                duration: p.d,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </motion.div>

      {/* FRONT layer: nodes + core */}
      <motion.div className="absolute inset-0" style={{ x: frontX, y: frontY }}>
        {/* core */}
        <div
          className="absolute"
          style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
        >
          {/* ignition shockwaves */}
          {[0, 0.18].map((d) => (
            <motion.span
              key={d}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-[#e8814a]/50"
              style={{
                width: "clamp(44px, 7.4vw, 62px)",
                height: "clamp(44px, 7.4vw, 62px)",
                x: "-50%",
                y: "-50%",
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 4.2, opacity: [0, 0.65, 0] }}
              viewport={IN_VIEW}
              transition={{ duration: 1.3, ease: "easeOut", delay: 0.25 + d }}
            />
          ))}
          <motion.div
            aria-hidden
            className="absolute rounded-full"
            style={{
              inset: "-120%",
              background:
                "radial-gradient(circle, rgba(232,129,74,0.38) 0%, transparent 65%)",
            }}
            animate={reduce ? undefined : { scale: [0.9, 1.15, 0.9], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={IN_VIEW}
            transition={{ type: "spring", stiffness: 210, damping: 13, delay: 0.1 }}
            className="relative rounded-full"
            style={{
              width: "clamp(44px, 7.4vw, 62px)",
              height: "clamp(44px, 7.4vw, 62px)",
              background:
                "radial-gradient(circle at 35% 30%, #ffc79c 0%, #f08a4c 45%, #b9531f 100%)",
              boxShadow:
                "0 0 40px rgba(232,129,74,0.7), inset 0 -6px 14px rgba(120,40,0,0.45)",
            }}
          />
          <motion.span
            className="absolute left-full top-1/2 ml-5 -translate-y-1/2 text-[10px] tracking-[0.2em] text-neutral-300"
            style={{ fontFamily: mono }}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 0.6, ease, delay: 0.55 }}
          >
            IDEAS
          </motion.span>
        </div>

        {/* nodes */}
        {nodes.map((n, i) => {
          const active = hover === n.id;
          return (
            <motion.div
              key={n.id}
              className="absolute"
              style={{ left: `${n.x}%`, top: `${n.y}%`, x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0, rotate: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={IN_VIEW}
              transition={{
                opacity: { duration: 0.25, delay: 0.3 + i * 0.05 },
                rotate: {
                  type: "spring",
                  stiffness: 240,
                  damping: 16,
                  delay: 0.3 + i * 0.05,
                },
                scale: {
                  type: "spring",
                  stiffness: 260,
                  damping: 15,
                  delay: 0.3 + i * 0.05,
                },
              }}
              onPointerEnter={() => setHover(n.id)}
              onPointerLeave={() => setHover(null)}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -5, 0] }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
                className="relative flex items-center"
              >
                {/* landing ripple */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 block rounded-full border border-[#e8814a]/70"
                  style={{
                    width: "clamp(12px, 2.4vw, 20px)",
                    height: "clamp(12px, 2.4vw, 20px)",
                    x: "-50%",
                    y: "-50%",
                  }}
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 3.4, opacity: [0, 0.9, 0] }}
                  viewport={IN_VIEW}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.42 + i * 0.05 }}
                />
                <motion.span
                  className="block rounded-full"
                  animate={{ scale: active ? 1.35 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{
                    width: "clamp(12px, 2.4vw, 20px)",
                    height: "clamp(12px, 2.4vw, 20px)",
                    background:
                      "radial-gradient(circle at 35% 30%, #fff 0%, #c8c8cf 40%, #55555c 100%)",
                    boxShadow: active
                      ? "0 0 22px rgba(232,129,74,0.8)"
                      : "0 0 14px rgba(255,255,255,0.18)",
                    transition: "box-shadow .3s",
                  }}
                />
                <span
                  className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[3px] px-2.5 py-1 text-[7.5px] sm:text-[10px] tracking-[0.08em] sm:tracking-[0.14em] ${
                    n.side === "right" ? "left-full ml-2 sm:ml-3" : "right-full mr-2 sm:mr-3"
                  }`}
                  style={{
                    fontFamily: mono,
                    color: active ? "#fff" : "#c9c9cf",
                    background: active ? "rgba(232,129,74,0.18)" : "rgba(14,14,18,0.85)",
                    border: `1px solid ${active ? "rgba(232,129,74,0.7)" : "rgba(255,255,255,0.14)"}`,
                    transition: "all .3s",
                  }}
                >
                  <motion.span
                    className="block"
                    initial={{ opacity: 0, y: 7, filter: "blur(5px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={IN_VIEW}
                    transition={{ duration: 0.5, ease, delay: 0.5 + i * 0.05 }}
                  >
                    {n.label}
                  </motion.span>
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
