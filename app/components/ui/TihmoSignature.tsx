"use client";

import { motion } from "framer-motion";

interface TihmoSignatureProps {
  className?: string;
}

export default function TihmoSignature({ className = "" }: TihmoSignatureProps) {
  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      {/* Signature text */}
      <span
        style={{
          fontFamily: "var(--font-dancing-script, 'Dancing Script'), cursive",
          fontSize: "clamp(3.2rem, 6.2vw, 5.2rem)",
          fontWeight: 700,
          color: "#f5f5f5",
          lineHeight: 1,
          letterSpacing: "0.02em",
          textShadow:
            "0 2px 24px rgba(0,0,0,0.6), 0 0 40px rgba(232,129,74,0.08)",
        }}
      >
        Tihmo
      </span>

      {/* Hand-drawn underline */}
      <svg
        viewBox="0 0 140 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", marginTop: 4 }}
        aria-hidden="true"
      >
        {/* primary stroke */}
        <path
          d="M2 9 C18 4, 52 14, 88 8 C110 4, 128 10, 138 8"
          stroke="rgba(232,129,74,0.72)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* shadow stroke */}
        <path
          d="M10 12 C40 10, 80 14, 130 12"
          stroke="rgba(232,129,74,0.22)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
