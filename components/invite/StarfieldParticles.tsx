"use client";

import { useEffect, useRef } from "react";

interface StarfieldParticlesProps {
  density?: "low" | "medium" | "high";
  speed?: number;
  shootingStarInterval?: number; // ms between shooting stars
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  progress: number;
}

export default function StarfieldParticles({
  density = "medium",
  speed = 1,
  shootingStarInterval = 8000,
}: StarfieldParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarRef = useRef<ShootingStar | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastShootingStarRef = useRef<number>(0);

  const starCount = density === "low" ? 60 : density === "medium" ? 120 : 200;

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

    // Initialize stars
    starsRef.current = Array.from({ length: starCount }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 0.5 + Math.random() * 2.5,
      opacity: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.5 + Math.random() * 2,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    const animate = (time: number) => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(
          time * 0.001 * star.twinkleSpeed + star.twinklePhase,
        );
        const alpha = star.opacity * (0.5 + twinkle * 0.5);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Add glow to bigger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 180, 255, ${alpha * 0.15})`;
          ctx.fill();
        }
      });

      // Shooting star logic
      if (!shootingStarRef.current) {
        const elapsed = time - lastShootingStarRef.current;
        if (elapsed > shootingStarInterval) {
          shootingStarRef.current = {
            x: Math.random() * canvas.width * 0.8,
            y: Math.random() * canvas.height * 0.3,
            length: 80 + Math.random() * 120,
            speed: 8 + Math.random() * 6,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            opacity: 0.6 + Math.random() * 0.4,
            active: true,
            progress: 0,
          };
          lastShootingStarRef.current = time;
        }
      }

      if (shootingStarRef.current) {
        const ss = shootingStarRef.current;
        ss.progress += ss.speed * 0.016 * speed;

        const dx = Math.cos(ss.angle) * ss.progress;
        const dy = Math.sin(ss.angle) * ss.progress;
        const trailEnd = ss.progress - ss.length;

        if (trailEnd > 0) {
          // Draw trail
          const gradient = ctx.createLinearGradient(
            ss.x + dx,
            ss.y + dy,
            ss.x + dx - Math.cos(ss.angle) * ss.length,
            ss.y + dy - Math.sin(ss.angle) * ss.length,
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
          gradient.addColorStop(
            0.3,
            `rgba(200, 180, 255, ${ss.opacity * 0.5})`,
          );
          gradient.addColorStop(1, "rgba(200, 180, 255, 0)");

          ctx.beginPath();
          ctx.moveTo(ss.x + dx, ss.y + dy);
          ctx.lineTo(
            ss.x + dx - Math.cos(ss.angle) * ss.length,
            ss.y + dy - Math.sin(ss.angle) * ss.length,
          );
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Head glow
          ctx.beginPath();
          ctx.arc(ss.x + dx, ss.y + dy, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
          ctx.fill();
        }

        // Reset when off screen
        if (ss.y + dy > canvas.height || ss.x + dx > canvas.width) {
          shootingStarRef.current = null;
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [starCount, speed, shootingStarInterval]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
