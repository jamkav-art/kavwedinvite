"use client";

// Gatekeeper has replaced the PreLoader — the invite now shows a cinematic
// monogram overlay on mount. Tapping it unlocks the Web Audio API, signals
// GlobalMusicPlayer to begin playback, and fades out to reveal content.
// CountdownTimer is rendered inside HeroSection.
// RSVP is accessed via a floating "RSVP Now" button that opens a bottom sheet.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gatekeeper } from "@/components/invite/Gatekeeper";
import { HeroSection } from "@/components/invite/HeroSection";
import { SaveTheDateVideo } from "@/components/invite/SaveTheDateVideo";
import { VoiceMessage } from "@/components/invite/VoiceMessage";
import MediaGallery from "@/components/invite/MediaGallery";
import { EventTimeline } from "@/components/invite/EventTimeline";
import RSVPForm from "@/components/invite/RSVPForm";
import ShareButtons from "@/components/invite/ShareButtons";
import GlobalMusicPlayer from "@/components/invite/GlobalMusicPlayer";
import { InviteScrollAnimations } from "@/components/invite/_InviteScrollAnimations";
import type { Order, Event as DbEvent, Media } from "@/types/database.types";
import type { TemplateConfig } from "@/types/template.types";
import { APP_URL } from "@/lib/constants";

interface InvitePageContentProps {
  order: Order;
  events: DbEvent[];
  media: Media[];
  template: TemplateConfig;
}

export function InvitePageContent({
  order,
  events,
  media,
  template,
}: InvitePageContentProps) {
  const [showContent, setShowContent] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);

  // Map data for components
  const couple = {
    name1: order.couple_name_1,
    name2: order.couple_name_2,
  };
  const weddingDate = order.wedding_date;
  const inviteId = order.invite_id;
  const customMessage = order.custom_message ?? "";

  const heroPhoto =
    media.find((m) => m.media_type === "photo")?.file_url ?? null;
  const photos = media.filter((m) => m.media_type === "photo");
  const videos = media.filter((m) => m.media_type === "video");
  const videoUrl = videos.length > 0 ? videos[0].file_url : undefined;
  const voice = media.find((m) => m.media_type === "voice");
  const audioUrl = voice?.file_url;
  const song = media.find((m) => m.media_type === "song");

  // Map events to EventTimeline shape
  const timelineEvents = events.map((event) => ({
    id: event.id,
    name: event.event_name,
    date: event.event_date,
    time: event.event_time ?? undefined,
    venueName: event.venue_name,
    venueAddress: event.venue_address,
    mapLink: event.venue_map_link ?? undefined,
  }));

  // CSS variables for template styling
  const cssVariables = {
    "--template-bg": template.colors.background,
    "--template-text": template.colors.text,
    "--template-primary": template.colors.primary,
    "--template-secondary": template.colors.secondary,
    "--template-accent": template.colors.accent,
    "--template-border": template.colors.border,
    "--pattern-opacity": template.decorations.patternOpacity,
  } as React.CSSProperties;

  return (
    <Gatekeeper
      coupleName1={order.couple_name_1}
      coupleName2={order.couple_name_2}
      template={template}
      onUnlock={() => setShowContent(true)}
    >
      <main
        style={cssVariables}
        className="min-h-screen bg-[var(--template-bg)] text-[var(--template-text)]"
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#invite-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>

        <GlobalMusicPlayer
          song={song ?? null}
          accentColor={template.colors.primary}
          play={showContent}
        />
        <InviteScrollAnimations />

        {showContent && (
          <div
            id="invite-content"
            className="relative mx-auto w-full max-w-[980px] px-4 sm:px-6 py-10 sm:py-14"
          >
            {/* Optional pattern background */}
            <div className="pointer-events-none absolute inset-0 opacity-[var(--pattern-opacity,0.06)]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, var(--template-border) 1px, transparent 0)`,
                  backgroundSize: "22px 22px",
                }}
              />
            </div>

            <div className="relative space-y-16">
              <div id="hero">
                <HeroSection
                  couple={couple}
                  weddingDate={weddingDate}
                  template={template}
                  heroPhoto={heroPhoto}
                />
              </div>

              {videoUrl && (
                <div id="save-the-date">
                  <SaveTheDateVideo
                    videoUrl={videoUrl}
                    templateColor={template.colors.primary}
                  />
                </div>
              )}

              {(audioUrl || customMessage) && (
                <div id="voice-message">
                  <VoiceMessage
                    audioUrl={audioUrl}
                    templateColor={template.colors.primary}
                    quote={customMessage}
                  />
                </div>
              )}

              {photos.length > 0 && (
                <div id="gallery">
                  <MediaGallery
                    photos={photos}
                    videos={videos}
                    voice={voice ?? null}
                    accentColor={template.colors.primary}
                  />
                </div>
              )}

              {timelineEvents.length > 0 && (
                <div id="timeline">
                  <EventTimeline
                    events={timelineEvents}
                    templateColor={template.colors.primary}
                  />
                </div>
              )}

              {/* Inline RSVP placeholder (kept for section reference) */}
              <div id="rsvp" />

              <div id="share">
                <ShareButtons
                  inviteId={inviteId}
                  coupleNames={`${order.couple_name_1} & ${order.couple_name_2}`}
                  weddingDate={weddingDate}
                  customMessage={customMessage}
                  variant={heroPhoto ? "dark" : "light"}
                />
              </div>
            </div>
          </div>
        )}

        {/* Floating RSVP Now button — visible after content is shown */}
        <AnimatePresence>
          {showContent && (
            <motion.button
              type="button"
              onClick={() => setRsvpOpen(true)}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{
                delay: 1.5,
                type: "spring",
                stiffness: 200,
                damping: 18,
              }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-bold tracking-wide uppercase shadow-2xl hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                color: "#fff",
                boxShadow: `0 8px 32px ${template.colors.primary}44`,
              }}
            >
              {/* Ring icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 18a5 5 0 00-10 0" />
                <path d="M12 2a7 7 0 00-7 7c0 5 4 8 7 10 3-2 7-5 7-10a7 7 0 00-7-7z" />
              </svg>
              RSVP Now
            </motion.button>
          )}
        </AnimatePresence>

        {/* RSVP Bottom Sheet */}
        <AnimatePresence>
          {rsvpOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="rsvp-backdrop"
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRsvpOpen(false)}
              />

              {/* Sheet */}
              <motion.div
                key="rsvp-sheet"
                className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-black/20" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-2 pb-4 border-b border-black/5">
                  <h2
                    className="text-xl font-serif font-semibold"
                    style={{ color: template.colors.primary }}
                  >
                    RSVP
                  </h2>
                  <button
                    type="button"
                    onClick={() => setRsvpOpen(false)}
                    className="rounded-full w-8 h-8 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors"
                    aria-label="Close RSVP"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* RSVP Form */}
                <div className="p-6 pt-4">
                  <RSVPForm
                    inviteId={inviteId}
                    primaryColor={template.colors.primary}
                    secondaryColor={template.colors.secondary}
                    acceptLabel="Joyfully Accept"
                    declineLabel="Regretfully Decline"
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </Gatekeeper>
  );
}
