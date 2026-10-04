"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type PanInfo,
  type Variants,
} from "framer-motion";
import {
  Compass,
  Database,
  Code2,
  ShieldCheck,
  Rocket,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ListFilter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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

/* masked line reveal */
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

// Dimensions: expanded canvas height (480px) for generous vertical dragging
const NODE_WIDTH = 195;
const NODE_HEIGHT = 125;
const CANVAS_WIDTH = 1260;
const CANVAS_HEIGHT = 480;

export interface WorkflowNode {
  id: string;
  phase: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "emerald" | "blue" | "amber" | "purple" | "indigo";
  basePos: { x: number; y: number };
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
}

// Centered vertically at y = 175px in 480px canvas, allowing ±100px up/down drag freedom
const INITIAL_NODES: WorkflowNode[] = [
  {
    id: "node-1",
    phase: "PHASE 01",
    title: "Explore Problem",
    description: "Analyze core constraints, user edge-cases and domain contracts.",
    icon: Compass,
    color: "emerald",
    basePos: { x: 30, y: 175 },
    position: { x: 30, y: 175 },
  },
  {
    id: "node-2",
    phase: "PHASE 02",
    title: "Proper Tech Stack",
    description: "Architect scalable primitives, decoupled APIs and strict schemas.",
    icon: Database,
    color: "blue",
    basePos: { x: 280, y: 175 },
    position: { x: 280, y: 175 },
  },
  {
    id: "node-3",
    phase: "PHASE 03",
    title: "Implement",
    description: "Build clean modular components, typed APIs, reactive state and logic.",
    icon: Code2,
    color: "amber",
    basePos: { x: 530, y: 175 },
    position: { x: 530, y: 175 },
  },
  {
    id: "node-4",
    phase: "PHASE 04",
    title: "Test & Optimize",
    description: "Automated end-to-end tests, bundle profiling and zero latency leaks.",
    icon: ShieldCheck,
    color: "purple",
    basePos: { x: 780, y: 175 },
    position: { x: 780, y: 175 },
  },
  {
    id: "node-5",
    phase: "PHASE 05",
    title: "Deploy & Observe",
    description: "Continuous CI/CD rollout, uptime telemetry and live monitoring.",
    icon: Rocket,
    color: "indigo",
    basePos: { x: 1030, y: 175 },
    position: { x: 1030, y: 175 },
  },
];

const INITIAL_CONNECTIONS: WorkflowConnection[] = [
  { id: "c-1-2", from: "node-1", to: "node-2" },
  { id: "c-2-3", from: "node-2", to: "node-3" },
  { id: "c-3-4", from: "node-3", to: "node-4" },
  { id: "c-4-5", from: "node-4", to: "node-5" },
];

const colorClasses: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "#34d399",
  },
  blue: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    dot: "#60a5fa",
  },
  amber: {
    border: "border-[#e8814a]/40",
    bg: "bg-[#e8814a]/10",
    text: "text-[#e8814a]",
    dot: "#e8814a",
  },
  purple: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    dot: "#c084fc",
  },
  indigo: {
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    dot: "#818cf8",
  },
};

// Scissors Cursor SVG
const SCISSORS_CURSOR = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='%23e8814a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='6' cy='6' r='3'/><path d='M8.12 8.12 12 12'/><path d='M20 4 8.12 15.88'/><circle cx='6' cy='18' r='3'/><path d='M14.8 14.8 20 20'/></svg>") 12 12, crosshair`;

