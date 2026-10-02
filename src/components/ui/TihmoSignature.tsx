"use client";

import { useEffect } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";

interface TihmoSignatureProps {
  className?: string;
  /** seconds before the signing animation starts */
  delay?: number;
}

const easeOut = [0.65, 0, 0.35, 1] as const;

/**
 * Signature that "writes itself": a soft-edged mask sweeps left → right
 * (like a pen moving), a glowing nib follows the edge, then the flourish
 * underline draws itself stroke by stroke.
 */
export default function TihmoSignature({
  className = "",
  delay = 1.2,
}: TihmoSignatureProps) {
  const writeDuration = 1.9;
  const reveal = useMotionValue(0);
  const mask = useTransform(
    reveal,
    (v) =>
      `linear-gradient(90deg, #000 ${v * 112 - 12}%, transparent ${v * 112}%)`,
  );

  useEffect(() => {
    const c = animate(reveal, 1, {
      duration: writeDuration,
      ease: easeOut,
      delay,
    });
    return () => c.stop();
  }, [reveal, delay]);

  return (
    <div
      className={`relative inline-flex flex-col items-start select-none ${className}`}
      aria-label="Tihmo"
    >
      {/* Text revealed by a feathered mask */}
      <div className="relative">
        <motion.span
          className="block"
          style={{
            fontFamily:
              "var(--font-playfair, 'Playfair Display'), Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(2.6rem, 7.2vw, 7rem)",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "0.01em",
            paddingRight: "0.12em",
            color: "#f5f5f5",
            textShadow:
              "0 4px 30px rgba(0,0,0,0.6), 0 0 50px rgba(232,129,74,0.14)",
            WebkitMaskImage: mask,
            maskImage: mask,
          }}
        >
          Tihmo
        </motion.span>

        {/* Glowing pen nib riding the reveal edge */}
        <motion.span
          aria-hidden
          className="absolute top-1/2 rounded-full pointer-events-none"
          style={{
            width: 10,
            height: 10,
            marginTop: -5,
            background: "#e8814a",
            boxShadow:
              "0 0 14px 4px rgba(232,129,74,0.7), 0 0 40px 10px rgba(232,129,74,0.25)",
          }}
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: "96%", opacity: [0, 1, 1, 0] }}
          transition={{
            left: { duration: writeDuration, ease: easeOut, delay },
            opacity: {
              duration: writeDuration + 0.3,
              times: [0, 0.08, 0.9, 1],
              delay,
            },
          }}
        />
      </div>

      {/* Hand-drawn flourish underline */}
      <svg
        viewBox="0 0 320 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", marginTop: -2, overflow: "visible" }}
        aria-hidden="true"
      >
        <motion.path
          d="M6 22 C50 6, 120 30, 190 16 C236 7, 280 20, 314 10"
          stroke="#e8814a"
          strokeWidth="2.6"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.9, ease: "easeInOut", delay: delay + writeDuration - 0.1 },
            opacity: { duration: 0.1, delay: delay + writeDuration - 0.1 },
          }}
        />
        <motion.path
          d="M60 30 C120 24, 190 33, 270 27"
          stroke="rgba(232,129,74,0.35)"
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.7, ease: "easeInOut", delay: delay + writeDuration + 0.5 },
            opacity: { duration: 0.1, delay: delay + writeDuration + 0.5 },
          }}
        />
      </svg>
    </div>
  );
}
