"use client";

import { useRef, useLayoutEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HOW_IT_WORKS_STEPS } from "@/lib/anniversary-constants";

const headingVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  // GSAP: animate the connecting line height + step cards on scroll
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const line = timelineRef.current;
    if (!section || !line) return;

    const ctx = gsap.context(() => {
      // Animate the timeline connector line height
      gsap.fromTo(
        line,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 1,
          },
        },
      );

      // Animate each step card
      const cards = gsap.utils.toArray<HTMLElement>("[data-aq-step]", section);
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 30, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.25,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-16 md:py-24 overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[--color-champagne]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[--color-blush]/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={headingVariants}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-3">
            How It Works
          </p>
          <h2 className="font-[--font-cormorant] text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-[--color-charcoal]">
            Three simple steps to
            <br />
            surprise your partner
          </h2>
        </motion.div>

        {/* Timeline layout */}
        <div className="relative flex flex-col items-center">
          {/* Connecting line — vertical, centered */}
          <div
            ref={timelineRef}
            className="timeline-connector absolute top-0 bottom-0 left-[1.5rem] sm:left-1/2 sm:-translate-x-1/2"
            style={{ transformOrigin: "top center" }}
          />

          <div className="relative w-full space-y-12 md:space-y-16">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div
                key={step.step}
                data-aq-step
                className={`relative flex flex-col sm:flex-row items-start gap-5 ${
                  i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* Step number — stays at left on mobile, alternates on desktop */}
                <div
                  className={`step-number-circle z-10 ${
                    i % 2 === 0 ? "sm:ml-auto sm:mr-8" : "sm:mr-auto sm:ml-8"
                  }`}
                >
                  {step.step}
                </div>

                {/* Content card */}
                <div
                  className={`flex-1 max-w-md ${
                    i % 2 === 0
                      ? "sm:text-left sm:mr-auto"
                      : "sm:text-left sm:ml-auto"
                  }`}
                >
                  <div className="glass-feature-card rounded-2xl p-5 sm:p-6">
                    <h3 className="font-[--font-cormorant] text-xl font-bold text-[--color-charcoal] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[--color-charcoal]/55 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Spacer for alignment on desktop (alternating layout) */}
                <div className="hidden sm:block flex-1 max-w-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
