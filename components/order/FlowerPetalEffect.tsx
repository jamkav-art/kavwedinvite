"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface FlowerPetal {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  color: string;
  duration: number;
  delay: number;
  path: string;
}

const PETAL_PATHS = [
  // Rose petal
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
  // Marigold petal
  "M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z",
  // Simple petal
  "M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z",
];

const COLORS = [
  "#D4756C",
  "#9CA986",
  "#C9A962",
  "#E8638C",
  "#C0185F",
  "#F7E7CE",
];

interface FlowerPetalEffectProps {
  trigger?: boolean;
  petalCount?: number;
  origin?: { x: number; y: number }; // relative to viewport (0-1)
}

export default function FlowerPetalEffect({
  trigger = true,
  petalCount = 40,
  origin = { x: 0.5, y: 0.5 },
}: FlowerPetalEffectProps) {
  const [petals, setPetals] = useState<FlowerPetal[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const newPetals: FlowerPetal[] = Array.from(
      { length: petalCount },
      (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 0.3 + Math.random() * 0.7;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;

        return {
          id: i + Date.now(),
          x: endX,
          y: endY,
          rotate: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          duration: 1.5 + Math.random() * 1.5,
          delay: Math.random() * 0.5,
          path: PETAL_PATHS[Math.floor(Math.random() * PETAL_PATHS.length)],
        };
      },
    );

    const animationTimeout = setTimeout(() => {
      setPetals(newPetals);
    }, 0);

    // Remove petals after animation completes
    const removalTimeout = setTimeout(() => {
      setPetals([]);
    }, 5000);

    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(removalTimeout);
    };
  }, [trigger, petalCount]);

  if (petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${origin.x * 100}%`,
            top: `${origin.y * 100}%`,
            width: 24,
            height: 24,
            x: p.x * window.innerWidth,
            y: p.y * window.innerHeight,
            rotate: p.rotate,
            scale: p.scale,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: p.x * window.innerWidth,
            y: p.y * window.innerHeight,
            opacity: [1, 1, 0],
            scale: [0, p.scale, p.scale * 0.5],
            rotate: p.rotate + 360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={p.path} fill={p.color} fillOpacity="0.7" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
