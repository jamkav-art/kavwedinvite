import type { Metadata } from "next";
import WizardContainer from "@/components/anniversary-wizard/WizardContainer";
import { APP_URL } from "@/lib/constants";

/**
 * Anniversary Order Wizard — Dark & Romantic theme.
 * Full OG + Twitter card meta tags for social sharing.
 */
export const metadata: Metadata = {
  title: "Create Your Love Story Quiz | WedInviter",
  description:
    "Build a beautiful anniversary quiz for your partner in minutes. Pick questions, select correct answers, and surprise them with a Soul-Sync Certificate. ₹399 one-time.",
  openGraph: {
    title: "Create Your Love Story Quiz — WedInviter",
    description:
      "Build a beautiful anniversary quiz for your partner. Pick questions, select correct answers, and surprise them with a Soul-Sync Certificate.",
    url: "/wed-anniversary-wish/order/",
    siteName: "WedInviter",
    type: "website",
    images: [
      {
        url: "/og-anniversary.png",
        width: 1200,
        height: 630,
        alt: "WedInviter Anniversary Quiz — Create Your Love Story Quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Your Love Story Quiz — WedInviter",
    description:
      "Build a beautiful anniversary quiz for your partner. ₹399 one-time. Soul-Sync Certificate included.",
    images: ["/og-anniversary.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "anniversary quiz creator",
    "love story quiz",
    "anniversary gift for husband",
    "anniversary gift for wife",
    "couple quiz maker",
    "relationship quiz",
    "personalized anniversary gift",
    "wedding anniversary quiz",
  ],
};

export default function AnniversaryOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1A1040] flex flex-col">
      <WizardContainer>{children}</WizardContainer>
    </div>
  );
}
