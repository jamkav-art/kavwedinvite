"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { WHATSAPP_OWNER, APP_URL } from "@/lib/constants";

function buildOwnerWhatsApp(params: URLSearchParams): string {
  const orderId = params.get("orderId") ?? "";
  const coupleNames = params.get("coupleNames") ?? "";
  const weddingDate = params.get("weddingDate") ?? "";
  const template = params.get("template") ?? "";
  const phone = params.get("phone") ?? "";

  const text = encodeURIComponent(
    `🎊 New WedInvite Order!\n\nOrder ID: ${orderId}\nCouple: ${coupleNames}\nDate: ${weddingDate}\nTemplate: ${template}\nClient Phone: ${phone}`,
  );
  return `https://wa.me/${WHATSAPP_OWNER}?text=${text}`;
}

function buildShareWhatsApp(params: URLSearchParams): string {
  const inviteId = params.get("inviteId") ?? "";
  const message = params.get("message") ?? "";
  const inviteUrl = `${APP_URL}/invite/${inviteId}`;
  const text = encodeURIComponent(
    `${message ? message + "\n\n" : ""}View our wedding invite: ${inviteUrl}\n\n(Going live within 24 hours)`,
  );
  return `https://wa.me/?text=${text}`;
}

function SuccessContent() {
  const params = useSearchParams();

  const inviteId = params.get("inviteId") ?? "";
  const coupleNames = params.get("coupleNames") ?? "";
  const orderId = params.get("orderId") ?? "";
  const shareUrl = buildShareWhatsApp(params);
  const inviteUrl = `${APP_URL}/invite/${inviteId}`;

  useEffect(() => {
    const ownerUrl = buildOwnerWhatsApp(params);
    const timer = setTimeout(() => {
      window.open(ownerUrl, "_blank", "noopener,noreferrer");
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[--color-cream] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8 py-16">
        {/* Checkmark */}
        <div className="mx-auto w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <h1 className="font-[var(--font-cormorant)] text-4xl font-semibold text-[--color-charcoal] mb-3">
            Payment Successful!
          </h1>
          <p className="text-[--color-charcoal]/60 text-base leading-relaxed">
            Thank you{coupleNames ? `, ${coupleNames}` : ""}. Your invitation is
            being crafted with care.
          </p>
          {orderId && (
            <p className="mt-2 text-sm text-[--color-charcoal]/40">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}
        </div>

        {/* What happens next */}
        <div className="bg-white rounded-2xl p-6 text-left space-y-4 border border-black/5">
          <h2 className="font-semibold text-[--color-charcoal] text-sm uppercase tracking-wider">
            What happens next
          </h2>
          <ul className="space-y-3 text-sm text-[--color-charcoal]/70">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center flex-shrink-0 font-semibold">
                ✓
              </span>
              <span>Payment confirmed — we&apos;ve received your order</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-50 text-amber-600 text-xs flex items-center justify-center flex-shrink-0 font-semibold">
                2
              </span>
              <span>
                Our team builds your invitation within <strong>24 hours</strong>{" "}
                (you can already view it)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-50 text-amber-600 text-xs flex items-center justify-center flex-shrink-0 font-semibold">
                3
              </span>
              <span>You&apos;ll receive your invite link via WhatsApp</span>
            </li>
          </ul>
        </div>

        {/* Invite link */}
        {inviteId && (
          <div className="bg-white rounded-2xl p-6 text-left space-y-4 border border-black/5">
            <h2 className="font-semibold text-[--color-charcoal] text-sm uppercase tracking-wider">
              Your invite link
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm font-mono text-[--color-charcoal] truncate">
                {inviteUrl}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(inviteUrl)}
                className="px-4 py-3 bg-[--color-gold] text-white rounded-lg font-semibold text-sm hover:bg-[--color-gold-dark] transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-[--color-charcoal]/50 mt-2">
              You can share this link with your guests. The invite is live now.
            </p>
          </div>
        )}

        {/* Share CTA */}
        {inviteId && (
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-[#25D366] text-white font-semibold text-base hover:bg-[#1ebe5d] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.106.546 4.086 1.5 5.813L0 24l6.335-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.51-5.168-1.402l-.371-.22-3.762.983.999-3.663-.24-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Share Invite with Guests
          </a>
        )}

        <Link
          href="/"
          className="inline-block text-sm text-[--color-charcoal]/50 hover:text-[--color-charcoal] transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[--color-cream] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[--color-gold] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
