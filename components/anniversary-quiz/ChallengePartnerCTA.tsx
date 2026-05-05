"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ChallengePartnerCTAProps {
  coupleName1: string;
  coupleName2: string;
  quizId: string;
  inviteId: string;
}

export default function ChallengePartnerCTA({
  coupleName1,
  coupleName2,
  quizId,
  inviteId,
}: ChallengePartnerCTAProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quizUrl = `${window.location.origin}/quiz/${inviteId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(quizUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = quizUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `💫 Soul-Sync Quiz for ${coupleName1} & ${coupleName2}!\n\nThink you know ${coupleName1} better? Take the challenge: ${quizUrl}\n\nBuilt with ❤️ by WedInviter`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="text-center space-y-4">
      {/* Animated Gradient Heading with Zoom */}
      <motion.h3
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="font-serif text-lg font-bold challenge-heading-grad"
      >
        Challenge {coupleName2} 💕
      </motion.h3>
      <p className="text-sm text-gray-400">
        Think {coupleName2} knows {coupleName1} better? Create their challenge
        quiz and find out who scores higher!
      </p>

      {error && (
        <p className="text-xs text-red-400 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {/* ═══ SINGLE CHALLENGE BUTTON ═══ */}
        {/* Animated gradient background + floating petals inside + links to quiz creation */}
        <Link
          href="/wed-anniversary-wish"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[2]"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="challenge-btn-main relative w-full px-5 py-4 rounded-xl font-bold text-sm text-white overflow-hidden"
          >
            {/* ── Animated Gradient Background ── */}
            <span className="absolute inset-0 bg-gradient-to-r from-[--color-magenta] via-[--color-rose] to-[--color-gold] bg-[length:200%_200%] animate-grad-shift" />

            {/* ── Floating Petals ── */}
            <svg
              className="challenge-petal absolute top-0 left-[12%] w-3 h-3"
              viewBox="0 0 20 20"
              fill="#ffd700"
              style={{ animationDelay: "0s", opacity: 0.5 }}
            >
              <path d="M10 0c0 0 2 6 2 10s-2 10-2 10-2-6-2-10 2-10 2-10z" />
            </svg>
            <svg
              className="challenge-petal absolute top-0 left-[35%] w-2.5 h-2.5"
              viewBox="0 0 20 20"
              fill="#fff"
              style={{ animationDelay: "0.8s", opacity: 0.4 }}
            >
              <path d="M10 0c0 0 2 6 2 10s-2 10-2 10-2-6-2-10 2-10 2-10z" />
            </svg>
            <svg
              className="challenge-petal absolute top-0 left-[60%] w-3.5 h-3.5"
              viewBox="0 0 20 20"
              fill="#ffb6c1"
              style={{ animationDelay: "1.6s", opacity: 0.45 }}
            >
              <path d="M10 0c0 0 2 6 2 10s-2 10-2 10-2-6-2-10 2-10 2-10z" />
            </svg>
            <svg
              className="challenge-petal absolute top-0 left-[82%] w-2 h-2"
              viewBox="0 0 20 20"
              fill="#ffd700"
              style={{ animationDelay: "2.4s", opacity: 0.5 }}
            >
              <path d="M10 0c0 0 2 6 2 10s-2 10-2 10-2-6-2-10 2-10 2-10z" />
            </svg>

            {/* ── Floating Flowers ── */}
            <svg
              className="challenge-flower absolute left-[5%] w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="1.5"
              style={{ animationDelay: "0.4s", opacity: 0.3 }}
            >
              <circle cx="12" cy="8" r="3" fill="#ffb6c1" stroke="none" />
              <circle cx="8" cy="14" r="3" fill="#ffd700" stroke="none" />
              <circle cx="16" cy="14" r="3" fill="#ffb6c1" stroke="none" />
              <circle cx="12" cy="12" r="2" fill="#fff" stroke="none" />
            </svg>
            <svg
              className="challenge-flower absolute right-[8%] w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="1.5"
              style={{ animationDelay: "1.8s", opacity: 0.25 }}
            >
              <circle cx="12" cy="8" r="3" fill="#ffd700" stroke="none" />
              <circle cx="8" cy="14" r="3" fill="#ffb6c1" stroke="none" />
              <circle cx="16" cy="14" r="3" fill="#ffd700" stroke="none" />
              <circle cx="12" cy="12" r="2" fill="#fff" stroke="none" />
            </svg>

            {/* ── Button Text ── */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Challenge your {coupleName1}
            </span>
          </motion.button>
        </Link>

        {/* Copy Link Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCopyLink}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-[--color-gold]/30 bg-[--color-gold]/5 text-sm font-semibold text-[--color-charcoal] hover:bg-[--color-gold]/10 hover:border-[--color-gold]/50 transition-all"
        >
          {copied ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Copied!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Copy Link
            </span>
          )}
        </motion.button>
      </div>

      {/* WhatsApp Share */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleWhatsAppShare}
        className="w-full px-5 py-3 rounded-xl font-semibold text-sm text-white bg-green-500 hover:bg-green-600 transition-all shadow-md"
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share on WhatsApp
        </span>
      </motion.button>
    </div>
  );
}
