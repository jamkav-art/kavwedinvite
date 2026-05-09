"use client";

import { useEffect, useRef } from "react";

interface BokehParticlesProps {
  count?: number;
  colors?: string[];
  speed?: number;
}

interface BokehCircle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: string;
  floatSpeed: number;
  floatAmplitude: number;
  floatPhase: number;
  driftSpeed: number;
}

const DEFAULT_COLORS = [
  "#F0D4B0", // warm amber
  "#E8A87C", // peach
  "#C05A3A", // terracotta
  "#FDF5ED", // warm white
  "#FFE0B2", // light orange
];

export default function BokehParticles({
  count = 25,
  colors = DEFAULT_COLORS,
  speed = 1,
}: BokehParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circlesRef = useRef<BokehCircle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize bokeh circles
    circlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * (canvas.width + 200) - 100,
      y: Math.random() * (canvas.height + 200) - 100,
      radius: 20 + Math.random() * 80,
      opacity: 0.03 + Math.random() * 0.12,
      color: colors[Math.floor(Math.random() * colors.length)],
      floatSpeed: 0.1 + Math.random() * 0.3,
      floatAmplitude: 10 + Math.random() * 30,
      floatPhase: Math.random() * Math.PI * 2,
      driftSpeed: 0.05 + Math.random() * 0.15,
    }));

    const animate = (time: number) => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circlesRef.current.forEach((c) => {
        const t = time * 0.001 * speed;

        // Gentle floating motion
        const floatY =
          Math.sin(t * c.floatSpeed + c.floatPhase) * c.floatAmplitude;
        const floatX =
          Math.cos(t * c.driftSpeed + c.floatPhase * 0.7) *
          c.floatAmplitude *
          0.5;

        const cx = c.x + floatX;
        const cy = c.y + floatY;

        // Draw bokeh circle with soft edges
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.radius);
        gradient.addColorStop(
          0,
          c.color +
            Math.round(c.opacity * 255)
              .toString(16)
              .padStart(2, "0"),
        );
        gradient.addColorStop(
          0.4,
          c.color +
            Math.round(c.opacity * 0.6 * 255)
              .toString(16)
              .padStart(2, "0"),
        );
        gradient.addColorStop(
          0.7,
          c.color +
            Math.round(c.opacity * 0.2 * 255)
              .toString(16)
              .padStart(2, "0"),
        );
        gradient.addColorStop(1, c.color + "00");

        ctx.beginPath();
        ctx.arc(cx, cy, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [count, colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
