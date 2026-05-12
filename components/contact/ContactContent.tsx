"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/utils";
import { WHATSAPP_OWNER } from "@/lib/constants";

// ── Romantic predefined WhatsApp message ──────────────────────
const WHATSAPP_MESSAGE =
  "Hello WedInviter! 💌 We're dreaming of our perfect wedding and would love your magic to create our digital invitation. Could you help us bring our love story to life? ✨🌸";

// ── Orb data (deterministic — no Math.random) ─────────────────
const ORBS = [
  {
    size: 320,
    left: "5%",
    top: "-8%",
    color: "rgba(232,99,140,0.12)",
    dur: 14,
    delay: 0,
  },
  {
    size: 260,
    left: "78%",
    top: "5%",
    color: "rgba(201,169,98,0.1)",
    dur: 18,
    delay: 2,
  },
  {
    size: 400,
    left: "45%",
    top: "15%",
    color: "rgba(168,85,247,0.08)",
    dur: 16,
    delay: 1,
  },
  {
    size: 200,
    left: "12%",
    top: "60%",
    color: "rgba(232,99,140,0.1)",
    dur: 12,
    delay: 3,
  },
  {
    size: 350,
    left: "82%",
    top: "55%",
    color: "rgba(247,231,206,0.15)",
    dur: 20,
    delay: 0.5,
  },
  {
    size: 180,
    left: "55%",
    top: "75%",
    color: "rgba(192,24,95,0.08)",
    dur: 15,
    delay: 4,
  },
  {
    size: 280,
    left: "30%",
    top: "-2%",
    color: "rgba(201,169,98,0.09)",
    dur: 13,
    delay: 1.5,
  },
  {
    size: 220,
    left: "92%",
    top: "80%",
    color: "rgba(168,85,247,0.07)",
    dur: 17,
    delay: 2.5,
  },
];

// ── Floating decorative particles ─────────────────────────────
const FLOATING_EMOJIS = [
  { emoji: "❤️", left: "8%", top: "20%", size: "1.4rem", dur: 5, delay: 0 },
  { emoji: "✨", left: "85%", top: "30%", size: "1.2rem", dur: 4.5, delay: 1 },
  { emoji: "💫", left: "20%", top: "70%", size: "1.5rem", dur: 6, delay: 0.5 },
  { emoji: "🌸", left: "92%", top: "15%", size: "1.3rem", dur: 5.5, delay: 2 },
  {
    emoji: "💕",
    left: "15%",
    top: "40%",
    size: "1.1rem",
    dur: 4.8,
    delay: 1.5,
  },
  {
    emoji: "🌺",
    left: "72%",
    top: "65%",
    size: "1.4rem",
    dur: 5.2,
    delay: 0.8,
  },
  { emoji: "✨", left: "40%", top: "85%", size: "1rem", dur: 5.8, delay: 3 },
  { emoji: "🌹", left: "5%", top: "90%", size: "1.2rem", dur: 4.2, delay: 2.2 },
  {
    emoji: "💖",
    left: "65%",
    top: "10%",
    size: "1.3rem",
    dur: 5.6,
    delay: 1.2,
  },
  {
    emoji: "🌟",
    left: "48%",
    top: "50%",
    size: "1.1rem",
    dur: 6.2,
    delay: 0.3,
  },
];

// ── Feature stats ─────────────────────────────────────────────
const FEATURES = [
  {
    emoji: "💬",
    label: "Response in under",
    value: "2 hours",
    gradient: "from-rose-400/20 to-pink-300/20",
  },
  {
    emoji: "💝",
    label: "Happy couples served",
    value: "1,500+",
    gradient: "from-gold-400/20 to-amber-300/20",
  },
  {
    emoji: "⭐",
    label: "Average rating",
    value: "4.9/5",
    gradient: "from-violet-400/20 to-purple-300/20",
  },
];

