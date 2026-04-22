"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

// Flower SVG paths (simple petal shapes)
const FLOWER_PATHS = [
  // Rose petal
  "M12 3c-4.97 0-9 4.03-9 9 0 4.97 4.03 9 9 9 4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7 0-3.87 3.13-7 7-7 3.87 0 7 3.13 7 7 0 3.87-3.13 7-7 7z",
  // Marigold petal
  "M12 5c-3.31 0-6 2.69-6 6 0 3.31 2.69 6 6 6 3.31 0 6-2.69 6-6 0-3.31-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4 0-2.21 1.79-4 4-4 2.21 0 4 1.79 4 4 0 2.21-1.79 4-4 4z",
  // Simple 5-petal flower
  "M12 4c-4.42 0-8 3.58-8 8 0 4.42 3.58 8 8 8 4.42 0 8-3.58 8-8 0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-3.31 2.69-6 6-6 3.31 0 6 2.69 6 6 0 3.31-2.69 6-6 6z",
];

// Deterministic particle data
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: 20 + ((i * 7) % 25), // 20-45px
  left: `${(i * 23 + 7) % 100}%`,
  top: `${(i * 31 + 11) % 100}%`,
  delay: `-${((i * 0.5) % 4).toFixed(1)}s`,
  duration: `${(8 + ((i * 0.61) % 6)).toFixed(1)}s`, // slower floating
  opacity: (0.15 + ((i * 0.025) % 0.25)).toFixed(2),
  rotate: (i * 30) % 360,
  path: FLOWER_PATHS[i % FLOWER_PATHS.length],
  color: i % 3 === 0 ? "#D4756C" : i % 3 === 1 ? "#9CA986" : "#C9A962", // terracotta, sage, gold
}));

const KEYFRAMES = `@keyframes floral-float {
  0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
  25% { transform: translate(8px, -20px) rotate(5deg) scale(1.1); }
  50% { transform: translate(-10px, 12px) rotate(-3deg) scale(0.95); }
  75% { transform: translate(12px, -8px) rotate(2deg) scale(1.05); }
}`;

export default function FloralParticleBackground() {
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  // Soft spring for cursor tracking
  const springX = useSpring(rawX, { stiffness: 55, damping: 22 });
  const springY = useSpring(rawY, { stiffness: 55, damping: 22 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX / window.innerWidth);
      rawY.set(e.clientY / window.innerHeight);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        rawX.set(e.touches[0].clientX / window.innerWidth);
        rawY.set(e.touches[0].clientY / window.innerHeight);
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouchMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [rawX, rawY]);

  // Primary radial gradient follows cursor (soft floral colors)
  const gx = useTransform(springX, (x) => `${(x * 100).toFixed(1)}%`);
  const gy = useTransform(springY, (y) => `${(y * 100).toFixed(1)}%`);
  const gx2 = useTransform(springX, (x) => `${((1 - x) * 100).toFixed(1)}%`);
  const gy2 = useTransform(springY, (y) => `${((1 - y) * 100).toFixed(1)}%`);

  const background = useMotionTemplate`radial-gradient(ellipse 80% 70% at ${gx} ${gy}, rgba(255,245,245,0.7) 0%, rgba(247,231,206,0.5) 35%, rgba(253,232,176,0.3) 58%, transparent 100%), radial-gradient(ellipse 65% 55% at ${gx2} ${gy2}, rgba(156,169,134,0.4) 0%, rgba(212,117,108,0.2) 40%, transparent 80%), #FBF7F0`;

  // Particle layer moves opposite to cursor for parallax depth
  const px = useTransform(springX, (x) => (0.5 - x) * 40);
  const py = useTransform(springY, (y) => (0.5 - y) * 40);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* Reactive floral gradient background */}
        <motion.div
          className="absolute inset-0"
          style={{ background, willChange: "background" }}
        />

        {/* Floating flower layer — parallax depth */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ x: px, y: py }}
        >
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute"
              style={{
                width: p.size,
                height: p.size,
                left: p.left,
                top: p.top,
                opacity: p.opacity,
                animationName: "floral-float",
                animationDuration: p.duration,
                animationDelay: p.delay,
                animationIterationCount: "infinite",
                animationTimingFunction: "ease-in-out",
                willChange: "transform",
              }}
            >
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={p.path}
                  fill={p.color}
                  fillOpacity="0.6"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
