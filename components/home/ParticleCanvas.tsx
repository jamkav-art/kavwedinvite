'use client'

// AI-ADDED: Full-file — gold dust particle canvas, loaded via dynamic() in Hero.tsx
// Renders a fixed canvas behind all page content. Pure RAF loop, no dependencies.

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  hue: number       // gold range: 35–70
  life: number
  maxLife: number
}

function createParticle(canvasWidth: number, canvasHeight: number): Particle {
  return {
    x: Math.random() * canvasWidth,
    y: canvasHeight + 10,
    vx: (Math.random() - 0.5) * 0.7,
    vy: -(Math.random() * 1.1 + 0.35),
    radius: Math.random() * 2.5 + 0.8,
    opacity: Math.random() * 0.55 + 0.2,
    hue: Math.random() * 35 + 35,
    life: 0,
    maxLife: Math.random() * 220 + 160,
  }
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    const particles: Particle[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Seed with spread-out initial particles so the page doesn't start empty
    for (let i = 0; i < 70; i++) {
      const p = createParticle(canvas.width, canvas.height)
      p.y = Math.random() * canvas.height
      p.life = Math.random() * p.maxLife
      particles.push(p)
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new particles
      if (particles.length < 90 && Math.random() < 0.35) {
        particles.push(createParticle(canvas.width, canvas.height))
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life++

        const lifeFraction = p.life / p.maxLife
        // Sine envelope: fade in, sustain, fade out
        const alpha = p.opacity * Math.sin(lifeFraction * Math.PI)

        // Glowing halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3)
        grad.addColorStop(0, `hsla(${p.hue}, 75%, 65%, ${alpha})`)
        grad.addColorStop(1, `hsla(${p.hue}, 75%, 65%, 0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Bright core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 0.55, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 85%, 80%, ${Math.min(alpha * 1.6, 0.9)})`
        ctx.fill()

        if (p.life >= p.maxLife || p.y < -20) {
          particles.splice(i, 1)
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.38 }}
      aria-hidden="true"
    />
  )
}
