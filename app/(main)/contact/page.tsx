import type { Metadata } from "next";
import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact Us — Let's Create Your Dream Wedding Invite",
  description:
    "Chat with WedInviter on WhatsApp at +91 98462 24086 or email info@wasleen.com. We help couples create stunning digital wedding invitations with love. Response in under 2 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact WedInviter — Let's Weave Your Love Story Together",
    description:
      "Reach us on WhatsApp at +91 98462 24086 or email info@wasleen.com. Your dream wedding invite is one message away. 💌",
    url: "/contact",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
