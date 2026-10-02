"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, User, FolderKanban, Send } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "#home" },
  { label: "About Me", icon: User, href: "#about" },
  { label: "Projects", icon: FolderKanban, href: "#projects" },
  { label: "Connect", icon: Send, href: "#connect", accent: true },
];

const ease = [0.22, 1, 0.36, 1] as const;
const LABEL_WIDTH = 72;

/* Scroll-spy: index of the section currently in view */
function useActiveSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ids = navItems.map((n) => n.href.slice(1));
    const onScroll = () => {
      const mid = window.innerHeight * 0.4;
      let current = 0;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) current = i;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return [active, setActive] as const;
}

/* ═══════════════════════════════════════════════════════════════
   TOP NAV — desktop (md+)
   Transparent at top, morphs into a floating glass pill on scroll.
   Sliding highlight and scroll-spy.
═══════════════════════════════════════════════════════════════ */
function TopNav() {
  const [active, setActive] = useActiveSection();
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shown = hovered ?? active;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease, delay: 0.2 }}
      className="hidden md:flex fixed top-0 inset-x-0 z-50 justify-center pointer-events-none"
      style={{
        paddingTop: scrolled ? 14 : 18,
        transition: "padding .5s cubic-bezier(.22,1,.36,1)",
      }}
      role="banner"
    >
      <div
        className="pointer-events-auto flex items-center justify-between"
        style={{
          width: scrolled ? "min(880px, 92vw)" : "100%",
          paddingInline: scrolled ? 14 : "clamp(24px, 4vw, 64px)",
          height: scrolled ? 56 : 52,
          borderRadius: 9999,
          background: scrolled ? "rgba(14,14,16,0.62)" : "rgba(14,14,16,0)",
          backdropFilter: scrolled ? "blur(22px) saturate(1.5)" : "blur(0px)",
          WebkitBackdropFilter: scrolled
            ? "blur(22px) saturate(1.5)"
            : "blur(0px)",
          border: scrolled
            ? "1px solid rgba(255,255,255,0.09)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 10px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "none",
          transition: "all .6s cubic-bezier(.22,1,.36,1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <motion.a
          href="#home"
          aria-label="Home"
          className="relative flex items-center justify-center shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8814a]"
          style={{ width: 38, height: 38 }}
          whileHover="hover"
          whileTap={{ scale: 0.92 }}
          initial="rest"
        >
          <motion.span
            variants={{
              rest: { scale: 1, opacity: 0.6, rotate: 0 },
              hover: { scale: 1.12, opacity: 1, rotate: 90 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1.5px dashed #e8814a",
            }}
          />
          <motion.span
            variants={{ rest: { scale: 1 }, hover: { scale: 1.35 } }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#e8814a",
              boxShadow: "0 0 14px rgba(232,129,74,0.7)",
            }}
          />
        </motion.a>

        {/* Links */}
        <nav aria-label="Main" onMouseLeave={() => setHovered(null)}>
          <ul className="flex items-center" style={{ gap: 2 }}>
            {navItems.map((item, idx) => {
              const isActive = active === idx;
              return (
                <li key={item.label} className="relative">
                  {shown === idx && (
                    <motion.span
                      layoutId="nav-highlight"
                      aria-hidden
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: item.accent
                          ? "rgba(232,129,74,0.16)"
                          : "rgba(255,255,255,0.08)",
                      }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <a
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActive(idx)}
                    onMouseEnter={() => setHovered(idx)}
                    onFocus={() => setHovered(idx)}
                    onBlur={() => setHovered(null)}
                    className="relative flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8814a]"
                    style={{
                      padding: "9px 18px",
                      fontSize: "clamp(0.8rem, 1.05vw, 0.92rem)",
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: "0.03em",
                      color: item.accent
                        ? "#f2955f"
                        : isActive || shown === idx
                        ? "#fff"
                        : "#9a9aa2",
                      transition: "color .25s",
                      textDecoration: "none",
                    }}
                  >
                    {item.label}
                    {item.accent && (
                      <span
                        className="relative flex"
                        style={{ width: 6, height: 6 }}
                      >
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
                  </a>
                  {isActive && !item.accent && (
                    <motion.span
                      layoutId="nav-dot"
                      aria-hidden
                      className="absolute left-1/2 rounded-full"
                      style={{
                        width: 4,
                        height: 4,
                        bottom: 2,
                        x: "-50%",
                        background: "#e8814a",
                        boxShadow: "0 0 8px #e8814a",
                      }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>


      </div>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOTTOM PILL NAV — mobile (< md)
═══════════════════════════════════════════════════════════════ */
function BottomPillNav() {
  const [active, setActive] = useActiveSection();

  return (
    <motion.nav
      aria-label="Bottom Navigation"
      className="fixed bottom-4 inset-x-0 mx-auto z-50 flex md:hidden w-fit"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.5 }}
    >
      <div
        className="flex items-center"
        style={{
          gap: 4,
          padding: "6px 8px",
          borderRadius: 9999,
          background: "rgba(14,14,14,0.8)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {navItems.map((item, idx) => {
          const Icon = item.icon;
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
                  ? item.accent
                    ? "#e8814a"
                    : "#f0f0f0"
                  : "#777",
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
                transition: "all .3s cubic-bezier(.22,1,.36,1)",
              }}
              onClick={() => setActive(idx)}
              whileTap={{ scale: 0.93 }}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.7}
                aria-hidden
                className="shrink-0"
              />

              <motion.span
                aria-hidden
                initial={false}
                animate={{
                  width: isActive ? LABEL_WIDTH : 0,
                  opacity: isActive ? 1 : 0,
                  marginLeft: isActive ? 6 : 0,
                }}
                transition={{
                  width: { type: "spring", stiffness: 340, damping: 32 },
                  opacity: { duration: 0.14 },
                  marginLeft: { duration: 0.14 },
                }}
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  display: "inline-block",
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
