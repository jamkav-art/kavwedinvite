import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import SuccessContent from "./SuccessContent.client";

/**
 * Anniversary Quiz — Post‑payment success page.
 * Shows shareable quiz link, WhatsApp share, Preview as Partner, email confirmation.
 * Soul Certificate celebration theme (Full colour).
 */
export const metadata: Metadata = {
  title: "Your Quiz is Live! 💫 | WedInviter",
  description:
    "Your anniversary quiz is ready to share. Send the link to your partner and see how well they know you!",
  openGraph: {
    title: "Your Anniversary Quiz is Live! 💫",
    description:
      "Share the quiz link with your partner and discover your Soul-Sync score!",
    url: "/wed-anniversary-wish/success/",
    siteName: "WedInviter",
    type: "website",
    images: [
      {
        url: "/og-anniversary.png",
        width: 1200,
        height: 630,
        alt: "WedInviter Anniversary Quiz — Your Quiz is Live!",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Anniversary Quiz is Live! 💫",
    description:
      "Share the quiz link with your partner and discover your Soul-Sync score!",
    images: ["/og-anniversary.png"],
  },
  robots: {
    index: false, // Don't index success pages
    follow: false,
  },
};

export default function AnniversarySuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1040] via-[#2D1A60] to-[#1A1040] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-[#C4497C] border-t-transparent animate-spin" />
            <p className="text-[#F5C6DA]/60 text-sm">Loading your quiz...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
