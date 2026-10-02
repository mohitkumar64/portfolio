"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OrganicBubbleIntroProps {
  onComplete?: () => void;
  duration?: number; // duration in ms
  rimColor?: string;
  accentColor?: string;
}

/**
 * OrganicBubbleIntro — Cinema-grade slow organic liquid bubble page-load reveal.
 * Utilizes multi-frequency harmonic cubic bezier spline geometry inspired by motion-organic.
 */
export default function OrganicBubbleIntro({
  onComplete,
  duration = 2000,
  rimColor = "rgba(232, 129, 74, 0.85)",
  accentColor = "#e8814a",
}: OrganicBubbleIntroProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (hasFinishedRef.current) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    let completedFired = false;

    const points = 14;
    const wobble = 0.16;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateDimensions = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Build organic harmonic bubble polygon
    const getBubblePoints = (radius: number, cx: number, cy: number, t: number) => {
      const pts: { x: number; y: number }[] = [];
      const wobbleAmount = wobble * Math.sin(t * Math.PI) * radius;

      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const wave =
          Math.sin(angle * 3 + t * 7) * 0.45 +
          Math.cos(angle * 5 - t * 5) * 0.35 +
          Math.sin(angle * 2 + t * 3.5) * 0.2;

        const r = radius + wave * wobbleAmount;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        pts.push({ x, y });
      }
      return pts;
    };

    // Draw smooth cubic spline through points
    const drawSmoothPath = (pts: { x: number; y: number }[]) => {
      if (pts.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      const n = pts.length;
      for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n];
        const p1 = pts[i];
        const p2 = pts[(i + 1) % n];
        const p3 = pts[(i + 2) % n];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
      ctx.closePath();
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(1, elapsed / duration);

      // Steady, constant linear expansion speed
      const easeProgress = rawProgress;

      setProgress(easeProgress);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Dark background curtain
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, h);

      if (easeProgress > 0) {
        const maxRadius = Math.hypot(w, h) * 1.15;
        const currentRadius = maxRadius * easeProgress;
        const pts = getBubblePoints(currentRadius, cx, cy, easeProgress);

        // Cut out the organic bubble hole (Destination Out)
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        drawSmoothPath(pts);
        ctx.fill();
        ctx.restore();

        // Draw glowing liquid rim along the bubble edge
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        drawSmoothPath(pts);
        ctx.strokeStyle = rimColor;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 24;
        ctx.stroke();

        // Inner specular ring
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      // Trigger hero entrance smoothly right as the bubble clears the screen
      if (rawProgress >= 0.85 && !completedFired) {
        completedFired = true;
        hasFinishedRef.current = true;
        onCompleteRef.current?.();
      }

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setVisible(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [duration, rimColor, accentColor]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] pointer-events-none select-none flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Pure Organic Bubble Reveal Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
