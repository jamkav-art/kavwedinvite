import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Your Invitation",
  description: "Build your premium digital wedding invitation in 4 easy steps.",
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[--color-cream]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="font-[var(--font-cormorant)] text-xl font-semibold text-[--color-charcoal] tracking-wide"
            aria-label="WedInviter home"
          >
            WedInviter
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-gray-400">
              All features included
            </span>
            <span className="bg-[--color-charcoal] text-[--color-cream] px-3 py-1 rounded-full text-xs font-semibold">
              ₹399 one-time
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 pt-8 pb-24">{children}</main>
    </div>
  );
}
