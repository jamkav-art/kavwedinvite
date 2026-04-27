import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const SCORE_TIER_CONFIG: Record<
  string,
  { emoji: string; title: string; description: string; color: string }
> = {
  "beautiful-strangers": {
    emoji: "🌟",
    title: "The Beautiful Strangers",
    description: "A beautiful mystery waiting to unfold",
    color: "#94A3B8",
  },
  "twin-flames": {
    emoji: "🔥",
    title: "The Twin Flames",
    description: "Two souls, one flame — growing brighter",
    color: "#F97316",
  },
  architects: {
    emoji: "🏛️",
    title: "The Architects",
    description: "Built on understanding, brick by brick",
    color: "#C9A962",
  },
  "unified-soul": {
    emoji: "💫",
    title: "The Unified Soul",
    description: "Rare. Resonant. One in a million.",
    color: "#D946EF",
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const inviteId = searchParams.get("invite_id");
    const takerSessionId = searchParams.get("session_id");

    if (!inviteId) {
      return new Response("Missing invite_id", { status: 400 });
    }

    const adminClient = createAdminClient();

    // Fetch quiz session
    const { data: quiz } = await adminClient
      .from("quiz_sessions")
      .select("*")
      .eq("invite_id", inviteId)
      .single();

    if (!quiz) {
      return new Response("Quiz not found", { status: 404 });
    }

    let soulPercentage = 0;
    let soulTier = "beautiful-strangers";
    let scores: Record<string, number> = {};

    // If a taker session is specified, use that score
    if (takerSessionId) {
      const { data: takerSession } = await adminClient
        .from("quiz_taker_sessions")
        .select("*")
        .eq("id", takerSessionId)
        .single();

      if (takerSession) {
        soulPercentage = takerSession.soul_percentage;
        soulTier = takerSession.soul_tier;
        scores = takerSession.scores as Record<string, number>;
      }
    }

    const tier =
      SCORE_TIER_CONFIG[soulTier] ?? SCORE_TIER_CONFIG["beautiful-strangers"];
    const categories = [
      { key: "nostalgia", label: "Nostalgia & The Spark", emoji: "❤️" },
      { key: "playful", label: "The LOL Challenge", emoji: "😂" },
      { key: "soul", label: "Soul Layers", emoji: "🔥" },
      { key: "discovery", label: "Did You Know?", emoji: "🤔" },
      { key: "future", label: "Hopes & Challenges", emoji: "🚀" },
    ];

    return new ImageResponse(
      <div
        style={{
          width: 800,
          height: 1100,
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(180deg, #FFF7ED 0%, #FDF2F8 50%, #FEF3C7 100%)",
          fontFamily: "Georgia, serif",
          position: "relative",
          padding: 48,
        }}
      >
        {/* Decorative top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #C9A962, #F43F5E, #C9A962)",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "#C9A962",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            Soul-Sync Certificate
          </p>
          <h1
            style={{
              fontSize: 36,
              color: "#1A0A00",
              fontWeight: 600,
              margin: 0,
              textAlign: "center",
            }}
          >
            {quiz.couple_name_1}
          </h1>
          <p style={{ fontSize: 18, color: "#9CA3AF", margin: "4px 0" }}>&</p>
          <h1
            style={{
              fontSize: 36,
              color: "#1A0A00",
              fontWeight: 600,
              margin: 0,
              textAlign: "center",
            }}
          >
            {quiz.couple_name_2}
          </h1>
        </div>

        {/* Score Circle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 32,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: `conic-gradient(${tier.color} ${soulPercentage}%, #F3F4F6 ${soulPercentage}%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 40, fontWeight: 700, color: "#1A0A00" }}>
                {soulPercentage}%
              </span>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>Soul-Sync</span>
            </div>
          </div>
        </div>

        {/* Tier Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 999,
              background: `rgba(201, 169, 98, 0.1)`,
              border: `1px solid rgba(201, 169, 98, 0.2)`,
              fontSize: 16,
              fontWeight: 600,
              color: "#1A0A00",
            }}
          >
            <span>{tier.emoji}</span>
            <span>{tier.title}</span>
          </div>
        </div>
        <p
          style={{
            fontSize: 13,
            color: "#9CA3AF",
            textAlign: "center",
            margin: "0 0 24px",
          }}
        >
          {tier.description}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: "#F3F4F6", marginBottom: 24 }} />

        {/* Pattern Breakdown */}
        <p
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textAlign: "center",
            margin: "0 0 16px",
          }}
        >
          Pattern Breakdown
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {categories.map((cat) => {
            const score = scores[cat.key] ?? 0;
            return (
              <div
                key={cat.key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "#4B5563",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1A0A00",
                    }}
                  >
                    {score}%
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 999,
                    background: "#F3F4F6",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${score}%`,
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #C9A962, #F43F5E)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
            marginTop: 32,
            fontSize: 12,
            color: "#C9A962",
          }}
        >
          <span>❤️</span>
          <span>Built with love by WedInviter</span>
          <span>❤️</span>
        </div>
      </div>,
      {
        width: 800,
        height: 1100,
      },
    );
  } catch (error) {
    console.error("Error generating certificate:", error);
    return new Response("Error generating certificate", { status: 500 });
  }
}
