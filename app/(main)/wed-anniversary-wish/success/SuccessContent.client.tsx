"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { APP_URL } from "@/lib/constants";

function buildShareWhatsApp(
  quizId: string,
  coupleName1: string,
  coupleName2: string,
): string {
  const quizUrl = `${APP_URL}/quiz/${quizId}`;
  const text = encodeURIComponent(
    `💫 I created a quiz about us!\n\n${coupleName1} ❤️ ${coupleName2}\n\nTake the quiz and discover our Soul-Sync score:\n${quizUrl}\n\nMade with 💖 on WedInviter`,
  );
  return `https://wa.me/?text=${text}`;
}

export default function SuccessContent() {
  const params = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const quizId = params.get("id") ?? "";
  const coupleName1 = params.get("name1") ?? "";
  const coupleName2 = params.get("name2") ?? "";
  const quizUrl = `${APP_URL}/quiz/${quizId}`;
  const previewUrl = quizId ? `/quiz/${quizId}` : "#";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(quizUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = quizUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: Integrate with actual email delivery API
    setEmailSent(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto"
    >
      {/* ── Certificate Card (Soul Certificate theme) ── */}
      <div className="relative bg-[#FDF0F5] rounded-3xl shadow-2xl border border-[#E8B4C8] overflow-hidden">
        {/* Decorative top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-[#D4AF37] via-[#C4497C] to-[#7B5EA7]" />

        <div className="p-6 sm:p-8">
          {/* Animated checkmark icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150, delay: 0.15 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C4497C] to-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#C4497C]/30">
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                />
              </motion.svg>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1040] mb-2 leading-snug">
              Your Quiz is Live! 💫
            </h1>
            <p className="text-sm text-[#8B1A4A]/70">
              {coupleName1 && coupleName2
                ? `${coupleName1} ❤️ ${coupleName2}`
                : "Your love story quiz is ready"}
            </p>
          </motion.div>

          {/* ═══ QUIZ LINK SECTION ═══ */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-[#E8B4C8]/50 space-y-3 mb-5"
          >
            <h2 className="font-semibold text-[#1A1040] text-xs uppercase tracking-wider">
              Your quiz link
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-white rounded-xl border border-[#E8B4C8]/30 text-sm font-mono text-[#1A1040] truncate">
                {quizUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-[#C4497C] text-white hover:bg-[#8B1A4A]"
                }`}
              >
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-[#8B1A4A]/50">
              Share this link with your partner so they can take the quiz
            </p>
          </motion.div>

          {/* ═══ WHATSAPP SHARE ═══ */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mb-5"
          >
            <a
              href={buildShareWhatsApp(quizId, coupleName1, coupleName2)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-[#25D366] text-white font-semibold text-base hover:bg-[#1ebe5d] transition-colors shadow-lg shadow-[#25D366]/25"
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
              Share on WhatsApp
            </a>
          </motion.div>

          {/* ═══ PREVIEW AS PARTNER ═══ */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mb-5"
          >
            <Link
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-gradient-to-r from-[#7B5EA7] to-[#C4497C] text-white font-semibold text-sm hover:from-[#5E4580] hover:to-[#8B1A4A] transition-all shadow-lg shadow-[#7B5EA7]/25"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview as Partner
            </Link>
          </motion.div>

          {/* ═══ EMAIL CONFIRMATION ═══ */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-[#E8B4C8]/50 space-y-3"
          >
            <h2 className="font-semibold text-[#1A1040] text-xs uppercase tracking-wider">
              Get your quiz link via email
            </h2>

            {emailSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200"
              >
                <span className="text-green-500 text-lg">✓</span>
                <p className="text-sm text-green-700">
                  Quiz link sent to <strong>{email}</strong>! Check your inbox.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E8B4C8]/30 text-sm text-[#1A1040] placeholder:text-[#8B1A4A]/30 outline-none focus:border-[#C4497C] focus:ring-2 focus:ring-[#C4497C]/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={!email.trim()}
                  className="px-5 py-3 rounded-xl font-semibold text-sm bg-[#C4497C] text-white hover:bg-[#8B1A4A] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            )}
            <p className="text-xs text-[#8B1A4A]/50">
              We'll also notify you when your partner completes the quiz
            </p>
          </motion.div>

          {/* ═══ WHAT HAPPENS NEXT ═══ */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-6 p-4 rounded-2xl bg-[#1A1040]/5 border border-[#E8B4C8]/30"
          >
            <h3 className="text-xs font-semibold text-[#1A1040] uppercase tracking-wider mb-3">
              What happens next
            </h3>
            <ul className="space-y-2 text-xs text-[#8B1A4A]/70">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[#C4497C]">✦</span>
                <span>Share the link with your partner via WhatsApp</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[#D4AF37]">✦</span>
                <span>They take the quiz and get a Soul-Sync score</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[#7B5EA7]">✦</span>
                <span>
                  You'll receive their certificate — see how well they know you!
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-6"
      >
        <Link
          href="/wed-anniversary-wish"
          className="inline-block text-sm text-[#F5C6DA]/50 hover:text-[#F5C6DA] transition-colors"
        >
          ← Back to Anniversary Quiz
        </Link>
      </motion.div>
    </motion.div>
  );
}
