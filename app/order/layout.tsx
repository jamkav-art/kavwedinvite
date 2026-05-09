import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Your Wedding Invitation",
  description:
    "Design your premium digital wedding invitation in a few simple steps. Romantic, cinematic, and personalized.",
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="order-wizard min-h-screen bg-[--wiz-bg-start]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[--wiz-bg-start]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="font-[var(--font-cormorant)] text-xl font-semibold text-[var(--wiz-accent-gold)] tracking-wide"
            aria-label="WedInviter home"
          >
            WedInviter
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-[var(--wiz-text-muted)]">
              All features included
            </span>
            <span className="bg-[var(--wiz-accent-gold)] text-[var(--wiz-bg-start)] px-3 py-1 rounded-full text-xs font-semibold">
              ₹399 one-time
            </span>
          </div>
        </div>
      </header>

      {/* Main content — full bleed, no max-width constraint since wizard is full-screen */}
      <main className="min-h-[calc(100vh-57px)]">{children}</main>
    </div>
  );
}
