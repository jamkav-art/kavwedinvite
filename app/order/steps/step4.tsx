"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import PaymentButtonEnhanced from "@/components/order/PaymentButtonEnhanced";
import TemplatePreview from "@/components/order/TemplatePreview";
import { useOrderStore } from "@/hooks/useOrderStore";
import { useRazorpay } from "@/hooks/useRazorpay";
import { PRICING } from "@/lib/constants";
import { TEMPLATES } from "@/lib/templates";
import { step4Schema } from "@/lib/validation";
import FloralParticleBackground from "@/components/order/FloralParticleBackground";
import FloralBorderWrapper from "@/components/order/FloralBorders";
import FlowerPetalEffect from "@/components/order/FlowerPetalEffect";

type Step4Errors = Partial<
  Record<"phone_number" | "email" | "custom_message", string>
>;

export default function Step4() {
  const store = useOrderStore();
  const [errors, setErrors] = useState<Step4Errors>({});
  const { initializePayment, isLoading } = useRazorpay();
  const [flowerTrigger, setFlowerTrigger] = useState(false);
  const flowerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((t) => t.slug === store.template_slug) ?? TEMPLATES[0],
    [store.template_slug],
  );

  const mediaCount =
    store.media.photos.length +
    store.media.videos.length +
    (store.media.voice ? 1 : 0) +
    (store.media.song ? 1 : 0);

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
    if (!check.success)
      return "Please complete contact details correctly before payment.";
    return null;
  }, [mediaCount, store]);

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
    // Trigger flower effect
    setFlowerTrigger(true);
    if (flowerTimeoutRef.current) clearTimeout(flowerTimeoutRef.current);
    flowerTimeoutRef.current = setTimeout(() => {
      setFlowerTrigger(false);
    }, 3000);

    // Wait for flower effect to show, then open payment gateway
    setTimeout(() => {
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
    }, 1800); // Slightly before flower effect ends
  };

  return (
    <div className="relative min-h-[800px]">
      <FloralParticleBackground />
      <FlowerPetalEffect
        trigger={flowerTrigger}
        petalCount={50}
        origin={{ x: 0.5, y: 0.5 }}
      />
      <div className="space-y-8 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-[var(--font-cormorant)] font-semibold text-[--color-charcoal] leading-tight">
            Review and pay
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Step 4 of 4 — verify your details before secure payment
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
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[--color-charcoal]">
                Couple and template
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => store.goToStep(1)}
              >
                Edit
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {store.couple_name_1} & {store.couple_name_2}
            </p>
            <p className="text-sm text-gray-500">{store.wedding_date}</p>
            <div className="mt-3 max-w-[220px]">
              <TemplatePreview template={selectedTemplate} />
            </div>
          </FloralBorderWrapper>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <FloralBorderWrapper
            corners={true}
            sides={false}
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[--color-charcoal]">
                Events ({store.events.length})
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => store.goToStep(2)}
              >
                Edit
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              {store.events.map((event, index) => (
                <div
                  key={`${event.event_name}-${index}`}
                  className="rounded-lg border border-gray-100 p-2.5 text-sm"
                >
                  <p className="font-medium text-[--color-charcoal]">
                    {event.event_name}
                  </p>
                  <p className="text-gray-500">
                    {event.event_date} at {event.event_time}
                  </p>
                  <p className="text-gray-500">{event.venue_name}</p>
                </div>
              ))}
            </div>
          </FloralBorderWrapper>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <FloralBorderWrapper
            corners={true}
            sides={false}
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[--color-charcoal]">
                Media ({mediaCount})
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => store.goToStep(3)}
              >
                Edit
              </Button>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {store.media.photos.slice(0, 4).map((photo) => (
                <Image
                  key={photo.path}
                  src={photo.url}
                  alt={photo.name}
                  width={180}
                  height={120}
                  unoptimized
                  className="w-full h-20 object-cover rounded-lg border border-gray-100"
                />
              ))}
              {store.media.photos.length === 0 && (
                <p className="text-xs text-gray-400 col-span-full">
                  No photo previews yet.
                </p>
              )}
            </div>
          </FloralBorderWrapper>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <FloralBorderWrapper
            corners={true}
            sides={false}
            className="glass-card rounded-2xl p-4 space-y-4"
          >
            <h2 className="text-base font-semibold text-[--color-charcoal]">
              Contact details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone number"
                type="tel"
                placeholder="9876543210"
                value={store.phone_number}
                onChange={(e) =>
                  store.updateContact({ phone_number: e.target.value })
                }
                error={errors.phone_number}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={store.email}
                onChange={(e) => store.updateContact({ email: e.target.value })}
                error={errors.email}
                required
              />
            </div>
            <Input
              label="Custom invite message"
              placeholder="Write a short message for your guests..."
              value={store.custom_message}
              onChange={(e) =>
                store.updateContact({ custom_message: e.target.value })
              }
              error={errors.custom_message}
            />
          </FloralBorderWrapper>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <FloralBorderWrapper
            corners={true}
            sides={false}
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total payable</p>
                <p className="text-3xl font-semibold text-[--color-charcoal]">
                  ₹{PRICING.basePrice}
                </p>
              </div>
              <p className="text-xs text-gray-400 text-right">
                One-time payment
                <br />
                No hidden fees
              </p>
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
      </div>
    </div>
  );
}
