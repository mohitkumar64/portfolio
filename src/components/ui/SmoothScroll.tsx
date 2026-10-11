"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Short wheel inertia with a deliberate journey for section navigation. */
export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let lenis: Lenis | undefined;
    let raf = 0;
    const dispose = () => {
      cancelAnimationFrame(raf);
      if (window.__lenis === lenis) delete window.__lenis;
      lenis?.destroy();
      lenis = undefined;
    };
    const configure = () => {
      dispose();
      if (reducedMotion.matches) return;
      const instance = new Lenis({
        duration: 0.85,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: !coarsePointer.matches,
        syncTouch: false,
        // Handle section links below so the native jump cannot race the animation.
        anchors: false,
      });
      lenis = instance;
      window.__lenis = instance;
      const loop = (time: number) => {
        instance.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const onClick = (event: MouseEvent) => {
      if (
        !lenis || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      ) return;
      const link = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a[href^='#']")
        : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, {
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          if (window.location.hash !== hash) window.history.pushState(null, "", hash);
          const hadTabIndex = target.hasAttribute("tabindex");
          if (!hadTabIndex) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          if (!hadTabIndex) target.removeAttribute("tabindex");
        },
      });
    };
    configure();
    document.addEventListener("click", onClick);
    reducedMotion.addEventListener("change", configure);
    coarsePointer.addEventListener("change", configure);
    return () => {
      document.removeEventListener("click", onClick);
      reducedMotion.removeEventListener("change", configure);
      coarsePointer.removeEventListener("change", configure);
      dispose();
    };
  }, []);

  return null;
}
