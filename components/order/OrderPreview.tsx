"use client";

import { useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/invite/HeroSection";
import { VoiceMessage } from "@/components/invite/VoiceMessage";
import MediaGallery from "@/components/invite/MediaGallery";
import { EventTimeline } from "@/components/invite/EventTimeline";
import PaymentButtonEnhanced from "@/components/order/PaymentButtonEnhanced";
import AnimatedPrice from "@/components/order/AnimatedPrice";
import FloralBorderWrapper from "@/components/order/FloralBorders";
import FlowerPetalEffect from "@/components/order/FlowerPetalEffect";
import { useOrderStore } from "@/hooks/useOrderStore";
import { useRazorpay } from "@/hooks/useRazorpay";
import { TEMPLATES } from "@/lib/templates";
import { step4Schema } from "@/lib/validation";
import { PRICING } from "@/lib/constants";
import type { Media } from "@/types/database.types";

type Step4Errors = Partial<
  Record<"phone_number" | "email" | "custom_message", string>
>;

const FONT_FAMILY_MAP: Record<string, string> = {
  cormorant: "var(--font-cormorant)",
  playfair: "var(--font-playfair)",
  lora: "var(--font-lora)",
  merriweather: "var(--font-merriweather)",
  "josefin-sans": "var(--font-josefin-sans)",
  cinzel: "var(--font-cinzel)",
  inter: "var(--font-inter)",
  montserrat: "var(--font-montserrat)",
  "libre-baskerville": "var(--font-libre-baskerville)",
  lato: "var(--font-lato)",
};

export default function OrderPreview() {
  const router = useRouter();
  const store = useOrderStore();
  const [errors, setErrors] = useState<Step4Errors>({});
  const { initializePayment, isLoading } = useRazorpay();
  const [flowerTrigger, setFlowerTrigger] = useState(false);
  const flowerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Resolve selected template
  const selectedTemplate = useMemo(
    () => TEMPLATES.find((t) => t.slug === store.template_slug) ?? TEMPLATES[0],
    [store.template_slug],
  );

  // Count media items
  const mediaCount =
    store.media.photos.length +
    store.media.videos.length +
    (store.media.voice ? 1 : 0) +
    (store.media.song ? 1 : 0);

  // Payment disabled reason
  const paymentDisabledReason = useMemo(() => {
    if (
      !store.couple_name_1 ||
      !store.couple_name_2 ||
      !store.wedding_date ||
      !store.template_slug
    ) {
      return "Please complete Step 1 details.";
    }
    if (store.events.length === 0)
      return "Please add at least one event in Step 2.";
    if (mediaCount === 0)
      return "Please upload at least one media item in Step 3.";
    const check = step4Schema.safeParse({
      phone_number: store.phone_number,
      email: store.email,
      custom_message: store.custom_message,
    });
    if (!check.success) return "Please complete contact details.";
    return null;
  }, [mediaCount, store]);

  // Map store events to EventTimeline format
  const timelineEvents = useMemo(
    () =>
      store.events.map((event, index) => ({
        id: `preview-event-${index}`,
        name: event.event_name,
        date: event.event_date,
        time: event.event_time,
        venueName: event.venue_name,
        venueAddress: event.venue_address,
        mapLink: event.venue_map_link || undefined,
      })),
    [store.events],
  );

  // Map store photos to Media[] format
  const previewPhotos: Media[] = useMemo(
    () =>
      store.media.photos.map((p, i) => ({
        id: `preview-photo-${i}`,
        file_url: p.url,
        file_name: p.name,
        media_type: "photo" as const,
        uploaded_at: new Date().toISOString(),
        invite_id: "",
        order_id: "",
        file_path: p.path,
        file_size: p.size,
        mime_type: p.mimeType,
      })),
    [store.media.photos],
  );

  // Map store videos to Media[] format
  const previewVideos: Media[] = useMemo(
    () =>
      store.media.videos.map((v, i) => ({
        id: `preview-video-${i}`,
        file_url: v.url,
        file_name: v.name,
        media_type: "video" as const,
        uploaded_at: new Date().toISOString(),
        invite_id: "",
        order_id: "",
        file_path: v.path,
        file_size: v.size,
        mime_type: v.mimeType,
      })),
    [store.media.videos],
  );

  // Map store voice to Media | null
  const previewVoice: Media | null = useMemo(
    () =>
      store.media.voice
        ? {
            id: "preview-voice-0",
            file_url: store.media.voice.url,
            file_name: store.media.voice.name,
            media_type: "voice" as const,
            uploaded_at: new Date().toISOString(),
            invite_id: "",
            order_id: "",
            file_path: store.media.voice.path,
            file_size: store.media.voice.size,
            mime_type: store.media.voice.mimeType,
          }
        : null,
    [store.media.voice],
  );

  // Hero photo
  const heroPhoto = previewPhotos.length > 0 ? previewPhotos[0].file_url : null;

  // Template CSS variables
  const cssVariables = {
    "--template-bg": selectedTemplate.colors.background,
    "--template-text": selectedTemplate.colors.text,
    "--template-primary": selectedTemplate.colors.primary,
    "--template-secondary": selectedTemplate.colors.secondary,
    "--template-accent": selectedTemplate.colors.accent,
    "--template-border": selectedTemplate.colors.border,
    "--pattern-opacity": selectedTemplate.decorations.patternOpacity,
  } as React.CSSProperties;

  const couple = {
    name1: store.couple_name_1,
    name2: store.couple_name_2,
  };

  // Font family CSS var
  const headingFont =
    FONT_FAMILY_MAP[selectedTemplate.fonts.heading] || "var(--font-cormorant)";

  // Payment handler
  const handlePay = async () => {
    const result = step4Schema.safeParse({
      phone_number: store.phone_number,
      email: store.email,
      custom_message: store.custom_message,
    });

    if (!result.success) {
      const nextErrors: Step4Errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof Step4Errors;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setFlowerTrigger(true);
    if (flowerTimeoutRef.current) clearTimeout(flowerTimeoutRef.current);
    flowerTimeoutRef.current = setTimeout(() => {
      setFlowerTrigger(false);
    }, 3000);

    initializePayment({
      couple_name_1: store.couple_name_1,
      couple_name_2: store.couple_name_2,
      wedding_date: store.wedding_date,
      template_slug: store.template_slug,
      events: store.events,
      media: store.media,
      phone_number: store.phone_number,
      email: store.email,
      custom_message: store.custom_message,
    });
  };

  return (
    <div className="min-h-screen" style={cssVariables}>
      <FlowerPetalEffect
        trigger={flowerTrigger}
        petalCount={50}
        origin={{ x: 0.5, y: 0.5 }}
      />

      {/* ─── Sticky Top Bar ─── */}
      <div
        className="sticky top-0 z-40 backdrop-blur-md border-b"
        style={{
          backgroundColor: `${selectedTemplate.colors.background}E6`,
          borderColor: `${selectedTemplate.colors.border}33`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: selectedTemplate.colors.text }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Review
          </button>

          <span
            className="text-xs font-medium tracking-wider uppercase opacity-60"
            style={{ color: selectedTemplate.colors.text }}
          >
            Invitation Preview
          </span>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="relative mx-auto w-full max-w-[980px] px-4 sm:px-6 py-10 sm:py-14">
        {/* Optional pattern background */}
        <div className="pointer-events-none absolute inset-0 opacity-[var(--pattern-opacity,0.06)]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--template-border) 1px, transparent 0)`,
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        <div className="relative space-y-16">
          {/* ── Hero Section ── */}
          <div id="preview-hero">
            <HeroSection
              couple={couple}
              weddingDate={store.wedding_date}
              template={selectedTemplate}
              heroPhoto={heroPhoto}
            />
          </div>

          {/* ── Voice Message / Custom Quote ── */}
          {(previewVoice || store.custom_message) && (
            <div id="preview-voice">
              <VoiceMessage
                audioUrl={previewVoice?.file_url}
                templateColor={selectedTemplate.colors.primary}
                quote={store.custom_message || undefined}
              />
            </div>
          )}

          {/* ── Media Gallery ── */}
          {(previewPhotos.length > 0 || previewVideos.length > 0) && (
            <div id="preview-gallery">
              <h2
                className="text-3xl md:text-4xl text-center mb-8 font-serif"
                style={{
                  color: selectedTemplate.colors.primary,
                  fontFamily: headingFont,
                }}
              >
                Our Memories
              </h2>
              <MediaGallery
                photos={previewPhotos}
                videos={previewVideos}
                voice={previewVoice}
                accentColor={selectedTemplate.colors.primary}
              />
            </div>
          )}

          {/* ── Events Timeline ── */}
          {timelineEvents.length > 0 && (
            <div id="preview-timeline">
              <EventTimeline
                events={timelineEvents}
                templateColor={selectedTemplate.colors.primary}
              />
            </div>
          )}

          {/* ── Payment Section ── */}
          <div
            id="preview-payment"
            className="pt-8 border-t border-gray-200/50"
          >
            <div className="max-w-xl mx-auto text-center space-y-6">
              <div className="space-y-2">
                <h2
                  className="text-2xl sm:text-3xl font-semibold leading-tight"
                  style={{
                    fontFamily: headingFont,
                    color: selectedTemplate.colors.primary,
                  }}
                >
                  Secure Your Invitation
                </h2>
                <p
                  className="text-sm"
                  style={{ color: selectedTemplate.colors.secondary }}
                >
                  Complete payment to publish your invite and share it with
                  guests
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <FloralBorderWrapper
                  corners={true}
                  sides={false}
                  className="glass-card rounded-2xl p-4 sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm memorable-gradient-text">
                        Memorable@
                      </p>
                      <AnimatedPrice />
                    </div>
                    <p className="text-xs text-[--color-blush] text-right">
                      One-time payment
                      <br />
                      No hidden fees
                    </p>
                  </div>

                  {/* Contact fields for validation */}
                  <div className="mt-4 space-y-3">
                    {errors.phone_number && (
                      <p className="text-xs text-red-500">
                        {errors.phone_number}
                      </p>
                    )}
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <PaymentButtonEnhanced
                      loading={isLoading}
                      disabledReason={paymentDisabledReason}
                      onClick={handlePay}
                    />
                  </div>
                </FloralBorderWrapper>
              </motion.div>

              <p
                className="text-xs opacity-50"
                style={{ color: selectedTemplate.colors.text }}
              >
                Powered by Razorpay • 100% secure payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
