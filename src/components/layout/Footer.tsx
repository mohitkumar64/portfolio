"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Check,
  Copy,
  Sparkles,
  ArrowUpRight,
  Activity,
  MapPin,
  Clock,
  Compass,
  Cpu,
} from "lucide-react";

const mono = "var(--font-jetbrains, 'JetBrains Mono'), ui-monospace, monospace";
const grotesk =
  "var(--font-space-grotesk, 'Space Grotesk'), ui-sans-serif, sans-serif";

const NAV_LINKS = [
  { label: "00 / Home", href: "#home" },
  { label: "01 / About Me", href: "#about" },
  { label: "02 / Projects", href: "#projects" },
  { label: "03 / Skills", href: "#skills" },
  { label: "04 / Connect", href: "#connect" },
];

export default function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [isNight, setIsNight] = useState(false);
  const [watermarkHover, setWatermarkHover] = useState({ x: 0, y: 0, active: false });
  const [watermarkCelebrated, setWatermarkCelebrated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const watermarkRef = useRef<HTMLDivElement>(null);

  // Live IST Clock for Roorkee, Uttarakhand
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

  // Track page scroll percentage for circular return button
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(
          100,
          Math.max(0, (window.scrollY / totalHeight) * 100)
        );
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.6 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("mohitkumar.dev@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText("29.8543° N, 77.8880° E");
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2400);
  };

  const handleWatermarkMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!watermarkRef.current) return;
    const rect = watermarkRef.current.getBoundingClientRect();
    setWatermarkHover({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleWatermarkClick = () => {
    setWatermarkCelebrated(true);
    setTimeout(() => setWatermarkCelebrated(false), 2500);
  };

  return (
    <footer className="relative w-full overflow-hidden border-t border-white/[0.08] bg-[#070709] text-neutral-400">
      {/* Ambient subtle top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[180px] w-[600px] rounded-full bg-[#e8814a]/10 blur-[100px]"
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-6 pt-20 pb-12 sm:px-10 lg:px-16">
        {/* ── UPPER GRID ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Identity & Bio (5 cols) */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#e8814a] shadow-[0_0_10px_#e8814a]" />
              <span
                className="text-[14px] font-bold tracking-[0.16em] uppercase text-white"
                style={{ fontFamily: grotesk }}
              >
                MOHIT KUMAR
              </span>
            </div>

            <p
              className="mt-4 max-w-sm text-[13px] leading-relaxed text-neutral-400 sm:text-[14px]"
              style={{ fontFamily: grotesk }}
            >
              Software Engineer crafting high-performance, responsive digital
              architectures and immersive web experiences with meticulous attention
              to detail and motion.
            </p>

            {/* Interactive System Status Button / Pill */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setDiagnosticsOpen(!diagnosticsOpen)}
                className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md transition-all hover:border-[#e8814a]/50 hover:bg-[#e8814a]/10 cursor-pointer"
                title="Click to toggle system diagnostics"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span
                  className="text-[11px] font-mono tracking-wider text-neutral-300 transition-colors group-hover:text-white"
                  style={{ fontFamily: mono }}
                >
                  SYSTEMS ONLINE • ROORKEE NODE
                </span>
                <Activity
                  size={12}
                  className="text-neutral-500 transition-transform group-hover:scale-110 group-hover:text-[#e8814a]"
                />
              </button>

              {/* Interactive Diagnostics Popover Drawer */}
              <AnimatePresence>
                {diagnosticsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e12]/95 p-4 text-[11px] font-mono backdrop-blur-xl shadow-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[#e8814a]">
                      <span className="font-semibold uppercase tracking-wider">
                        TELEMETRY DIAGNOSTICS
                      </span>
                      <span className="text-[10px] text-emerald-400">LATENCY: 16MS</span>
                    </div>
                    <div className="mt-3 space-y-1.5 text-neutral-400">
                      <div className="flex justify-between">
                        <span>CORE STACK:</span>
                        <span className="text-neutral-200">Next.js 16 + React 19</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MASCOT ENGINE:</span>
                        <span className="text-[#e8814a]">Feral Blob v0.2.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ORIGIN NODE:</span>
                        <span className="text-neutral-200">Roorkee, Uttarakhand</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LIVE IST:</span>
                        <span className="text-emerald-400">{timeStr || "Active"}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Sitemap (3 cols) */}
          <div className="lg:col-span-3">
            <span
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400"
              style={{ fontFamily: mono }}
            >
              NAVIGATION MAP
            </span>

            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[12px] tracking-wider text-neutral-400 transition-colors hover:text-[#e8814a]"
                    style={{ fontFamily: mono }}
                  >
                    <span className="h-1 w-1 rounded-full bg-neutral-600 transition-colors group-hover:bg-[#e8814a]" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Channels (2 cols) */}
          <div className="lg:col-span-2">
            <span
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400"
              style={{ fontFamily: mono }}
            >
              DIRECT FREQUENCIES
            </span>

            <ul
              className="mt-4 space-y-2.5 text-[12px] text-neutral-400"
              style={{ fontFamily: mono }}
            >
              <li>
                <div className="flex items-center gap-2">
                  <a
                    href="mailto:mohitkumar.dev@gmail.com"
                    className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#e8814a]"
                  >
                    <span>Email</span>
                    <ArrowUpRight
                      size={13}
                      className="text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#e8814a]"
                    />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
                    title={copiedEmail ? "Copied!" : "Copy email"}
                  >
                    {copiedEmail ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </li>
              <li>
                <a
                  href="https://github.com/mohitkumar64"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#e8814a]"
                >
                  <span>GitHub</span>
                  <ArrowUpRight
                    size={13}
                    className="text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#e8814a]"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/mohit-kumar-339a84330"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#38bdf8]"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight
                    size={13}
                    className="text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#38bdf8]"
                  />
                </a>
              </li>
            </ul>
          </div>

          {/* Back to top + interactive scroll indicator (2 cols) */}
          <div className="flex flex-col items-start lg:items-end justify-between lg:col-span-2">
            <span
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400"
              style={{ fontFamily: mono }}
            >
              RETURN
            </span>

            <div className="relative mt-4">
              {/* Circular SVG Scroll Progress Ring */}
              <svg className="absolute -inset-1.5 h-[68px] w-[68px] -rotate-90 pointer-events-none">
                <circle
                  cx="34"
                  cy="34"
                  r="28"
                  className="stroke-white/10 fill-none"
                  strokeWidth="2"
                />
                <circle
                  cx="34"
                  cy="34"
                  r="28"
                  className="stroke-[#e8814a] fill-none transition-all duration-150"
                  strokeWidth="2.5"
                  strokeDasharray="175.9"
                  strokeDashoffset={175.9 - (175.9 * scrollProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>

              <motion.button
                type="button"
                onClick={scrollToTop}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#e8814a]/60 hover:bg-[#e8814a]/10 hover:shadow-[0_0_25px_rgba(232,129,74,0.35)] cursor-pointer"
                aria-label="Back to top"
                title={`Back to top (${Math.round(scrollProgress)}% scrolled)`}
              >
                <ArrowUp
                  size={20}
                  className="text-neutral-300 transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-[#e8814a]"
                />
              </motion.button>
            </div>

            <span
              className="mt-3 text-[10px] uppercase tracking-widest text-neutral-400"
              style={{ fontFamily: mono }}
            >
              {Math.round(scrollProgress)}% • TOP OF STREAM
            </span>
          </div>
        </div>

        {/* ── GIANT EDITORIAL WATERMARK WITH INTERACTIVE FLASHLIGHT SPOTLIGHT ── */}
        <div
          ref={watermarkRef}
          onMouseMove={handleWatermarkMouseMove}
          onMouseLeave={() => setWatermarkHover((prev) => ({ ...prev, active: false }))}
          onClick={handleWatermarkClick}
          className="relative mt-20 select-none overflow-hidden py-4 text-center cursor-pointer group"
          title="Click for a surprise!"
        >
          {/* Mouse-following spotlight glow */}
          {watermarkHover.active && (
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-[#e8814a]/25 via-[#e8814a]/5 to-transparent blur-xl transition-opacity duration-300"
              style={{
                left: watermarkHover.x,
                top: watermarkHover.y,
                width: 320,
                height: 320,
              }}
            />
          )}

          <span
            className="block whitespace-nowrap font-black tracking-[-0.04em] text-white/[0.03] transition-colors duration-500 group-hover:text-white/[0.08]"
            style={{
              fontFamily: grotesk,
              fontSize: "clamp(3.5rem, 12.5vw, 11rem)",
              lineHeight: 0.85,
            }}
            aria-hidden
          >
            MOHIT KUMAR
          </span>

          {/* Interactive celebration badge on click */}
          <AnimatePresence>
            {watermarkCelebrated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="rounded-full border border-[#e8814a]/40 bg-[#161414]/95 px-5 py-2 font-mono text-[13px] text-[#ffd3ba] shadow-2xl backdrop-blur-md flex items-center gap-2">
                  <Sparkles size={16} className="text-[#e8814a]" />
                  <span>Thanks for visiting Mohit Kumar&apos;s Portfolio! 🚀</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── BOTTOM CREDITS BAR: UPDATED LOCATION & INTERACTIVITY ──── */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <div
            className="text-[11px] text-neutral-400"
            style={{ fontFamily: mono }}
          >
            © {new Date().getFullYear()} Mohit Kumar. Crafted with engineering precision.
          </div>

          {/* Interactive Roorkee, Uttarakhand Location Pill */}
          <div
            className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400"
            style={{ fontFamily: mono }}
          >
            <div
              className="group relative flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 transition-all hover:border-[#e8814a]/40 hover:bg-[#e8814a]/10 cursor-pointer"
              title="Roorkee, Uttarakhand, India"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-neutral-200 group-hover:text-white font-medium">
                ROORKEE, UTTARAKHAND, IN
              </span>
              <span className="text-neutral-500">🏔️</span>
            </div>

            <span>•</span>

            {/* Clickable coordinates to copy */}
            <button
              type="button"
              onClick={handleCopyCoords}
              className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-[#e8814a] transition-colors cursor-pointer"
              title="Click to copy coordinates"
            >
              <Compass size={13} className="text-neutral-500 group-hover:text-[#e8814a]" />
              <span>29.8543° N, 77.8880° E</span>
              {copiedCoords ? (
                <span className="text-emerald-400 text-[10px]">Copied!</span>
              ) : (
                <Copy size={11} className="text-neutral-500 group-hover:text-[#e8814a]" />
              )}
            </button>

            <span>•</span>

            {/* Live IST clock */}
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Clock size={12} className="text-[#e8814a]" />
              <span>{timeStr ? `${timeStr} IST` : "IST"}</span>
              <span className="text-[10px]">{isNight ? "🌙" : "☀️"}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
