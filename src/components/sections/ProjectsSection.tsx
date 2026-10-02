"use client";

import { useRef } from "react";
import { motion, type Variants } from "framer-motion";
import InteractiveSelector from "@/components/ui/interactive-selector";

const grotesk = "var(--font-space-grotesk, 'Space Grotesk'), sans-serif";
const mono = "var(--font-jetbrains, 'JetBrains Mono'), ui-monospace, monospace";
const ease = [0.22, 1, 0.36, 1] as const;

/* masked line reveal (same pattern as AboutSection) */
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

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export default function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      id="projects"
      aria-label="Selected projects"
      className="relative w-full overflow-hidden bg-[#0c0c0f]"
      style={{ minHeight: "100svh" }}
    >
      {/* ambient accent glow + faint grid (matches AboutSection) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 55% at 25% 30%, rgba(232,129,74,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 40% 40%, #000 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 40% 40%, #000 20%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-6 pb-24 pt-28 sm:px-10 lg:px-16">
        {/* ── HEADER (matches About section pattern) ── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        >
          <motion.div variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
          }} className="flex items-center gap-5">
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
              02 / PROJECTS
            </span>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.06 } },
            }}
            className="mt-8 flex items-center gap-3 text-[10px] tracking-[0.2em] text-neutral-400 sm:text-[11px]"
            style={{ fontFamily: mono }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8814a] shadow-[0_0_10px_#e8814a]" />
            CONCEPT → CODE → SHIP
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
                Things I&apos;ve
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
                Built
              </motion.span>
            </Line>
          </h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.9, ease, delay: 0.15 },
              },
            }}
            className="mt-8 max-w-[34rem] text-[15px] leading-[1.75] text-neutral-400 sm:text-base"
            style={{ fontFamily: grotesk }}
          >
            A few things I&apos;ve shipped — hover or tap a panel to explore.
          </motion.p>
        </motion.div>

        {/* ── SELECTOR ── */}
        <div className="mt-12 sm:mt-16">
          <InteractiveSelector />
        </div>

        <p
          className="mt-10 text-right text-[10px] tracking-[0.2em] text-neutral-600"
          style={{ fontFamily: mono }}
        >
          /P &nbsp;MORE ON THE WAY
        </p>
      </div>
    </section>
  );
}
