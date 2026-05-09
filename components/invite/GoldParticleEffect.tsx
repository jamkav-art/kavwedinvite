"use client";

import { useEffect, useRef } from "react";

interface GoldParticleEffectProps {
  density?: "low" | "medium" | "high";
  speed?: number;
  color?: string;
}

interface GoldParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  sparkleSpeed: number;
  sparklePhase: number;
  driftX: number;
  driftY: number;
  rotation: number;
  rotationSpeed: number;
}

export default function GoldParticleEffect({
  density = "medium",
  speed = 1,
  color = "#C9A962",
}: GoldParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<GoldParticle[]>([]);
  const animFrameRef = useRef<number>(0);

  const count = density === "low" ? 20 : density === "medium" ? 40 : 70;

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

    // Initialize gold particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1 + Math.random() * 3,
      opacity: 0.2 + Math.random() * 0.6,
      sparkleSpeed: 0.5 + Math.random() * 1.5,
      sparklePhase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.5,
      driftY: -(0.1 + Math.random() * 0.3), // float upward
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
    }));

    const animate = (time: number) => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        const t = time * 0.001 * speed;

        // Sparkle opacity
        const sparkle = Math.sin(t * p.sparkleSpeed + p.sparklePhase);
        const alpha = p.opacity * (0.4 + sparkle * 0.6);

        // Movement - float upward and drift sideways
        p.x += p.driftX;
        p.y += p.driftY;

        // Rotate
        p.rotation += p.rotationSpeed;

        // Wrap around
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        // Draw diamond/gold fleck shape
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        // Draw a 4-pointed star (diamond) shape
        const s = p.size;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const nextAngle = ((i + 1) * Math.PI) / 2;
          const midAngle = (angle + nextAngle) / 2;

          ctx.lineTo(Math.cos(angle) * s, Math.sin(angle) * s);
          ctx.quadraticCurveTo(
            Math.cos(midAngle) * s * 3,
            Math.sin(midAngle) * s * 3,
            Math.cos(nextAngle) * s,
            Math.sin(nextAngle) * s,
          );
        }
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();

        // Add glow
        if (sparkle > 0.4) {
          ctx.beginPath();
          ctx.arc(0, 0, s * 4, 0, Math.PI * 2);
          ctx.fillStyle = `${color}22`;
          ctx.fill();
        }

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [count, speed, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
