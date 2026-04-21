import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  title: {
    default: "WedInviter — Premium Digital Wedding Invitations",
    template: "%s | WedInviter",
  },
  description:
    "Create stunning digital wedding invitations in minutes. 8 premium templates, WhatsApp sharing, live RSVP. ₹699 one-time.",
  metadataBase: new URL(APP_URL),
  keywords: [
    "digital wedding invitation",
    "online wedding invite",
    "wedding e-invite",
    "WhatsApp wedding invitation",
    "wedding invitation India",
    "digital shaadi card",
    "wedding invitation online",
  ],
  authors: [{ name: "WedInviter" }],
  creator: "WedInviter",
  openGraph: {
    type: "website",
    siteName: "WedInviter",
    title: "WedInviter — Premium Digital Wedding Invitations",
    description:
      "Create stunning digital wedding invitations in minutes. 8 premium templates, WhatsApp sharing, live RSVP. ₹699 one-time.",
    url: APP_URL,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "WedInviter — Premium Digital Wedding Invitations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WedInviter — Premium Digital Wedding Invitations",
    description:
      "Create stunning digital wedding invitations in minutes. 8 premium templates, WhatsApp sharing, live RSVP. ₹699 one-time.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col font-[--font-inter] bg-[--color-cream] text-[--color-charcoal]"
      >
        {children}
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
