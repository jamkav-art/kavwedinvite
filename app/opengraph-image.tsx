import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #FBF7F0 0%, #F7E7CE 40%, #EDD9A3 100%)",
        fontFamily: "Georgia, serif",
        position: "relative",
      }}
    >
      {/* Decorative gold borders */}
      <div
        style={{
          position: "absolute",
          inset: 24,
          border: "2px solid #C9A962",
          borderRadius: 12,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 32,
          border: "1px solid #C9A962",
          borderRadius: 8,
          opacity: 0.3,
        }}
      />

      {/* Heart-Infinity Logo SVG */}
      <svg
        width="160"
        height="160"
        viewBox="0 0 100 100"
        fill="none"
        style={{ marginBottom: 24 }}
      >
        <defs>
          <linearGradient id="og-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A962" />
            <stop offset="33%" stopColor="#E8638C" />
            <stop offset="66%" stopColor="#C0185F" />
            <stop offset="100%" stopColor="#F7E7CE" />
          </linearGradient>
          <filter id="og-shadow">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="4"
              floodColor="#C9A962"
              floodOpacity="0.35"
            />
          </filter>
        </defs>
        <path
          d="M50,85 C30,85 12,68 12,45 C12,22 30,8 50,18 C55,22 58,32 55,40 C53,52 50,68 50,85 Z"
          fill="url(#og-grad)"
          filter="url(#og-shadow)"
        />
        <path
          d="M50,85 C70,85 88,68 88,45 C88,22 70,8 50,18 C45,22 42,32 45,40 C47,52 50,68 50,85 Z"
          fill="url(#og-grad)"
          filter="url(#og-shadow)"
        />
      </svg>

      {/* Brand name */}
      <h1
        style={{
          fontSize: 64,
          color: "#1A0A00",
          fontWeight: 600,
          margin: "0 0 8px",
          letterSpacing: "0.04em",
          fontFamily: "Georgia, serif",
        }}
      >
        Wed✦Inviter
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: 26,
          color: "#8B4513",
          margin: "0 0 32px",
          letterSpacing: "0.08em",
          opacity: 0.8,
        }}
      >
        Premium Digital Wedding Invitations
      </p>

      {/* Decorative divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ width: 60, height: 1, background: "#C9A962" }} />
        <span
          style={{ fontSize: 14, color: "#C9A962", letterSpacing: "0.15em" }}
        >
          SHARE THE JOY
        </span>
        <div style={{ width: 60, height: 1, background: "#C9A962" }} />
      </div>
    </div>,
    { ...size },
  );
}