export default function HowIBuildSection() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const [nodes, setNodes] = useState<WorkflowNode[]>(INITIAL_NODES);
  const [connections, setConnections] = useState<WorkflowConnection[]>(INITIAL_CONNECTIONS);
  const [hoveredConnId, setHoveredConnId] = useState<string | null>(null);

  // Drag tracking refs
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const draggingNodeId = useRef<string | null>(null);
  const canvasScrollRef = useRef<HTMLDivElement>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"horizontal" | "list">("horizontal");

  const scrollToPhase = (index: number) => {
    setActivePhaseIndex(index);
    if (!canvasScrollRef.current) return;
    const targetNode = nodes[index];
    if (!targetNode) return;
    const offset = Math.max(0, targetNode.basePos.x - 20);
    canvasScrollRef.current.scrollTo({
      left: offset,
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    const prevIdx = Math.max(0, activePhaseIndex - 1);
    scrollToPhase(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(nodes.length - 1, activePhaseIndex + 1);
    scrollToPhase(nextIdx);
  };

  const handleCanvasScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    let closestIndex = 0;
    let minDiff = Infinity;
    nodes.forEach((n, idx) => {
      const diff = Math.abs(n.basePos.x - scrollLeft - 20);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
    setActivePhaseIndex(closestIndex);
  };

  // Parallax glow
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });
  const glowY = useTransform(p, [0, 1], [-60, 80]);

  // Is pipeline broken?
  const isBroken = connections.length < INITIAL_CONNECTIONS.length;

  // Handle Drag Start
  const handleDragStart = (nodeId: string) => {
    draggingNodeId.current = nodeId;
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      dragStartPos.current = { x: node.position.x, y: node.position.y };
    }
  };

  // Handle Drag: vertical freedom (horizontal swiping scrolls canvas smoothly)
  const handleDrag = (nodeId: string, { offset }: PanInfo) => {
    if (draggingNodeId.current !== nodeId || !dragStartPos.current) return;
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const rawY = dragStartPos.current.y + offset.y;
    const clampedY = Math.max(node.basePos.y - 100, Math.min(node.basePos.y + 100, rawY));

    flushSync(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, position: { x: n.basePos.x, y: clampedY } } : n
        )
      );
    });
  };

  const handleDragEnd = () => {
    draggingNodeId.current = null;
    dragStartPos.current = null;
  };

  // Cutting a connection
  const handleCut = (connId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connId));
  };

  // Reconnecting all wires
  const handleRepair = () => {
    setConnections(INITIAL_CONNECTIONS);
    setHoveredConnId(null);
  };

  return (
    <section
      ref={ref}
      id="how-i-build"
      aria-label="How I Build"
      className="relative z-30 w-full border-t border-white/[0.08] transition-colors duration-700 overflow-hidden"
      style={{
        backgroundColor: isBroken ? "#0d0608" : "#0a0a0a",
        minHeight: "90svh",
      }}
    >
      {/* Ambient background glow — turns gloomy red-dim when broken */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          y: glowY,
          background: isBroken
            ? "radial-gradient(ellipse 65% 55% at 50% 35%, rgba(220,38,38,0.12), transparent 75%)"
            : "radial-gradient(ellipse 65% 55% at 50% 35%, rgba(232,129,74,0.09), transparent 75%)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-700"
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

      <div className="relative mx-auto w-full max-w-[1500px] px-6 pt-24 pb-24 sm:px-10 lg:px-16">
        {/* ── HEADER (matches About / Projects / Skills pattern) ──── */}
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
              {isBroken ? "CIRCUIT INTERRUPTED" : "04 / HOW I BUILD"}
            </span>
          </motion.div>

          {/* subtitle kicker */}
          <motion.div
            variants={rise}
            className="mt-8 flex items-center gap-3 text-[10px] tracking-[0.2em] text-neutral-400 sm:text-[11px]"
            style={{ fontFamily: mono }}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                isBroken
                  ? "bg-red-500 shadow-[0_0_12px_#ef4444]"
                  : "bg-[#e8814a] shadow-[0_0_10px_#e8814a]"
              }`}
            />
            {isBroken
              ? "DISCONNECTED • PRODUCTION AT RISK"
              : "METHODOLOGY → EXECUTION → IMPACT"}
          </motion.div>

          {/* dynamic heading */}
          <h2
            className="mt-5"
            style={{
              fontFamily: grotesk,
              letterSpacing: "-0.02em",
              lineHeight: 1.04,
              textTransform: "uppercase" as const,
            }}
          >
            <AnimatePresence mode="wait">
              {isBroken ? (
                <motion.div
                  key="broken-title"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <span
                    className="block font-bold text-red-500"
                    style={{ fontSize: "clamp(2.1rem, 4.6vw, 4.1rem)" }}
                  >
                    You broke it.
                  </span>
                  <span
                    className="block font-semibold text-neutral-300"
                    style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.8rem)" }}
                  >
                    The deployment wire has been cut.
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="normal-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span
                    className="block font-semibold text-white"
                    style={{ fontSize: "clamp(2.1rem, 4.6vw, 4.1rem)" }}
                  >
                    How I build
                  </span>
                  <span
                    className="block font-bold"
                    style={{
                      fontSize: "clamp(2.1rem, 4.6vw, 4.1rem)",
                      backgroundImage:
                        "linear-gradient(90deg, #ffd9bd 0%, #f2a878 45%, #fff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    From concept to code.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </h2>

          <motion.div
            variants={rise}
            className="mt-6 flex flex-wrap items-center justify-between gap-4"
          >
            <p
              className="max-w-xl text-[14px] leading-relaxed text-neutral-400 sm:text-[16px]"
              style={{ fontFamily: grotesk }}
            >
              {isBroken ? (
                <span className="text-red-400/90 font-mono text-[13px]">
                  You severed a pipeline wire! Click the button to reconnect the workflow.
                </span>
              ) : (
                "My structured engineering lifecycle — deconstructing problems, picking robust foundations, animating fluidly, and shipping."
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {isBroken && (
                <motion.button
                  type="button"
                  onClick={handleRepair}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="group flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-mono tracking-wider text-red-300 hover:bg-red-500/25 hover:text-white transition-colors shadow-[0_0_20px_rgba(239,68,68,0.25)] cursor-pointer"
                  style={{ fontFamily: mono }}
                >
                  <RotateCcw size={14} className="transition-transform group-hover:-rotate-90" />
                  <span>REPAIR PIPELINE ⚡</span>
                </motion.button>
              )}

              {/* View Mode Option (User can choose between Horizontal and Pipeline List) */}
              <div className="flex items-center gap-1 rounded-xl bg-white/[0.04] p-1 border border-white/10 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setViewMode("horizontal")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    viewMode === "horizontal"
                      ? "bg-[#e8814a] text-black font-bold shadow-[0_0_12px_rgba(232,129,74,0.35)]"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                  style={{ fontFamily: mono }}
                >
                  <LayoutGrid size={13} />
                  <span>HORIZONTAL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-[#e8814a] text-black font-bold shadow-[0_0_12px_rgba(232,129,74,0.35)]"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                  style={{ fontFamily: mono }}
                >
                  <ListFilter size={13} />
                  <span>PIPELINE LIST</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── CONDITIONAL VIEW: HORIZONTAL CANVAS OR LIST PIPELINE ── */}
        {viewMode === "horizontal" ? (
          <div className="relative mt-6 sm:mt-12 w-full">
            {/* Middle Left Arrow to move backward */}
            <motion.button
              type="button"
              aria-label="Previous Phase"
              onClick={handlePrev}
              disabled={activePhaseIndex === 0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-neutral-900/90 backdrop-blur-md text-white shadow-2xl transition-all cursor-pointer ${
                activePhaseIndex === 0
                  ? "opacity-20 pointer-events-none"
                  : "hover:border-[#e8814a] hover:bg-black active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              }`}
            >
              <ChevronLeft size={20} className="text-[#e8814a]" />
            </motion.button>

            {/* Middle Right Arrow to move forward */}
            <motion.button
              type="button"
              aria-label="Next Phase"
              onClick={handleNext}
              disabled={activePhaseIndex === nodes.length - 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-neutral-900/90 backdrop-blur-md text-white shadow-2xl transition-all cursor-pointer ${
                activePhaseIndex === nodes.length - 1
                  ? "opacity-20 pointer-events-none"
                  : "hover:border-[#e8814a] hover:bg-black active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              }`}
            >
              <ChevronRight size={20} className="text-[#e8814a]" />
            </motion.button>

            {/* ── EXPANDED CANVAS: 480px height for generous up/down dragging ── */}
            <motion.div
              ref={canvasScrollRef}
              onScroll={handleCanvasScroll}
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={IN_VIEW}
              className="relative w-full overflow-x-auto overflow-y-hidden py-4 select-none touch-pan-x scroll-smooth rounded-2xl border border-white/[0.06] bg-black/20"
              style={{ cursor: SCISSORS_CURSOR }}
            >
          {/* Centered Canvas Container with 480px height */}
          <div
            className="relative mx-auto"
            style={{
              width: "100%",
              minWidth: CANVAS_WIDTH,
              maxWidth: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
            }}
          >
            {/* SVG Connection Lines — Strictly connecting from Card socket to Card socket */}
            <svg
              className="absolute inset-0 pointer-events-none w-full h-full select-none"
              style={{ overflow: "visible" }}
            >
              {connections.map((c) => {
                const fromNode = nodes.find((n) => n.id === c.from);
                const toNode = nodes.find((n) => n.id === c.to);
                if (!fromNode || !toNode) return null;

                // Anchors strictly bound to the physical card socket positions
                const startX = fromNode.position.x + NODE_WIDTH;
                const startY = fromNode.position.y + NODE_HEIGHT / 2;
                const endX = toNode.position.x;
                const endY = toNode.position.y + NODE_HEIGHT / 2;

                // Smooth n8n bezier curvature (never loops backward)
                const dx = Math.max(20, endX - startX);
                const cp1X = startX + dx * 0.5;
                const cp2X = endX - dx * 0.5;

                const path = `M${startX},${startY} C${cp1X},${startY} ${cp2X},${endY} ${endX},${endY}`;
                const isHovered = hoveredConnId === c.id;

                return (
                  <g key={c.id}>
                    {/* The original prompt line: stroke 2, dashed 8 6, opacity 0.35 */}
                    <path
                      d={path}
                      fill="none"
                      stroke={isHovered ? "#ef4444" : "currentColor"}
                      strokeWidth={2}
                      strokeDasharray="8,6"
                      strokeLinecap="round"
                      opacity={isHovered ? 0.95 : 0.35}
                      className="text-neutral-300 transition-colors duration-200 pointer-events-none"
                    />

                    {/* Non-draggable scissor cut target: ONLY triggers click */}
                    <path
                      d={path}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={28}
                      className="pointer-events-auto cursor-pointer select-none"
                      onMouseEnter={() => setHoveredConnId(c.id)}
                      onMouseLeave={() => setHoveredConnId(null)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDragStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCut(c.id);
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Nodes — ONLY Cards are draggable vertically, horizontal touch scrolls canvas */}
            {nodes.map((node, index) => {
              const Icon = node.icon;
              const colors = colorClasses[node.color];

              return (
                <motion.div
                  key={node.id}
                  drag="y"
                  dragMomentum={false}
                  dragConstraints={{
                    top: node.basePos.y - 100,
                    bottom: node.basePos.y + 100,
                  }}
                  dragElastic={0}
                  onDragStart={() => handleDragStart(node.id)}
                  onDrag={(_, info) => handleDrag(node.id, info)}
                  onDragEnd={handleDragEnd}
                  style={{
                    x: node.position.x,
                    y: node.position.y,
                    width: NODE_WIDTH,
                    height: NODE_HEIGHT,
                    position: "absolute",
                    left: 0,
                    top: 0,
                    transformOrigin: "0 0",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.04, zIndex: 40 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="select-none cursor-grab active:cursor-grabbing"
                >
                  {/* Left Connection Port Socket */}
                  {index > 0 && (
                    <div
                      className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border border-white/20 bg-[#0d0d11] flex items-center justify-center z-20 pointer-events-none"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
                    </div>
                  )}

                  {/* Right Connection Port Socket */}
                  {index < nodes.length - 1 && (
                    <div
                      className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border border-white/20 bg-[#0d0d11] flex items-center justify-center z-20 pointer-events-none"
                    >
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: colors.dot }}
                      />
                    </div>
                  )}

                  <Card
                    className={`group/card relative h-full w-full overflow-hidden rounded-2xl border ${colors.border} bg-[#0d0d11]/95 p-3.5 backdrop-blur-xl transition-all duration-300 shadow-md`}
                  >
                    {/* Watermark Logo in the card background */}
                    <div
                      className="pointer-events-none absolute -bottom-3 -right-3 text-white/[0.04] transition-all duration-300 group-hover/card:scale-110 group-hover/card:text-white/[0.07]"
                      aria-hidden="true"
                    >
                      <Icon className="h-24 w-24 -rotate-12" />
                    </div>

                    {/* Header: Phase badge & icon */}
                    <div className="relative z-10 flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="rounded-full border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-neutral-400"
                      >
                        {node.phase}
                      </Badge>
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border ${colors.border} ${colors.bg} ${colors.text}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="relative z-10 mt-2.5 text-[13px] font-bold text-white tracking-tight"
                      style={{ fontFamily: grotesk }}
                    >
                      {node.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="relative z-10 mt-1 text-[10.5px] leading-relaxed text-neutral-400 line-clamp-2"
                      style={{ fontFamily: grotesk }}
                    >
                      {node.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Phase indicator beneath canvas */}
        <div className="mt-3 flex items-center justify-between px-2 text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8814a] animate-pulse" />
            <span className="text-[#e8814a] font-semibold">{nodes[activePhaseIndex]?.phase}</span>
            <span className="text-neutral-300">— {nodes[activePhaseIndex]?.title}</span>
          </span>
          <span className="text-[11px] text-neutral-500">
            Phase {activePhaseIndex + 1} of {nodes.length}
          </span>
        </div>
      </div>
    ) : (
      /* ── VERTICAL PIPELINE LIST VIEW ── */
      <div className="relative mt-8 sm:mt-12 flex flex-col gap-5 max-w-2xl mx-auto">
        {/* Continuous vertical line behind cards */}
        <div
          className="absolute left-6 top-6 bottom-6 w-[2px] -translate-x-1/2 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #10b981 0%, #3b82f6 25%, #f59e0b 50%, #a855f7 75%, #6366f1 100%)",
            opacity: 0.45,
          }}
        />

        {nodes.map((node, index) => {
          const colors = colorClasses[node.color];
          const Icon = node.icon;
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative flex items-start gap-4 sm:gap-6 pl-1"
            >
              {/* Timeline node marker */}
              <div className="relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-[#0d0d11] shadow-lg">
                <div
                  className="absolute inset-0 rounded-2xl opacity-25 blur-sm"
                  style={{ backgroundColor: colors.dot }}
                />
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl border ${colors.border} ${colors.bg} ${colors.text}`}
                >
                  <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
              </div>

              {/* Card */}
              <Card className={`group/card flex-1 overflow-hidden rounded-2xl border ${colors.border} bg-[#0d0d11]/90 p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 shadow-md`}>
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#e8814a]"
                  >
                    {node.phase}
                  </Badge>
                  <span className="text-[11px] font-mono text-neutral-500">
                    STEP 0{index + 1}
                  </span>
                </div>

                <h3
                  className="mt-2.5 text-base sm:text-lg font-bold text-white tracking-tight"
                  style={{ fontFamily: grotesk }}
                >
                  {node.title}
                </h3>

                <p
                  className="mt-1.5 text-xs sm:text-sm leading-relaxed text-neutral-400"
                  style={{ fontFamily: grotesk }}
                >
                  {node.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    )}
      </div>
    </section>
  );
}
