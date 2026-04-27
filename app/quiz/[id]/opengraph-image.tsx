import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: { id: string } };

const SCORE_TIER_CONFIG: Record<string, { emoji: string; color: string }> = {
  "beautiful-strangers": { emoji: "🌟", color: "#94A3B8" },
  "twin-flames": { emoji: "🔥", color: "#F97316" },
  architects: { emoji: "🏛️", color: "#C9A962" },
  "unified-soul": { emoji: "💫", color: "#D946EF" },
};

export default async function Image({ params }: Props) {
  const adminClient = createAdminClient();

  const { data: quiz } = await adminClient
    .from("quiz_sessions")
    .select("couple_name_1, couple_name_2, couple_photo_url, invite_id")
    .eq("invite_id", params.id)
    .maybeSingle();

  const name1 = quiz?.couple_name_1 ?? "Someone";
  const name2 = quiz?.couple_name_2 ?? "Special";

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
          "linear-gradient(135deg, #FDF2F8 0%, #FEF3C7 50%, #FFF7ED 100%)",
        fontFamily: "Georgia, serif",
        position: "relative",
      }}
    >
      {/* Decorative border */}
      <div
        style={{
          position: "absolute",
          inset: 24,
          border: "2px solid #C9A962",
          borderRadius: 12,
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 32,
          border: "1px solid #C9A962",
          borderRadius: 8,
          opacity: 0.2,
        }}
      />

      {/* Emoji */}
      <div style={{ fontSize: 72, marginBottom: 20 }}>💫</div>

      {/* Headline */}
      <p
        style={{
          fontSize: 18,
          color: "#C9A962",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          margin: "0 0 12px",
        }}
      >
        Soul-Sync Quiz
      </p>

      {/* Couple Names */}
      <h1
        style={{
          fontSize: name1.length + name2.length > 20 ? 56 : 72,
          color: "#1A0A00",
          fontWeight: 600,
          margin: "0 0 16px",
          textAlign: "center",
          lineHeight: 1.1,
          padding: "0 60px",
        }}
      >
        {name1} & {name2}
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: 22,
          color: "#8B4513",
          margin: 0,
          letterSpacing: "0.05em",
        }}
      >
        How well do you know them?
      </p>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
          color: "#C9A962",
          letterSpacing: "0.1em",
        }}
      >
        <span>❤️</span>
        <span>WedInviter</span>
        <span>❤️</span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
