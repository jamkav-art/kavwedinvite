"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderStore } from "@/hooks/useOrderStore";
import { useRazorpay } from "@/hooks/useRazorpay";
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
  // Use individual primitive selectors instead of a combined object selector
  // to avoid creating a new reference on every render (which caused React #185)
  const couple_name_1 = useOrderStore((s) => s.couple_name_1);
  const couple_name_2 = useOrderStore((s) => s.couple_name_2);
  const wedding_date = useOrderStore((s) => s.wedding_date);
  const template_slug = useOrderStore((s) => s.template_slug);
  const events = useOrderStore((s) => s.events);
  const media = useOrderStore((s) => s.media);
  const phone_number = useOrderStore((s) => s.phone_number);
  const email = useOrderStore((s) => s.email);
  const custom_message = useOrderStore((s) => s.custom_message);

  // Memoize the combined object so it only gets a new reference when a value actually changes
  const userData = useMemo(
    () => ({
      couple_name_1,
      couple_name_2,
      wedding_date,
      template_slug,
      events,
      media,
      phone_number,
      email,
      custom_message,
    }),
    [
      couple_name_1,
      couple_name_2,
      wedding_date,
      template_slug,
      events,
      media,
      phone_number,
      email,
      custom_message,
    ],
  );
  const selectTemplate = useOrderStore((s) => s.selectTemplate);
  const prevStep = useOrderStore((s) => s.prevStep);
  const reset = useOrderStore((s) => s.reset);
  const { initializePayment, isLoading } = useRazorpay();

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
      // Select the template first
      selectTemplate(slug);
      // Build the full order data from the store
      const store = useOrderStore.getState();
      store.selectTemplate(slug);
      const orderData = {
        couple_name_1: store.couple_name_1,
        couple_name_2: store.couple_name_2,
        wedding_date: store.wedding_date,
        template_slug: slug,
        events: store.events,
        media: store.media,
        phone_number: store.phone_number,
        email: store.email,
        custom_message: store.custom_message,
      };
      // Fire the actual Razorpay payment flow
      initializePayment(orderData);
    },
    [selectTemplate, initializePayment],
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
