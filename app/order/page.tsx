"use client";

import { useEffect, useRef } from "react";
import { useOrderStore } from "@/hooks/useOrderStore";
import WeddingWizardContainer from "@/components/order/WeddingWizardContainer";
import SlideYourName from "@/components/order/SlideYourName";
import SlidePartnerName from "@/components/order/SlidePartnerName";
import SlideWeddingDate from "@/components/order/SlideWeddingDate";
import SlideTemplateSelect from "@/components/order/SlideTemplateSelect";
import SlidePhone from "@/components/order/SlidePhone";
import SlideEmail from "@/components/order/SlideEmail";
import SlideCustomMessage from "@/components/order/SlideCustomMessage";
import SlideEvents from "@/components/order/SlideEvents";
import SlidePhotoUpload from "@/components/order/SlidePhotoUpload";
import SlideVideos from "@/components/order/SlideVideos";
import SlideVoiceMessage from "@/components/order/SlideVoiceMessage";
import SlideBackgroundSong from "@/components/order/SlideBackgroundSong";
import SlideTemplateCarousel from "@/components/order/SlideTemplateCarousel";

// ── Photo slide wrappers (Slides 9-13) ──
// These use the reusable SlidePhotoUpload with different labels

function SlidePhoto1() {
  const nextStep = useOrderStore((s) => s.nextStep);
  return (
    <SlidePhotoUpload
      photoIndex={0}
      totalPhotos={5}
      label="Your first wedding photo"
      sublabel="Photo 1 of 5"
      onNext={nextStep}
    />
  );
}

function SlidePhoto2() {
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);
  return (
    <SlidePhotoUpload
      photoIndex={1}
      totalPhotos={5}
      label="Add a second photo"
      sublabel="Photo 2 of 5"
      onNext={nextStep}
      onBack={prevStep}
      showBack
    />
  );
}

function SlidePhoto3() {
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);
  return (
    <SlidePhotoUpload
      photoIndex={2}
      totalPhotos={5}
      label="Add a third photo"
      sublabel="Photo 3 of 5"
      onNext={nextStep}
      onBack={prevStep}
      showBack
    />
  );
}

function SlidePhoto4() {
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);
  return (
    <SlidePhotoUpload
      photoIndex={3}
      totalPhotos={5}
      label="Add a fourth photo"
      sublabel="Photo 4 of 5"
      onNext={nextStep}
      onBack={prevStep}
      showBack
    />
  );
}

function SlidePhoto5() {
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);
  return (
    <SlidePhotoUpload
      photoIndex={4}
      totalPhotos={5}
      label="Add a fifth photo"
      sublabel="Photo 5 of 5"
      onNext={nextStep}
      onBack={prevStep}
      showBack
    />
  );
}

// ── SLIDE_MAP Definition ──
// 24 slides total: 1-16 are individual slides, 17 is the carousel entry (internally manages 8 sub-slides)
const SLIDE_MAP: React.ComponentType[] = [
  SlideYourName, // 1
  SlidePartnerName, // 2
  SlideWeddingDate, // 3
  SlideTemplateSelect, // 4
  SlidePhone, // 5
  SlideEmail, // 6
  SlideCustomMessage, // 7
  SlideEvents, // 8
  SlidePhoto1, // 9
  SlidePhoto2, // 10
  SlidePhoto3, // 11
  SlidePhoto4, // 12
  SlidePhoto5, // 13
  SlideVideos, // 14
  SlideVoiceMessage, // 15
  SlideBackgroundSong, // 16
  SlideTemplateCarousel, // 17-24 (internal carousel state, outer step stays at 17)
];

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-14 bg-white/10 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-6 w-48 bg-white/10 rounded-lg mx-auto" />
        <div className="h-11 bg-white/10 rounded-lg" />
        <div className="h-11 bg-white/10 rounded-lg" />
        <div className="h-11 bg-white/10 rounded-lg" />
      </div>
      <div className="h-64 bg-white/10 rounded-2xl" />
    </div>
  );
}

export default function OrderPage() {
  const hasHydrated = useOrderStore((s) => s.hasHydrated);
  const currentStep = useOrderStore((s) => s.currentStep);
  const goToStep = useOrderStore((s) => s.goToStep);

  // ── Re-render safety net ──
  // Tracks render count to detect infinite loops from corrupted state.
  // Uses a ref + effect to avoid calling setState() during render phase,
  // which would trigger React error #185 (Maximum update depth exceeded).
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  // Moved reset logic to an effect so setState() happens AFTER render,
  // preventing the deadly feedback loop (reset → re-render → reset → ...)
  useEffect(() => {
    if (renderCountRef.current > 30) {
      console.warn(
        "[OrderPage] Re-render threshold exceeded — resetting to step 1",
        { renderCount: renderCountRef.current, currentStep },
      );
      // Go to step 1 without destroying user data
      goToStep(1);
      renderCountRef.current = 0;
    }
  }, [renderCountRef.current, currentStep, goToStep]);

  // ── Rehydration ──
  useEffect(() => {
    try {
      useOrderStore.persist.rehydrate();
    } catch (e) {
      console.error("[OrderPage] Rehydration threw — resetting store", e);
      useOrderStore.getState().reset();
      useOrderStore.getState().setHasHydrated(true);
    }
  }, []);

  if (!hasHydrated) {
    return <LoadingSkeleton />;
  }

  const StepComponent = SLIDE_MAP[currentStep - 1];

  if (!StepComponent) {
    // Fallback: if step is out of range, show first slide
    return (
      <WeddingWizardContainer>
        <SlideYourName />
      </WeddingWizardContainer>
    );
  }

  return (
    <WeddingWizardContainer>
      <StepComponent />
    </WeddingWizardContainer>
  );
}
