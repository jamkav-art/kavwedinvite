import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const cormorant = localFont({
  src: [
    {
      path: "../public/fonts/CormorantGaramond-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  title: {
    default: "WedInviter — Premium Digital Wedding Invitations",
    template: "%s | WedInviter",
  },
  description:
    "Create stunning digital wedding invitations in minutes. 8 premium templates, WhatsApp sharing, live RSVP. ₹399 one-time.",
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
      "Create stunning digital wedding invitations in minutes. 8 premium templates, WhatsApp sharing, live RSVP. ₹399 one-time.",
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
      "Create stunning digital wedding invitations in minutes. 8 premium templates, WhatsApp sharing, live RSVP. ₹399 one-time.",
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
      <body className="min-h-full flex flex-col font-[--font-inter] bg-[--color-cream] text-[--color-charcoal]">
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
