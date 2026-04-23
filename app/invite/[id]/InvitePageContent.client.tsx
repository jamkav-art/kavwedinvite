"use client";

import { useState } from "react";
import { PreLoader } from "@/components/invite/PreLoader";
import { HeroSection } from "@/components/invite/HeroSection";
import { SaveTheDateVideo } from "@/components/invite/SaveTheDateVideo";
import CountdownTimer from "@/components/invite/CountdownTimer";
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

  // Map data for components
  const couple = {
    name1: order.couple_name_1,
    name2: order.couple_name_2,
  };
  const weddingDate = order.wedding_date;
  const inviteId = order.invite_id;
  const inviteUrl = `${APP_URL}/invite/${inviteId}`;
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
      />
      <InviteScrollAnimations />

      <PreLoader
        templateColor={template.colors.primary}
        onComplete={() => setShowContent(true)}
      />

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

            <div id="countdown">
              <CountdownTimer
                weddingDate={weddingDate}
                accentColor={template.colors.primary}
              />
            </div>

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

            <div id="rsvp">
              <RSVPForm
                inviteId={inviteId}
                primaryColor={template.colors.primary}
                secondaryColor={template.colors.secondary}
              />
            </div>

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
    </main>
  );
}
