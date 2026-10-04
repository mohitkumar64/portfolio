"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, GraduationCap, Layers, MapPin } from "lucide-react";
import IdeasNetwork from "@/components/ui/IdeasNetwork";

const grotesk = "var(--font-space-grotesk, 'Space Grotesk'), sans-serif";
const mono = "var(--font-jetbrains, 'JetBrains Mono'), ui-monospace, monospace";
const ease = [0.22, 1, 0.36, 1] as const;

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

/* masked line reveal for the headline */
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

const headingBase = {
  fontFamily: grotesk,
  letterSpacing: "-0.02em",
  lineHeight: 1.04,
  textTransform: "uppercase" as const,
};

const stats = [
  { icon: MapPin, k: "Based in", v: "India", s: "" },
  { icon: GraduationCap, k: "Education", v: "Computer Science", s: "B.Tech (CSE)" },
  { icon: Layers, k: "Focus areas", v: "Full Stack / AI/ML / System Design", s: "Building • Learning • Improving" },
];

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const leftY = useTransform(p, [0, 1], [70, -50]);
  const netY = useTransform(p, [0, 1], [150, -110]);
  const netScale = useTransform(p, [0.05, 0.4], [0.88, 1]);
  const netRotate = useTransform(p, [0, 1], [-6, 6]);
  const glowY = useTransform(p, [0, 1], [-120, 160]);
  const statsY = useTransform(p, [0.2, 0.6], [60, 0]);

  return (
    <section
      ref={ref}
      id="about"
      aria-label="About me"
      className="relative w-full bg-[#0a0a0b]"
      style={{ minHeight: "100svh" }}
    >
      {/* ambient */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          y: glowY,
          background:
            "radial-gradient(ellipse 50% 60% at 75% 40%, rgba(232,129,74,0.09), transparent 70%)",
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
            "radial-gradient(ellipse 80% 70% at 60% 40%, #000 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 60% 40%, #000 20%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-6 pt-28 pb-10 sm:px-10 lg:px-16">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_1fr]">
          {/* ───────── LEFT ───────── */}
          <motion.div style={{ y: leftY }}>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
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
                  02 / ABOUT ME
                </span>
              </motion.div>

              <motion.div
                variants={rise}
                className="mt-8 flex items-center gap-3 text-[10px] tracking-[0.2em] text-neutral-400 sm:text-[11px]"
                style={{ fontFamily: mono }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#e8814a] shadow-[0_0_10px_#e8814a]" />
                IDEAS → SYSTEMS → IMPACT
              </motion.div>

              <h2 className="mt-5" style={headingBase}>
                <Line>
                  <span
                    className="font-semibold text-white"
                    style={{ fontSize: "clamp(2.1rem, 4.6vw, 4.1rem)" }}
                  >
                    I like
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
                      backgroundClip: "text",
                      color: "transparent",
                      backgroundSize: "220% 100%",
                    }}
                    animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
                    transition={{
                      duration: 4.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                  >
                    Building{" "}
                  </motion.span>
                  <span
                    className="font-bold text-white"
                    style={{ fontSize: "clamp(2.1rem, 4.6vw, 4.1rem)" }}
                  >
                    things
                  </span>
                </Line>
                {["that are slightly", "harder than they", "need to be."].map(
                  (t, i) => (
                    <Line key={t}>
                      <span
                        className="font-light"
                        style={{
                          fontSize: "clamp(1.9rem, 4.1vw, 3.6rem)",
                          color: ["#e4e4e8", "#c4c4ca", "#9d9da4"][i],
                        }}
                      >
                        {t}
                      </span>
                    </Line>
                  ),
                )}
              </h2>

              <motion.p
                variants={rise}
                className="mt-8 max-w-[34rem] text-[15px] leading-[1.75] text-neutral-400 sm:text-base"
                style={{ fontFamily: grotesk }}
              >
                From real-time applications and backend systems to ML experiments
                and automation, I enjoy taking an idea from a rough prototype to
                something that actually works.
              </motion.p>

              <motion.a
                variants={rise}
                href="#projects"
                whileTap={{ scale: 0.96 }}
                className="group mt-10 inline-flex items-center gap-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8814a] rounded-full"
              >
                <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#e8814a]/60 text-[#e8814a] transition-colors duration-250 group-hover:text-black">
                  <span className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-[#e8814a] transition-transform duration-250 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
                  <ArrowRight
                    size={18}
                    className="relative transition-transform duration-250 group-hover:translate-x-0.5"
                  />
                </span>
                <span
                  className="text-xs tracking-[0.22em] text-neutral-200 transition-colors duration-200 group-hover:text-white"
                  style={{ fontFamily: mono }}
                >
                  MORE ABOUT ME
                </span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* ───────── RIGHT ───────── */}
          <div className="relative px-9 sm:px-16 lg:px-0 ">
            <motion.div
              style={{ y: netY, scale: netScale, rotate: netRotate }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease }}
              >
                <IdeasNetwork />
              </motion.div>
            </motion.div>

            <motion.ul
              aria-hidden
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="absolute right-0 top-0 hidden space-y-1 text-[10px] tracking-[0.2em] text-neutral-500 xl:block"
              style={{ fontFamily: mono }}
            >
              {["EXPLORE", "LEARN", "BUILD", "REPEAT"].map((w) => (
                <li key={w}>{w}</li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* ───────── STATS ───────── */}
        <motion.div
          aria-hidden
          className="mt-16 h-px w-full origin-left bg-white/10 lg:mt-20"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -5% 0px" }}
          transition={{ duration: 1.1, ease }}
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -5% 0px" }}
          style={{ y: statsY }}
          className="grid gap-px pt-8 sm:grid-cols-3"
        >
          {stats.map(({ icon: Icon, k, v, s }, i) => (
            <motion.div
              key={k}
              variants={rise}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`group/stat flex items-start gap-4 py-3 sm:px-8 cursor-default ${i === 0 ? "sm:pl-0" : "sm:border-l sm:border-white/10"
                }`}
            >
              <Icon size={22} strokeWidth={1.4} className="mt-1 text-neutral-400 transition-colors duration-200 group-hover/stat:text-[#e8814a]" />
              <div>
                <div
                  className="text-[10px] tracking-[0.2em] text-neutral-500"
                  style={{ fontFamily: mono }}
                >
                  {k.toUpperCase()}
                </div>
                <div
                  className="mt-1.5 text-base tracking-[0.06em] text-white sm:text-lg"
                  style={{ fontFamily: mono }}
                >
                  {v.toUpperCase()}
                </div>
                {s && (
                  <div
                    className="mt-1 text-[11px] tracking-[0.08em] text-neutral-500"
                    style={{ fontFamily: mono }}
                  >
                    {s}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <p
          className="mt-10 text-right text-[10px] tracking-[0.2em] text-neutral-600"
          style={{ fontFamily: mono }}
        >
          /A &nbsp;TURNING IDEAS INTO REALITY
        </p>
      </div>
    </section>
  );
}
