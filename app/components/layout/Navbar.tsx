"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, FolderKanban, Send } from "lucide-react";

const navItems = [
  { label: "Home",     icon: Home,         href: "#home"    },
  { label: "About Me", icon: User,         href: "#about"   },
  { label: "Projects", icon: FolderKanban, href: "#projects"},
  { label: "Connect",  icon: Send,         href: "#connect", accent: true },
];

const ease = [0.22, 1, 0.36, 1] as const;
const LABEL_WIDTH = 72;

/* ═══════════════════════════════════════════════════════════════
   TOP NAV — desktop (md+)
   Matches reference: logo left, plain spaced text links right,
   thin underline on active, transparent background.
═══════════════════════════════════════════════════════════════ */
function TopNav() {
  const [active, setActive] = useState(0);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease }}
      className="hidden md:flex fixed top-0 inset-x-0 z-50 items-center justify-between"
      style={{
        height: 60,
        paddingInline: "clamp(24px, 4vw, 64px)",
      }}
      role="banner"
    >
      {/* ── Logo ── */}
      <motion.a
        href="#home"
        aria-label="Home"
        className="relative flex items-center justify-center shrink-0 focus:outline-none"
        style={{ width: 38, height: 38 }}
        onClick={() => setActive(0)}
        whileHover="hover"
        initial="rest"
      >
        <motion.span
          variants={{
            rest:  { scale: 1,    opacity: 0.55 },
            hover: { scale: 1.15, opacity: 1    },
          }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1.5px solid #e8814a",
          }}
        />
        <motion.span
          variants={{
            rest:  { scale: 1   },
            hover: { scale: 1.3 },
          }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#e8814a",
            boxShadow: "0 0 12px rgba(232,129,74,0.6)",
          }}
        />
      </motion.a>

      {/* ── Nav links ── */}
      <nav role="navigation" aria-label="Main">
        <ul
          className="flex items-center"
          style={{ gap: "clamp(20px, 3.5vw, 48px)" }}
          role="list"
        >
          {navItems.map((item, idx) => {
            const isActive = active === idx;

            return (
              <li key={item.label} role="listitem">
                <motion.a
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex items-center gap-2 focus:outline-none"
                  style={{
                    fontSize: "clamp(0.78rem, 1.1vw, 0.9rem)",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.04em",
                    color: item.accent
                      ? "#e8814a"
                      : isActive
                      ? "#f5f5f5"
                      : "#aaa",
                    textDecoration: "none",
                    paddingBottom: 2,
                  }}
                  onClick={() => setActive(idx)}
                  whileHover={{ color: item.accent ? "#e8814a" : "#f5f5f5" }}
                  whileTap={{ scale: 0.96 }}
                >
                  {item.label}

                  {/* Thin underline on active */}
                  <AnimatePresence>
                    {isActive && !item.accent && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 inset-x-0"
                        style={{
                          height: 1,
                          background: "rgba(245,245,245,0.55)",
                          bottom: -2,
                        }}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Pulsing dot for Connect */}
                  {item.accent && (
                    <span className="flex" style={{ width: 6, height: 6 }}>
                      <span
                        className="absolute inline-flex h-full w-full rounded-full animate-ping"
                        style={{ background: "#e8814a", opacity: 0.5 }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-full w-full"
                        style={{ background: "#e8814a" }}
                      />
                    </span>
                  )}
                </motion.a>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOTTOM PILL NAV — mobile (< md)
═══════════════════════════════════════════════════════════════ */
function BottomPillNav() {
  const [active, setActive] = useState(0);

  return (
    <motion.nav
      aria-label="Bottom Navigation"
      role="navigation"
      className="fixed bottom-4 inset-x-0 mx-auto z-50 flex md:hidden w-fit"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.5 }}
    >
      <div
        className="flex items-center"
        style={{
          gap: 4,
          padding: "6px 8px",
          borderRadius: 9999,
          background: "rgba(14,14,14,0.94)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(232,129,74,0.06)",
        }}
      >
        {navItems.map((item, idx) => {
          const Icon     = item.icon;
          const isActive = active === idx;

          return (
            <motion.a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="relative flex items-center rounded-full cursor-pointer focus:outline-none"
              style={{
                height: 40,
                padding: isActive ? "0 14px" : "0 11px",
                overflow: "hidden",
                color: isActive
                  ? item.accent ? "#e8814a" : "#f0f0f0"
                  : "#666",
                background: isActive
                  ? item.accent
                    ? "rgba(232,129,74,0.14)"
                    : "rgba(255,255,255,0.08)"
                  : "transparent",
                border: isActive
                  ? item.accent
                    ? "1px solid rgba(232,129,74,0.2)"
                    : "1px solid rgba(255,255,255,0.07)"
                  : "1px solid transparent",
                minWidth: 40,
              }}
              onClick={() => setActive(idx)}
              whileTap={{ scale: 0.93 }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.7} aria-hidden className="shrink-0" />

              <motion.span
                aria-hidden
                initial={false}
                animate={{
                  width:      isActive ? LABEL_WIDTH : 0,
                  opacity:    isActive ? 1 : 0,
                  marginLeft: isActive ? 6 : 0,
                }}
                transition={{
                  width:      { type: "spring", stiffness: 340, damping: 32 },
                  opacity:    { duration: 0.14 },
                  marginLeft: { duration: 0.14 },
                }}
                style={{
                  overflow:    "hidden",
                  whiteSpace:  "nowrap",
                  fontSize:    11,
                  fontWeight:  600,
                  letterSpacing: "0.04em",
                  display:     "inline-block",
                }}
              >
                {item.label}
              </motion.span>
            </motion.a>
          );
        })}
      </div>
    </motion.nav>
  );
}

export default function Navbar() {
  return (
    <>
      <TopNav />
      <BottomPillNav />
    </>
  );
}
