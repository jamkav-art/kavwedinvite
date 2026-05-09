"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderStore } from "@/hooks/useOrderStore";
import { TEMPLATES } from "@/lib/templates";
import TemplatePreviewSlide from "./TemplatePreviewSlide";
import CarouselNavigation from "./CarouselNavigation";

const CAROUSEL_TEMPLATES = TEMPLATES.slice(0, 8); // Up to 8 templates

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "30%" : "-30%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "30%" : "-30%",
    opacity: 0,
    scale: 0.95,
  }),
};

export default function SlideTemplateCarousel() {
  const userData = useOrderStore((s) => ({
    couple_name_1: s.couple_name_1,
    couple_name_2: s.couple_name_2,
    wedding_date: s.wedding_date,
    template_slug: s.template_slug,
    events: s.events,
    media: s.media,
    phone_number: s.phone_number,
    email: s.email,
    custom_message: s.custom_message,
  }));
  const selectTemplate = useOrderStore((s) => s.selectTemplate);
  const prevStep = useOrderStore((s) => s.prevStep);
  const reset = useOrderStore((s) => s.reset);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const dragXRef = useRef(0);
  const prevIndexRef = useRef(0);

  // Set direction for animation
  useEffect(() => {
    setDirection(carouselIndex > prevIndexRef.current ? 1 : -1);
    prevIndexRef.current = carouselIndex;
  }, [carouselIndex]);

  // Preselect the user's chosen template
  useEffect(() => {
    const idx = CAROUSEL_TEMPLATES.findIndex(
      (t) => t.slug === userData.template_slug,
    );
    if (idx >= 0) {
      setCarouselIndex(idx);
    }
  }, [userData.template_slug]);

  const goNext = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % CAROUSEL_TEMPLATES.length);
  }, []);

  const goPrev = useCallback(() => {
    setCarouselIndex(
      (prev) =>
        (prev - 1 + CAROUSEL_TEMPLATES.length) % CAROUSEL_TEMPLATES.length,
    );
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCarouselIndex(index);
  }, []);

  const handlePay = useCallback(
    (slug: string) => {
      selectTemplate(slug);
      // Trigger Razorpay payment flow
      // This is handled by the existing PaymentButton/PaymentButtonEnhanced components
      // For now, we just set the template and navigate to payment
      // In production, this would integrate with useRazorpay.initializePayment
      const store = useOrderStore.getState();
      store.selectTemplate(slug);
      // For now, we'll just show an alert as placeholder
      // The actual payment integration uses the existing PaymentButtonEnhanced
      alert(
        `Payment flow for "${slug}" template. Total: ₹399\n\nIn production, this will redirect to Razorpay checkout.`,
      );
    },
    [selectTemplate],
  );

  const handleBackToEditing = () => {
    prevStep(); // Go back to slide 16
  };

  const currentTemplate = CAROUSEL_TEMPLATES[carouselIndex];

  return (
    <div className="flex flex-col items-center w-full">
      {/* Back to editing link */}
      <button
        onClick={handleBackToEditing}
        className="self-start text-xs text-[var(--wiz-text-muted)] hover:text-[var(--wiz-accent-gold)] transition-colors mb-2"
      >
        ◄ Back to Editing
      </button>

      {/* Carousel preview area */}
      <div className="w-full relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={carouselIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => {
              dragXRef.current = 0;
            }}
            onDrag={(_, info) => {
              dragXRef.current = info.offset.x;
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) goNext();
              else if (info.offset.x > 80) goPrev();
            }}
            style={{ touchAction: "pan-y" }}
          >
            {currentTemplate && (
              <TemplatePreviewSlide
                templateSlug={currentTemplate.slug}
                userData={userData}
                onPay={handlePay}
                isActive={true}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Template info card */}
      {currentTemplate && (
        <div className="wiz-glass px-4 py-3 rounded-xl mt-3 text-center">
          <p className="text-sm font-semibold font-[var(--font-cormorant)] text-[var(--wiz-text-primary)]">
            {currentTemplate.name}
          </p>
          <p className="text-xs text-[var(--wiz-text-muted)]">
            {currentTemplate.mood}
          </p>
          <p className="text-xs text-[var(--wiz-text-secondary)] mt-1">
            {currentTemplate.animations.scrollEffect === "parallax"
              ? "✨ Parallax · "
              : ""}
            {currentTemplate.particles.component !== "none"
              ? "🌸 Particles · "
              : ""}
            {currentTemplate.animations.heroEntrance === "scale"
              ? "🎬 Animations"
              : "🎨 Elegant"}
          </p>
        </div>
      )}

      {/* Carousel navigation */}
      <CarouselNavigation
        currentIndex={carouselIndex}
        totalSlides={CAROUSEL_TEMPLATES.length}
        onPrev={goPrev}
        onNext={goNext}
        onDotClick={goToSlide}
      />
    </div>
  );
}
