import type { TemplateConfig } from "@/types/template.types";
import type { CSSProperties } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface TemplatePreviewProps {
  template: TemplateConfig;
  coupleName1?: string;
  coupleName2?: string;
  weddingDate?: string;
  events?: Array<{
    event_name: string;
    event_date: string;
    event_time: string;
  }>;
  mediaCount?: number;
  previewLink?: string;
}

export default function TemplatePreview({
  template,
  coupleName1,
  coupleName2,
  weddingDate,
  events,
  mediaCount,
  previewLink,
}: TemplatePreviewProps) {
  const { colors, name, borders } = template;
  const isDouble = borders.style === "double";
  const hasData = coupleName1 || coupleName2 || weddingDate || events?.length;

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const openPreview = () => {
    setShowPreviewModal(true);
  };

  const closePreview = () => {
    setShowPreviewModal(false);
  };

  return (
    <>
      <div
        className="relative w-full aspect-[3/4] overflow-hidden"
        style={{ backgroundColor: colors.background }}
        aria-hidden="true"
      >
        {/* Outer border frame */}
        <div
          className="absolute inset-1.5 pointer-events-none"
          style={{
            border: `1px solid ${colors.border}`,
            opacity: 0.6,
          }}
        />
        {isDouble && (
          <div
            className="absolute inset-2.5 pointer-events-none"
            style={{
              border: `0.5px solid ${colors.border}`,
              opacity: 0.4,
            }}
          />
        )}

        {/* Corner ornaments */}
        <CornerDot color={colors.secondary} position="top-left" />
        <CornerDot color={colors.secondary} position="top-right" />
        <CornerDot color={colors.secondary} position="bottom-left" />
        <CornerDot color={colors.secondary} position="bottom-right" />

        {/* Hero band */}
        <div
          className="absolute inset-x-3 top-3"
          style={{
            height: "28%",
            backgroundColor: colors.primary,
            opacity: 0.92,
          }}
        />

        {/* Accent line beneath hero */}
        <div
          className="absolute inset-x-4"
          style={{
            top: "calc(28% + 12px + 3px)",
            height: "1px",
            backgroundColor: colors.secondary,
            opacity: 0.7,
          }}
        />

        {/* Couple names or placeholder */}
        <div
          className="absolute left-1/2 -translate-x-1/2 text-center"
          style={{
            top: "calc(28% + 12px + 8px)",
            width: "80%",
          }}
        >
          {hasData ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3
                className="font-bold text-lg leading-tight"
                style={{
                  color: colors.text,
                  fontFamily: "var(--font-cormorant)",
                  textShadow: `0 1px 2px rgba(0,0,0,0.1)`,
                }}
              >
                {coupleName1 || "Name"} & {coupleName2 || "Name"}
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: colors.secondary, opacity: 0.9 }}
              >
                {weddingDate || "Wedding Date"}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Simulated couple name — wide thick bar */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  width: "60%",
                  height: "6px",
                  borderRadius: "2px",
                  backgroundColor: colors.primary,
                  opacity: 0.85,
                }}
              />
              {/* Simulated subtitle — thin bar */}
              <div
                className="absolute left-1/2 -translate-x-1/2 mt-3"
                style={{
                  width: "40%",
                  height: "3px",
                  borderRadius: "1px",
                  backgroundColor: colors.secondary,
                  opacity: 0.6,
                }}
              />
            </>
          )}
        </div>

        {/* Divider ornament */}
        <div
          className="absolute inset-x-6 flex items-center gap-1"
          style={{ top: "calc(28% + 12px + 38px)" }}
        >
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: colors.border, opacity: 0.5 }}
          />
          <div
            className="w-1.5 h-1.5 rotate-45 shrink-0"
            style={{ backgroundColor: colors.secondary, opacity: 0.7 }}
          />
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: colors.border, opacity: 0.5 }}
          />
        </div>

        {/* Events or placeholder */}
        <div
          className="absolute inset-x-5 space-y-2"
          style={{ top: "calc(28% + 12px + 52px)" }}
        >
          {hasData && events && events.length > 0
            ? events.slice(0, 3).map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: colors.accent }}
                  />
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: colors.text }}
                    >
                      {event.event_name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.secondary, opacity: 0.8 }}
                    >
                      {event.event_date} • {event.event_time}
                    </p>
                  </div>
                </motion.div>
              ))
            : // Simulated event lines
              [75, 60, 50].map((width, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${width}%`,
                    backgroundColor: colors.text,
                    opacity: 0.12,
                    marginLeft: i === 0 ? 0 : "auto",
                    marginRight: i === 0 ? "auto" : 0,
                  }}
                />
              ))}
        </div>

        {/* Media count or placeholder */}
        <div className="absolute bottom-8 inset-x-4 text-center">
          {hasData && mediaCount !== undefined ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-2"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: colors.text }}
              >
                {mediaCount} media items
              </span>
            </motion.div>
          ) : (
            // Simulated photo grid dots
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm"
                  style={{
                    aspectRatio: "1",
                    backgroundColor: colors.accent,
                    border: `0.5px solid ${colors.border}`,
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mood watermark — subtle */}
        <div
          className="absolute bottom-1.5 inset-x-0 text-center"
          style={{
            fontSize: "4px",
            color: colors.text,
            opacity: 0.25,
            letterSpacing: "0.05em",
          }}
        >
          {name.toUpperCase()}
        </div>

        {/* Preview button overlay */}
        {hasData && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={openPreview}
              className="backdrop-blur-sm border-white/30 text-white shadow-lg"
            >
              Preview Invite
            </Button>
          </motion.div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[--color-charcoal]">
                Invitation Preview
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closePreview}
                className="rounded-full w-8 h-8 p-0"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                This is a preview of how your invite will look after payment.
                Your actual invite will be accessible via a unique link.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[--color-charcoal]">
                    Couple
                  </h4>
                  <p className="text-lg" style={{ color: colors.primary }}>
                    {coupleName1} & {coupleName2}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[--color-charcoal]">
                    Wedding Date
                  </h4>
                  <p>{weddingDate}</p>
                </div>
                {events && events.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[--color-charcoal]">
                      Events
                    </h4>
                    <ul className="list-disc pl-5">
                      {events.map((event, idx) => (
                        <li key={idx}>
                          {event.event_name} – {event.event_date} at{" "}
                          {event.event_time}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {mediaCount !== undefined && (
                  <div>
                    <h4 className="font-semibold text-[--color-charcoal]">
                      Media
                    </h4>
                    <p>{mediaCount} photos & videos</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-[--color-charcoal]">
                    Template
                  </h4>
                  <p>{name}</p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-[--color-charcoal]">
                    Your Invite Link
                  </h4>
                  <p className="text-sm text-gray-500">
                    After payment, your invite will be available at:
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                    <code className="text-sm break-all">
                      https://wedinvite.app/invite/{"<unique-id>"}
                    </code>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    You can share this link with guests, track RSVPs, and manage
                    your invite.
                  </p>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end">
              <Button
                variant="secondary"
                onClick={closePreview}
                className="mr-2"
              >
                Close
              </Button>
              <Button
                onClick={closePreview}
                style={{ backgroundColor: colors.primary }}
              >
                Looks Good
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

function CornerDot({
  color,
  position,
}: {
  color: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const posStyles: Record<typeof position, CSSProperties> = {
    "top-left": { top: 4, left: 4 },
    "top-right": { top: 4, right: 4 },
    "bottom-left": { bottom: 4, left: 4 },
    "bottom-right": { bottom: 4, right: 4 },
  };

  return (
    <div
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: color, opacity: 0.8, ...posStyles[position] }}
    />
  );
}