// ── Mouse-reactive 3D Tilt Card ───────────────────────────────
function TiltCard({
  children,
  className = "",
  reverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springX = useSpring(x, { stiffness: 120, damping: 18 });
  const springY = useSpring(y, { stiffness: 120, damping: 18 });

  const rotX = useTransform(springY, [0, 1], reverse ? [6, -6] : [-6, 6]);
  const rotY = useTransform(springX, [0, 1], reverse ? [-6, 6] : [6, -6]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function ContactContent() {
  const whatsappUrl = buildWhatsAppUrl(WHATSAPP_OWNER, WHATSAPP_MESSAGE);

  return (
    <div className="overflow-x-hidden">
      {/* ══ HERO / CONTACT SECTION ════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center py-28 overflow-hidden">
        {/* ── Animated gradient background ── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #FFF0F5 0%, #FBF7F0 25%, #FEF3C7 50%, #FCE7F3 75%, #FFF0F5 100%)",
            backgroundSize: "400% 400%",
            animation: "anniv-bg-shift 18s ease-in-out infinite",
          }}
        />

        {/* ── 3D Floating Orbs ── */}
        {ORBS.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none will-change-transform"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.left,
              top: orb.top,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              animationName: "orb-3d-float",
              animationDuration: `${orb.dur}s`,
              animationDelay: `${orb.delay}s`,
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
            }}
          />
        ))}

        {/* ── Floating Emojis / Particles ── */}
        {FLOATING_EMOJIS.map((f, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none select-none"
            style={{
              left: f.left,
              top: f.top,
              fontSize: f.size,
              lineHeight: 1,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [-8, 8, -8],
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: f.dur,
              delay: f.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {f.emoji}
          </motion.div>
        ))}

        {/* ── Content ── */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 w-full">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-16"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-5"
            >
              We're here to make magic ✨
            </motion.p>
            <h1
              className="font-[--font-cormorant] font-semibold leading-[1.05] mb-5 contact-heading-grad"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5.2rem)" }}
            >
              Let's weave your
              <br />
              love story together
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base md:text-lg text-[--color-charcoal]/55 max-w-lg mx-auto leading-relaxed"
            >
              Whether you have a vision, a question, or just want to say hello —
              we're one message away from creating something unforgettable.
            </motion.p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* ── WhatsApp Card (3D Tilt) ── */}
            <TiltCard reverse={false}>
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden rounded-3xl p-7 md:p-8 shadow-2xl block"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Animated conic gradient border ring */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "conic-gradient(from var(--contact-ring-angle, 0deg), #059669, #c9a962, #e8638c, #a855f7, #059669)",
                    padding: "2px",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                {/* Card background */}
                <div
                  className="absolute inset-[2px] rounded-[calc(1.5rem-2px)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  }}
                />
                {/* Glass sheen */}
                <div className="absolute inset-[2px] rounded-[calc(1.5rem-2px)] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/8 pointer-events-none" />

                <div
                  className="relative"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div
                    className="text-4xl mb-4"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    💬
                  </div>
                  <h2
                    className="text-white font-semibold text-xl mb-2"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    WhatsApp Us
                  </h2>
                  <p
                    className="text-emerald-100/90 text-sm leading-relaxed mb-5"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    Chat directly with our team. Available every day, 9 AM – 9
                    PM IST. We reply within minutes. 💌
                  </p>
                  <div
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all group-hover:bg-white/30 group-hover:shadow-lg"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <span className="text-emerald-200">📞</span>
                    +91 98462 24086
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </motion.a>
            </TiltCard>

            {/* ── Email Card (3D Tilt, reverse) ── */}
            <TiltCard reverse={true}>
              <motion.a
                href="mailto:info@wasleen.com"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden rounded-3xl p-7 md:p-8 shadow-2xl block"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Animated conic gradient border ring — purple/rose */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "conic-gradient(from var(--contact-ring-angle, 0deg), #7C3AED, #e8638c, #c9a962, #a855f7, #7C3AED)",
                    padding: "2px",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <div
                  className="absolute inset-[2px] rounded-[calc(1.5rem-2px)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
                  }}
                />
                <div className="absolute inset-[2px] rounded-[calc(1.5rem-2px)] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/8 pointer-events-none" />

                <div
                  className="relative"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div
                    className="text-4xl mb-4"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    ✉️
                  </div>
                  <h2
                    className="text-white font-semibold text-xl mb-2"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    Email Us
                  </h2>
                  <p
                    className="text-violet-200/90 text-sm leading-relaxed mb-5"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    Send a detailed message. We read every email personally and
                    reply within 24 hours. ✨
                  </p>
                  <div
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all group-hover:bg-white/30 group-hover:shadow-lg break-all"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <span className="text-violet-200">📬</span>
                    info@wasleen.com
                    <motion.span
                      className="inline-block flex-shrink-0"
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3,
                      }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </motion.a>
            </TiltCard>
          </div>

          {/* Response Time Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex items-center justify-center gap-2 mt-10"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <p className="text-sm text-[--color-charcoal]/50">
              Average response time:{" "}
              <strong className="text-[--color-charcoal]/70 font-semibold contact-grad-text">
                under 2 hours
              </strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ WAVE DIVIDER ═══════════════════════════════════════ */}
      <div className="relative -mt-1">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
            fill="url(#wave-grad)"
            opacity="0.4"
          />
          <path
            d="M0 80C240 20 480 100 720 40C960 100 1200 20 1440 80V120H0V80Z"
            fill="url(#wave-grad)"
            opacity="0.25"
          />
          <defs>
            <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e8638c" />
              <stop offset="50%" stopColor="#c9a962" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ═══ FEATURES / WHY COUPLES LOVE US ════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FBF7F0 0%, #FFF0F5 100%)",
          }}
        />

        {/* 3D Decorative Ring Ornaments */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-[--color-gold]/10 pointer-events-none">
          <div className="absolute inset-4 rounded-full border border-[--color-rose]/10" />
          <div className="absolute inset-8 rounded-full border border-[--color-gold]/8" />
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-[--color-gold]/10 pointer-events-none">
          <div className="absolute inset-4 rounded-full border border-[--color-rose]/10" />
          <div className="absolute inset-8 rounded-full border border-[--color-gold]/8" />
        </div>

        {/* Floating corner florals */}
        <div className="absolute top-8 left-12 font-[--font-cormorant] text-[5rem] text-[--color-gold]/8 leading-none pointer-events-none select-none">
          ❧
        </div>
        <div className="absolute bottom-8 right-12 font-[--font-cormorant] text-[5rem] text-[--color-gold]/8 leading-none rotate-180 pointer-events-none select-none">
          ❧
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-5">
              Why couples love us 💕
            </p>
            <h2
              className="font-[--font-cormorant] font-semibold contact-heading-grad"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              We're here for your love story
            </h2>
          </motion.div>

          {/* Feature stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`relative rounded-2xl p-6 text-center overflow-hidden ${
                  i === 0
                    ? "card-3d-float"
                    : i === 1
                      ? "card-3d-float-reverse"
                      : "card-3d-float"
                }`}
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3))`,
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow:
                    "0 8px 32px rgba(201,169,98,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {/* Glow */}
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${
                      i === 0 ? "#e8638c" : i === 1 ? "#c9a962" : "#a855f7"
                    }, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <div className="text-3xl mb-3">{feat.emoji}</div>
                  <p className="text-2xl font-bold font-[--font-cormorant] contact-grad-text mb-1">
                    {feat.value}
                  </p>
                  <p className="text-xs text-[--color-charcoal]/50 font-medium">
                    {feat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        {/* Dark gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1a1a2e 0%, #2d1a3a 30%, #1a1a2e 60%, #0d0d1a 100%)",
          }}
        />

        {/* Shooting stars */}
        <div
          className="absolute top-12 right-[20%] w-1 h-1 bg-white rounded-full pointer-events-none shooting-star"
          style={{
            boxShadow: "0 0 6px 2px rgba(255,255,255,0.3)",
            animation: "shooting-star 4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-24 right-[40%] w-0.5 h-0.5 bg-white rounded-full pointer-events-none shooting-star"
          style={{
            boxShadow: "0 0 4px 1px rgba(255,255,255,0.2)",
            animation: "shooting-star 6s ease-in-out infinite",
            animationDelay: "2.5s",
          }}
        />

        {/* Decorative rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-white/4 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-white/3 pointer-events-none" />

        {/* Animated gradient ring */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full pointer-events-none opacity-10 contact-ring-spin"
          style={{ filter: "blur(40px)" }}
        />

        {/* Subtle corner florals */}
        <div className="absolute top-6 left-8 font-[--font-cormorant] text-[5rem] text-white/5 leading-none pointer-events-none select-none">
          ❧
        </div>
        <div className="absolute bottom-6 right-8 font-[--font-cormorant] text-[5rem] text-white/5 leading-none rotate-180 pointer-events-none select-none">
          ❧
        </div>

        {/* Floating hearts */}
        <motion.div
          className="absolute top-[15%] left-[8%] text-3xl pointer-events-none select-none"
          animate={{
            y: [0, -18, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          💖
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] right-[10%] text-2xl pointer-events-none select-none"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          💕
        </motion.div>

        <div className="relative max-w-xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-7 heart-float-3d">💍</div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-5">
              Start creating today
            </p>
            <h2
              className="font-[--font-cormorant] font-semibold text-white mb-6 leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Ready to create your
              <br />
              dream wedding invite?
            </h2>
            <p className="text-white/40 mb-10 text-sm leading-relaxed">
              8 stunning templates · WhatsApp sharing · Live RSVP
              <br />
              Delivered in 24 hours · Valid for 1 year
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block contact-btn-glow rounded-full"
            >
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full font-semibold text-[--color-charcoal] hover:opacity-90 transition-all duration-300 text-base"
                style={{
                  background: "linear-gradient(135deg, #D4B468, #C9A962)",
                }}
              >
                Create Your Invite — ₹399
              </Link>
            </motion.div>
            <p className="mt-5 text-white/20 text-xs">
              One-time payment · No subscriptions · Instant confirmation
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
