"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/utils";
import { WHATSAPP_OWNER } from "@/lib/constants";

// ── Floating floral data ──────────────────────────────────────────────────────

const FLORALS = [
  { emoji: "🌸", left: "6%", top: "10%", size: "2.2rem", dur: 4.5, delay: 0 },
  { emoji: "🌺", left: "87%", top: "7%", size: "2.8rem", dur: 5.2, delay: 0.8 },
  { emoji: "🌼", left: "14%", top: "62%", size: "2rem", dur: 4.0, delay: 1.5 },
  {
    emoji: "🌻",
    left: "91%",
    top: "58%",
    size: "2.4rem",
    dur: 5.5,
    delay: 0.3,
  },
  { emoji: "🪷", left: "44%", top: "4%", size: "2rem", dur: 4.2, delay: 2.0 },
  { emoji: "🌹", left: "2%", top: "38%", size: "1.8rem", dur: 5.0, delay: 1.0 },
  {
    emoji: "🌸",
    left: "76%",
    top: "74%",
    size: "2.5rem",
    dur: 4.8,
    delay: 0.5,
  },
  {
    emoji: "🌺",
    left: "54%",
    top: "88%",
    size: "1.6rem",
    dur: 4.1,
    delay: 1.8,
  },
  {
    emoji: "🌼",
    left: "29%",
    top: "83%",
    size: "2.2rem",
    dur: 5.3,
    delay: 0.2,
  },
  {
    emoji: "🪷",
    left: "70%",
    top: "28%",
    size: "1.9rem",
    dur: 4.6,
    delay: 1.2,
  },
  {
    emoji: "🌸",
    left: "19%",
    top: "28%",
    size: "1.5rem",
    dur: 3.8,
    delay: 2.5,
  },
  { emoji: "🌻", left: "60%", top: "14%", size: "2rem", dur: 5.0, delay: 0.7 },
  {
    emoji: "🌹",
    left: "38%",
    top: "72%",
    size: "1.7rem",
    dur: 4.4,
    delay: 3.0,
  },
  {
    emoji: "🪷",
    left: "82%",
    top: "42%",
    size: "2.1rem",
    dur: 4.9,
    delay: 1.6,
  },
];

// ── FAQ data ──────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How quickly will my invite be ready?",
    a: "Usually within 24 hours of payment. We personally craft every invite — so you'll receive it fast and ready to share on WhatsApp the same day.",
    color: "#EC4899",
  },
  {
    q: "What's included in the ₹399 price?",
    a: "Everything — 8 premium templates, photo & video gallery, live countdown timer, digital RSVP, background music, voice message from the couple, WhatsApp sharing, and 1 year validity. One price, zero hidden charges.",
    color: "#8B5CF6",
  },
  {
    q: "Can I add multiple ceremonies?",
    a: "Absolutely! Add Mehendi, Sangeet, Wedding, Reception — all in a single beautiful invite. Each event gets its own card with venue, date, and time.",
    color: "#059669",
  },
  {
    q: "Do guests need to download an app?",
    a: "No app needed. Your invite opens as a gorgeous website in any browser — on Android, iPhone, or desktop. Just share the link and guests are in.",
    color: "#F97316",
  },
  {
    q: "How do guests RSVP?",
    a: 'Guests open your invite link and tap "Joyfully Accept" or "Regretfully Decline". Their response is collected instantly — name, attendance, and guest count.',
    color: "#C9A962",
  },
  {
    q: "Can I add photos and videos?",
    a: "Yes — upload pre-wedding shoot photos, couple photos, and a video during the ordering steps. Your gallery is displayed beautifully inside the invite.",
    color: "#D4756C",
  },
  {
    q: "What if I want changes after delivery?",
    a: "We'll make revisions until you're completely happy. Your satisfaction is our priority — we won't close the order until you love your invite.",
    color: "#0EA5E9",
  },
  {
    q: "Is my payment secure?",
    a: "Absolutely. All payments go through Razorpay — a RBI-regulated, PCI-DSS compliant gateway trusted by millions of Indians every day.",
    color: "#9CA986",
  },
];

// ── FAQ accordion item ────────────────────────────────────────────────────────

