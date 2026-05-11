"use client";

import React from "react";

/* ──────────────────────────────────────────────────────────────
 *  WedInviter Logo — Heart-Infinity Symbol
 *  A custom SVG combining a heart silhouette with an infinity
 *  loop crossover, filled with the brand's multi-color gradient.
 *
 *  Approved size tokens:
 *    20 | 32 (navbar) | 40 (footer) | 48 (card headers)
 *    | 80 (auth/modals) | 120 (hero) | 200 (marketing/OG)
 *
 *  Usage:
 *    <WedInviterLogo size={32} />
 *    <WedInviterLogoWithText size={40} />
 * ────────────────────────────────────────────────────────────── */

type LogoProps = {
  size?: number;
  className?: string;
};

const GRADIENT_ID = "wedinviter-logo-grad";
const DROP_SHADOW_ID = "wedinviter-logo-shadow";

/* ── Heart-Infinity path definitions ──
 *
 *  Two symmetrical teardrop lobes that share a common bottom
 *  point and cross over at centre, forming both a heart
 *  silhouette and an ∞ (infinity) motif.
 *
 *  Left lobe  — starts bottom, sweeps up-left, loops top-left,
 *               crosses RIGHT through centre, returns to bottom
 *  Right lobe — starts bottom, sweeps up-right, loops top-right,
 *               crosses LEFT through centre, returns to bottom
 */
const LEFT_LOBE =
  "M50,85 C30,85 12,68 12,45 C12,22 30,8 50,18 C55,22 58,32 55,40 C53,52 50,68 50,85 Z";

const RIGHT_LOBE =
  "M50,85 C70,85 88,68 88,45 C88,22 70,8 50,18 C45,22 42,32 45,40 C47,52 50,68 50,85 Z";

/* ── Gradient definition ── */
const LOGO_GRADIENT = (
  <linearGradient id={GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#C9A962" /> {/* Gold */}
    <stop offset="33%" stopColor="#E8638C" /> {/* Rose */}
    <stop offset="66%" stopColor="#C0185F" /> {/* Magenta */}
    <stop offset="100%" stopColor="#F7E7CE" /> {/* Champagne */}
  </linearGradient>
);

/* ── Subtle drop shadow ── */
const LOGO_FILTER = (
  <filter id={DROP_SHADOW_ID}>
    <feDropShadow
      dx="0"
      dy="2"
      stdDeviation="3"
      floodColor="#C9A962"
      floodOpacity="0.3"
    />
  </filter>
);

/* ══════════════════════════════════════════════════════════════
 *  WedInviterLogo — symbol only
 * ══════════════════════════════════════════════════════════════ */
export function WedInviterLogo({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="WedInviter logo"
      role="img"
    >
      <defs>
        {LOGO_GRADIENT}
        {LOGO_FILTER}
      </defs>

      {/* Left lobe */}
      <path
        d={LEFT_LOBE}
        fill={`url(#${GRADIENT_ID})`}
        filter={`url(#${DROP_SHADOW_ID})`}
      />

      {/* Right lobe */}
      <path
        d={RIGHT_LOBE}
        fill={`url(#${GRADIENT_ID})`}
        filter={`url(#${DROP_SHADOW_ID})`}
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
 *  WedInviterLogoWithText — symbol + "Wed✦Inviter" text
 * ══════════════════════════════════════════════════════════════ */
export function WedInviterLogoWithText({ size = 32, className }: LogoProps) {
  const gap = Math.round(size * 0.35);
  const textSize = Math.round(size * 0.55);

  return (
    <span
      className={`inline-flex items-center ${className ?? ""}`}
      style={{ gap }}
      aria-label="WedInviter"
    >
      <WedInviterLogo size={size} />
      <span
        className="logo-gradient-text font-[--font-cormorant] font-semibold tracking-wide whitespace-nowrap"
        style={{ fontSize: textSize }}
      >
        Wed✦Inviter
      </span>
    </span>
  );
}
