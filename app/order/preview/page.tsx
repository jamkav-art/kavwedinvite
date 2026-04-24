"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/hooks/useOrderStore";
import OrderPreview from "@/components/order/OrderPreview";

export default function OrderPreviewPage() {
  const router = useRouter();
  const hasHydrated = useOrderStore((s) => s.hasHydrated);
  const couple_name_1 = useOrderStore((s) => s.couple_name_1);
  const template_slug = useOrderStore((s) => s.template_slug);

  // Rehydrate store on mount
  useEffect(() => {
    useOrderStore.persist.rehydrate();
  }, []);

  // Guard: if no essential data after hydration, redirect back to /order
  useEffect(() => {
    if (hasHydrated && (!couple_name_1 || !template_slug)) {
      router.replace("/order");
    }
  }, [hasHydrated, couple_name_1, template_slug, router]);

  // Show nothing while hydrating or guarding
  if (!hasHydrated || !couple_name_1 || !template_slug) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[--color-cream]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[--color-terracotta] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[--color-sage] animate-pulse">
            Loading preview...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[--color-cream]">
      <OrderPreview />
    </div>
  );
}