function FAQItem({
  item,
  index,
}: {
  item: (typeof FAQS)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-2xl border border-black/8 bg-white/80 backdrop-blur-sm overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-1.5 h-8 rounded-full flex-shrink-0"
            style={{ background: item.color }}
          />
          <span className="font-medium text-[--color-charcoal] text-sm sm:text-base leading-snug">
            {item.q}
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl leading-none text-black/25 flex-shrink-0 font-light"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-5 border-t"
              style={{ borderColor: `${item.color}25` }}
            >
              <p className="pt-4 text-sm text-[--color-charcoal]/65 leading-relaxed">
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ContactContent() {
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_OWNER,
    "Hi! I have a question about WedInviter 🌸",
  );

  return (
    <div className="overflow-x-hidden">
      {/* ══ HERO / CONTACT SECTION ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center py-28 overflow-hidden">
        {/* Gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #FFF0F5 0%, #FBF7F0 40%, #FFFBEB 100%)",
          }}
        />

        {/* Blurred color blobs */}
        <div className="absolute top-[-5%] left-[20%] w-[28rem] h-[28rem] rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
        <div className="absolute top-[30%] right-[10%] w-[22rem] h-[22rem] rounded-full bg-violet-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[5%] left-[5%] w-[20rem] h-[20rem] rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[20%] right-[0%] w-[18rem] h-[18rem] rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
        <div className="absolute top-[10%] left-[50%] w-[16rem] h-[16rem] rounded-full bg-rose-200/30 blur-3xl pointer-events-none" />

        {/* Floating florals */}
        {FLORALS.map((f, i) => (
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
              y: [0, -18, 0],
              rotate: [-6, 6, -6],
              opacity: [0.5, 0.9, 0.5],
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

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 w-full">
          {/* Heading block */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-5">
              We're here for you
            </p>
            <h1
              className="font-[--font-cormorant] font-semibold leading-[1.1] text-[--color-charcoal] mb-5"
              style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)" }}
            >
              Let's create something
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #EC4899, #C9A962, #8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                beautiful together
              </span>
            </h1>
            <p className="text-base md:text-lg text-[--color-charcoal]/55 max-w-md mx-auto leading-relaxed">
              Questions, custom requests, or just want to say hello — we reply
              within hours.
            </p>
          </motion.div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* WhatsApp card */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              whileHover={{ scale: 1.025, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-3xl p-7 shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              }}
            >
              {/* Decorative circle */}
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/8 pointer-events-none" />

              <div className="relative">
                <div className="text-4xl mb-4">💬</div>
                <h2 className="text-white font-semibold text-xl mb-2">
                  WhatsApp Us
                </h2>
                <p className="text-emerald-100/90 text-sm leading-relaxed mb-5">
                  Chat directly with our team. Available every day, 9 AM – 9 PM
                  IST.
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full transition-all group-hover:bg-white/30">
                  +91 98462 24086
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 3, 0] }}
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

            {/* Email card */}
            <motion.a
              href="mailto:happy@wedinviter.wasleen.com"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.025, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-3xl p-7 shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
              }}
            >
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/8 pointer-events-none" />

              <div className="relative">
                <div className="text-4xl mb-4">✉️</div>
                <h2 className="text-white font-semibold text-xl mb-2">
                  Email Us
                </h2>
                <p className="text-violet-200/90 text-sm leading-relaxed mb-5">
                  Send a detailed message. We reply to every email within 24
                  hours.
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full transition-all group-hover:bg-white/30 break-all">
                  happy@wedinviter.wasleen.com
                  <motion.span
                    className="inline-block flex-shrink-0"
                    animate={{ x: [0, 3, 0] }}
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
          </div>

          {/* Response time */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="text-center mt-8 text-sm text-[--color-charcoal]/45"
          >
            ⚡ Average response time:{" "}
            <strong className="text-[--color-charcoal]/65 font-semibold">
              under 2 hours
            </strong>
          </motion.p>
        </div>
      </section>

      {/* ══ CTA SECTION ════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-[--color-charcoal] overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[--color-gold]/8 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-[--color-gold]/6 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-[--color-gold]/5 pointer-events-none" />

        {/* Subtle corner floral glyphs */}
        <div className="absolute top-6 left-8 font-[--font-cormorant] text-[5rem] text-[--color-gold]/8 leading-none pointer-events-none select-none">
          ❧
        </div>
        <div className="absolute bottom-6 right-8 font-[--font-cormorant] text-[5rem] text-[--color-gold]/8 leading-none rotate-180 pointer-events-none select-none">
          ❧
        </div>

        <div className="relative max-w-xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-7">🎊</div>
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
            <p className="text-white/45 mb-10 text-sm leading-relaxed">
              8 stunning templates · WhatsApp sharing · Live RSVP
              <br />
              Delivered in 24 hours · Valid for 1 year
            </p>
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full font-semibold text-[--color-charcoal] hover:opacity-90 transition-all duration-300 hover:scale-[1.04] shadow-xl shadow-black/35 text-base"
              style={{
                background: "linear-gradient(135deg, #D4B468, #C9A962)",
              }}
            >
              Create Your Invite — ₹399
            </Link>
            <p className="mt-5 text-white/25 text-xs">
              One-time payment · No subscriptions · Instant confirmation
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══ FAQ SECTION ════════════════════════════════════════════════════ */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FBF7F0 0%, #FFF0F5 100%)",
        }}
      >
        {/* Background ornaments */}
        <div className="absolute top-10 right-12 font-[--font-cormorant] text-[7rem] text-[--color-gold]/5 leading-none pointer-events-none select-none">
          ❧
        </div>
        <div className="absolute bottom-10 left-12 font-[--font-cormorant] text-[7rem] text-[--color-gold]/5 leading-none rotate-180 pointer-events-none select-none">
          ❧
        </div>

        {/* Subtle blobs */}
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-pink-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-violet-100/50 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-5">
              Got questions?
            </p>
            <h2
              className="font-[--font-cormorant] font-semibold text-[--color-charcoal]"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Frequently asked questions
            </h2>
            <p className="mt-3 text-[--color-charcoal]/45 text-sm">
              Everything you need to know about WedInviter.
            </p>
          </motion.div>

          {/* Accordion */}
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={faq.q} item={faq} index={i} />
            ))}
          </div>

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-[--color-charcoal]/45">
              Still have a question?{" "}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--color-gold] font-semibold hover:underline underline-offset-2"
              >
                Ask us on WhatsApp →
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
