"use client";

import { motion } from "framer-motion";
import { ArrowUp, Heart, Terminal, Sparkles, ArrowUpRight } from "lucide-react";

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
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.6 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative w-full overflow-hidden border-t border-white/[0.08] bg-[#070709] text-neutral-400">
      {/* ambient subtle top glow */}
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

            <div className="mt-6 flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span
                className="text-[11px] font-mono tracking-wider text-neutral-300"
                style={{ fontFamily: mono }}
              >
                ALL SYSTEMS OPERATIONAL • Q2/Q3 ACTIVE
              </span>
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
                <a
                  href="mailto:mohitkumar.dev@gmail.com"
                  className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#e8814a]"
                >
                  <span>Email</span>
                  <ArrowUpRight size={13} className="text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#e8814a]" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/mohitkumar64"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#e8814a]"
                >
                  <span>GitHub</span>
                  <ArrowUpRight size={13} className="text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#e8814a]" />
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
                  <ArrowUpRight size={13} className="text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#38bdf8]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Back to top + contact (2 cols) */}
          <div className="flex flex-col items-start lg:items-end justify-between lg:col-span-2">
            <span
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400"
              style={{ fontFamily: mono }}
            >
              RETURN
            </span>

            <motion.button
              type="button"
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 group flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#e8814a]/60 hover:bg-[#e8814a]/10 hover:shadow-[0_0_25px_rgba(232,129,74,0.3)] cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp
                size={20}
                className="text-neutral-300 transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-[#e8814a]"
              />
            </motion.button>

            <span
              className="mt-3 text-[10px] uppercase tracking-widest text-neutral-400"
              style={{ fontFamily: mono }}
            >
              TOP OF STREAM
            </span>
          </div>
        </div>

        {/* ── GIANT EDITORIAL WATERMARK ─────────────────────────── */}
        <div className="relative mt-20 select-none overflow-hidden py-4 text-center">
          <span
            className="block whitespace-nowrap font-black tracking-[-0.04em] text-white/[0.03] transition-colors duration-500 hover:text-white/[0.06]"
            style={{
              fontFamily: grotesk,
              fontSize: "clamp(3.5rem, 12.5vw, 11rem)",
              lineHeight: 0.85,
            }}
            aria-hidden
          >
            MOHIT KUMAR
          </span>
        </div>

        {/* ── BOTTOM CREDITS BAR ─────────────────────────────────── */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <div
            className="text-[11px] text-neutral-400"
            style={{ fontFamily: mono }}
          >
            © {new Date().getFullYear()} Mohit Kumar. Crafted with engineering precision.
          </div>

          <div
            className="flex items-center gap-4 text-[11px] text-neutral-400"
            style={{ fontFamily: mono }}
          >
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              NEW DELHI, IN
            </span>
            <span>•</span>
            <span>28.6139° N, 77.2090° E</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
