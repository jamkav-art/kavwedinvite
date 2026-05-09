"use client";

import { useEffect, useRef } from "react";

interface FloatingPetalsProps {
  count?: number;
  colors?: string[];
  speed?: number;
  petalSize?: number;
}

interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  swingAmplitude: number;
  swingSpeed: number;
  opacity: number;
  color: string;
  delay: number;
}

const DEFAULT_COLORS = [
  "#C45C8A", // rose pink
  "#7BAE7F", // meadow green
  "#F9D56E", // sunflower yellow
  "#E8A87C", // peach
  "#F5E0E9", // blush
];

export default function FloatingPetals({
  count = 30,
  colors = DEFAULT_COLORS,
  speed = 1,
  petalSize = 16,
}: FloatingPetalsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    // Initialize petals
    petalsRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 - 10, // start slightly above viewport
      size: petalSize * (0.5 + Math.random() * 0.8),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 3,
      fallSpeed: (0.3 + Math.random() * 0.7) * speed,
      swingAmplitude: 20 + Math.random() * 40,
      swingSpeed: 0.5 + Math.random() * 1.5,
      opacity: 0.2 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5,
    }));

    const container = containerRef.current;
    if (!container) return;

    const styleId = "petal-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes petal-sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(15px) rotate(3deg); }
          50% { transform: translateX(-10px) rotate(-2deg); }
          75% { transform: translateX(20px) rotate(4deg); }
        }
      `;
      document.head.appendChild(style);
    }

    // Use DOM-based approach for performance with fewer petals
    const renderPetals = () => {
      const now = Date.now() / 1000;

      petalsRef.current.forEach((petal) => {
        const elapsed = (now + petal.delay) * petal.fallSpeed;
        const yPos = ((elapsed * 1.5) % 120) - 10;
        const swing =
          Math.sin(elapsed * petal.swingSpeed) * petal.swingAmplitude;
        const rotation = petal.rotation + elapsed * petal.rotationSpeed * 30;

        const el = container?.querySelector(`[data-petal-id="${petal.id}"]`);
        if (el instanceof HTMLElement) {
          el.style.transform = `translateX(${swing}px) translateY(${yPos}vh) rotate(${rotation}deg)`;
        }
      });

      animFrameRef.current = requestAnimationFrame(renderPetals);
    };

    animFrameRef.current = requestAnimationFrame(renderPetals);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [count, colors, speed, petalSize]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {petalsRef.current.length === 0 &&
        // Initial render placeholder petals (will be animated by JS)
        Array.from({ length: count }, (_, i) => {
          const idx = i;
          const petal = {
            id: idx,
            color: colors[idx % colors.length],
            size: petalSize * (0.5 + ((idx * 0.37) % 0.8)),
          };
          return (
            <div
              key={petal.id}
              data-petal-id={petal.id}
              className="absolute"
              style={{
                left: `${(idx * 3.7 + 5) % 100}%`,
                top: `${(idx * 7.1 + 2) % 100}%`,
                width: petal.size,
                height: petal.size * 1.2,
                opacity: 0.3 + ((idx * 0.05) % 0.4),
                animation: `petal-sway ${3 + ((idx * 0.5) % 3)}s ease-in-out infinite`,
                animationDelay: `${(idx * 0.3) % 4}s`,
                willChange: "transform",
              }}
            >
              <svg
                viewBox="0 0 24 30"
                width={petal.size}
                height={petal.size * 1.2}
                fill="none"
              >
                <ellipse
                  cx="12"
                  cy="15"
                  rx="8"
                  ry="12"
                  fill={petal.color}
                  fillOpacity="0.7"
                />
                <ellipse
                  cx="12"
                  cy="15"
                  rx="4"
                  ry="10"
                  fill={petal.color}
                  fillOpacity="0.9"
                />
              </svg>
            </div>
          );
        })}
    </div>
  );
}
