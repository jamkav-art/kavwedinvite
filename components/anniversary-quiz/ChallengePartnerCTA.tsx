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
  const [isCreating, setIsCreating] = useState(false);
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

  const handleChallengePartner = async () => {
    if (isCreating) return;
    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/quiz/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_quiz_id: quizId,
          taker_name: coupleName2,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create challenge");
      }

      // Navigate to the new challenge URL
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setIsCreating(false);
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
      <h3 className="font-serif text-lg text-[--color-charcoal]">
        Challenge {coupleName2} 💕
      </h3>
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
        {/* Challenge Button */}
        <motion.button
          whileTap={isCreating ? {} : { scale: 0.97 }}
          onClick={handleChallengePartner}
          disabled={isCreating}
          className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[--color-gold] to-[--color-rose] hover:opacity-90 transition-all shadow-md shadow-[--color-rose]/20 disabled:opacity-60"
        >
          {isCreating ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating...
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              Challenge {coupleName2}
            </span>
          )}
        </motion.button>

        {/* Copy Link Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCopyLink}
          className="flex-1 px-5 py-3 rounded-xl border-2 border-[--color-gold]/30 bg-[--color-gold]/5 text-sm font-semibold text-[--color-charcoal] hover:bg-[--color-gold]/10 hover:border-[--color-gold]/50 transition-all"
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

      {/* New: Challenge [coupleName1] button — create their own quiz */}
      <Link
        href="/wed-anniversary-wish"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full px-5 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[--color-magenta] via-[--color-rose] to-[--color-gold] hover:opacity-90 transition-all shadow-md shadow-[--color-magenta]/20 bg-[length:200%_100%] animate-pulse"
        >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Challenge {coupleName1} 🔄
          </span>
        </motion.button>
      </Link>

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
