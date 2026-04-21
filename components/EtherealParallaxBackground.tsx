'use client'

import { useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'

// Deterministic values — no Math.random() to prevent SSR/client hydration mismatch
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  size: 5 + ((i * 7) % 13),
  left: `${(i * 17 + 13) % 100}%`,
  top: `${(i * 31 + 7) % 100}%`,
  delay: `-${((i * 0.7) % 3).toFixed(1)}s`,
  duration: `${(3.8 + (i * 0.41) % 3.5).toFixed(1)}s`,
  opacity: (0.2 + (i * 0.035) % 0.3).toFixed(2),
  glow: 5 + ((i * 7) % 13) * 2.5,
}))

const KEYFRAMES = `@keyframes orb-float {
  0%,100%{transform:translate(0,0) scale(1)}
  25%{transform:translate(6px,-15px) scale(1.13)}
  50%{transform:translate(-5px,8px) scale(0.91)}
  75%{transform:translate(9px,-5px) scale(1.07)}
}`

export default function EtherealParallaxBackground() {
  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)

  // Soft spring — cursor influence is felt but never jerky
  const springX = useSpring(rawX, { stiffness: 55, damping: 22 })
  const springY = useSpring(rawY, { stiffness: 55, damping: 22 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX / window.innerWidth)
      rawY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  // Primary radial follows cursor; secondary sits at the inverse position
  const gx  = useTransform(springX, (x) => `${(x * 100).toFixed(1)}%`)
  const gy  = useTransform(springY, (y) => `${(y * 100).toFixed(1)}%`)
  const gx2 = useTransform(springX, (x) => `${((1 - x) * 100).toFixed(1)}%`)
  const gy2 = useTransform(springY, (y) => `${((1 - y) * 100).toFixed(1)}%`)

  // Single MotionValue<string> — updates without React re-renders (direct DOM write)
  const background = useMotionTemplate`radial-gradient(ellipse 80% 70% at ${gx} ${gy},#FFF5F5 0%,#F7E7CE 35%,#FDE8B0 58%,rgba(201,169,98,.35) 80%,transparent 100%),radial-gradient(ellipse 65% 55% at ${gx2} ${gy2},rgba(247,231,206,.9) 0%,rgba(253,232,176,.55) 40%,transparent 80%),#FEF8F0`

  // Particle layer moves OPPOSITE to cursor — creates illusion of 3D depth
  const px = useTransform(springX, (x) => (0.5 - x) * 50)
  const py = useTransform(springY, (y) => (0.5 - y) * 50)

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* Reactive mesh gradient — GPU composited, bypasses React renders */}
        <motion.div
          className="absolute inset-0"
          style={{ background, willChange: 'background' }}
        />

        {/* Gold-dust orb layer — shifts inversely for parallax depth */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ x: px, y: py }}
        >
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                left: p.left,
                top: p.top,
                background: `radial-gradient(circle,rgba(201,169,98,${p.opacity}) 0%,rgba(247,231,206,.1) 65%,transparent 100%)`,
                boxShadow: `0 0 ${p.glow}px rgba(201,169,98,${(Number(p.opacity) * 0.5).toFixed(2)})`,
                animationName: 'orb-float',
                animationDuration: p.duration,
                animationDelay: p.delay,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
                willChange: 'transform',
              }}
            />
          ))}
        </motion.div>
      </div>
    </>
  )
}
