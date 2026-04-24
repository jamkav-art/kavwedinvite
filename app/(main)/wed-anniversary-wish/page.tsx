import type { Metadata } from "next";
import HeroSection from "@/components/anniversary/HeroSection";
import VisualShowcase from "@/components/anniversary/VisualShowcase";
import HowItWorks from "@/components/anniversary/HowItWorks";
import SocialProof from "@/components/anniversary/SocialProof";
import FinalCtaSection from "@/components/anniversary/FinalCtaSection";

export const metadata: Metadata = {
  title: "Anniversary Quiz — Test How Well Your Partner Knows You | WedInviter",
  description:
    "Create a personalized anniversary quiz for your partner in just 5 minutes. A magical, interactive memory with Love Level scores. ₹399 one-time.",
  openGraph: {
    title: "Celebrate Your Love with a Personalized Anniversary Quiz",
    description:
      "Test how well they know you. Create a magical, interactive memory in just 5 minutes.",
    url: "/wed-anniversary-wish/",
    siteName: "WedInviter",
    type: "website",
    images: [
      {
        url: "/og-anniversary.png",
        width: 1200,
        height: 630,
        alt: "WedInviter Anniversary Quiz — Celebrate Your Love",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anniversary Quiz — WedInviter",
    description:
      "Create a personalized anniversary quiz. ₹399 one-time. Surprise your partner!",
    images: ["/og-anniversary.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "anniversary quiz",
    "relationship quiz",
    "love test",
    "couple quiz",
    "anniversary gift",
    "personalized quiz",
    "love level",
    "wedding anniversary wish",
  ],
};

export default function AnniversaryQuizPage() {
  return (
    <>
      <HeroSection />
      <VisualShowcase />
      <HowItWorks />
      <SocialProof />
      <FinalCtaSection />
    </>
  );
}
