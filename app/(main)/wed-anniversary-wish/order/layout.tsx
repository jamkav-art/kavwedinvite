import type { Metadata } from "next";
import Link from "next/link";
import { ANNIVERSARY_PRICE_DISPLAY } from "@/lib/anniversary-constants";

export const metadata: Metadata = {
  title: "Create Your Anniversary Quiz — WedInviter",
  description:
    "Build a personalized anniversary quiz in 4 easy steps. ₹399 one-time. Surprise your partner with a magical love experience.",
};

export default function AnniversaryOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[--color-blush] via-white to-[--color-cream]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/wed-anniversary-wish"
            className="font-[var(--font-cormorant)] text-xl font-semibold anniversary-gradient-text tracking-wide"
            aria-label="WedInviter Anniversary Quiz"
          >
            WedInviter
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-gray-400">
              All features included
            </span>
            <span className="bg-[--color-magenta] text-white px-3 py-1 rounded-full text-xs font-semibold">
              {ANNIVERSARY_PRICE_DISPLAY} one-time
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 pt-8 pb-24">{children}</main>
    </div>
  );
}
