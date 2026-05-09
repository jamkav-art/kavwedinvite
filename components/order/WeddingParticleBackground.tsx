"use client";

import { useEffect, useRef } from "react";

interface GoldSparkle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacitySpeed: number;
  color: string;
}

interface FloatingPetal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

interface GradientOrb {
  id: number;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  width: string;
  height: string;
  color: string;
  opacity: number;
  animation: string;
}

interface WeddingParticleBackgroundProps {
  goldDensity?: number;
  petalDensity?: number;
  orbCount?: number;
}

const GOLD_COLORS = ["#D4AF37", "#F5D876", "#FFF8DC"];
const PETAL_COLORS = ["#C4497C", "#8B1A2B", "#E8789A"];
const ORB_CONFIGS = [
  { color: "#8B1A2B", opacity: 0.15, animation: "animate-orb-drift-slow" },
  { color: "#D4AF37", opacity: 0.1, animation: "animate-orb-drift-slower" },
  { color: "#C4497C", opacity: 0.12, animation: "animate-orb-pulse" },
];

export default function WeddingParticleBackground({
  goldDensity = 50,
  petalDensity = 15,
  orbCount = 3,
}: WeddingParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparklesRef = useRef<GoldSparkle[]>([]);
  const animFrameRef = useRef<number>(0);

  // Generate petals
  const petals: FloatingPetal[] = Array.from(
    { length: petalDensity },
    (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 12 + Math.random() * 16,
      duration: 10 + Math.random() * 8,
      delay: Math.random() * 12,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    }),
  );

  // Generate orbs
  const orbs: GradientOrb[] = Array.from({ length: orbCount }, (_, i) => {
    const cfg = ORB_CONFIGS[i % ORB_CONFIGS.length];
    const positions = [
      { top: "-20%", left: "-15%", width: "75vw", height: "75vw" },
      {
        top: "auto",
        bottom: "-20%",
        right: "-15%",
        width: "65vw",
        height: "65vw",
      },
      { top: "30%", left: "40%", width: "45vw", height: "45vw" },
    ];
    return {
      id: i,
      ...positions[i],
      ...cfg,
    };
  });

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

    // Initialize sparkles
    if (sparklesRef.current.length === 0) {
      sparklesRef.current = Array.from({ length: goldDensity }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1.5 + Math.random() * 2.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -(0.2 + Math.random() * 0.4),
        opacity: 0.2 + Math.random() * 0.6,
        opacitySpeed: 0.005 + Math.random() * 0.015,
        color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
      }));
    }

    let lastTime = 0;

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 16, 3); // normalize to ~60fps
      lastTime = time;

      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sparkles = sparklesRef.current;
      for (let i = 0; i < sparkles.length; i++) {
        const s = sparkles[i];

        // Update position
        s.x += s.speedX * dt;
        s.y += s.speedY * dt;

        // Wrap around
        if (s.y < -10) {
          s.y = canvas.height + 10;
          s.x = Math.random() * canvas.width;
        }
        if (s.x < -10) s.x = canvas.width + 10;
        if (s.x > canvas.width + 10) s.x = -10;

        // Oscillate opacity
        s.opacity += s.opacitySpeed * dt;
        if (s.opacity > 0.8 || s.opacity < 0.15) {
          s.opacitySpeed *= -1;
        }

        // Draw diamond shape
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.globalAlpha = s.opacity;
        ctx.fillStyle = s.color;

        // Diamond path
        ctx.beginPath();
        ctx.moveTo(0, -s.size);
        ctx.lineTo(s.size * 0.6, 0);
        ctx.lineTo(0, s.size);
        ctx.lineTo(-s.size * 0.6, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [goldDensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Canvas — Gold Sparkles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Floating Orbs — Gradient blurred circles */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute rounded-full ${orb.animation}`}
          style={{
            top: orb.top,
            left: orb.left,
            bottom: (orb as any).bottom,
            right: (orb as any).right,
            width: orb.width,
            height: orb.height,
            maxWidth: "700px",
            maxHeight: "700px",
            background: orb.color,
            opacity: orb.opacity,
            filter: "blur(120px)",
          }}
        />
      ))}

      {/* CSS Petals — Floating up with rotation */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute bottom-0"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            opacity: 0,
            animation: `wiz-petal-float ${petal.duration}s ease-in-out ${petal.delay}s infinite`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
              fill={petal.color}
              fillOpacity="0.9"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
