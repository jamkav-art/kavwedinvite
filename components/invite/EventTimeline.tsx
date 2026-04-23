"use client";

import { useRef, useCallback } from "react";

interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
  venueName: string;
  venueAddress: string;
  mapLink?: string;
}

interface EventTimelineProps {
  events: Event[];
  templateColor: string;
}

function getEventIcon(eventName: string) {
  const name = eventName.toLowerCase();
  if (name.includes("mehendi")) return "📿";
  if (name.includes("sangeet")) return "🎵";
  if (name.includes("haldi")) return "🌼";
  if (name.includes("wedding")) return "💍";
  if (name.includes("reception")) return "🥂";
  return "✨";
}

function getActiveEventIndex(events: Event[]): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = 0; i < events.length; i++) {
    const eventDate = new Date(events[i].date);
    eventDate.setHours(0, 0, 0, 0);
    if (eventDate >= now) return i;
  }
  return events.length - 1;
}

function buildIcs(event: Event) {
  const start = new Date(
    `${event.date}T${(event.time || "12:00").slice(0, 5)}:00`,
  );
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const dt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  const location = [event.venueName, event.venueAddress]
    .filter(Boolean)
    .join(", ");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WedInviter//Invite//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@wedinviter`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(start)}`,
    `DTEND:${dt(end)}`,
    `SUMMARY:${event.name.replace(/\\/g, "\\\\").replace(/,/g, "\\,")}`,
    `LOCATION:${location.replace(/\\/g, "\\\\").replace(/,/g, "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export const EventTimeline = ({
  events,
  templateColor,
}: EventTimelineProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndex = getActiveEventIndex(events);

  const scrollTo = useCallback((index: number) => {
    scrollRef.current?.children[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, []);

  const handleAddToCalendar = useCallback((event: Event) => {
    const ics = buildIcs(event);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.name.replace(/\s/g, "_")}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="py-16 px-0 max-w-4xl mx-auto">
      <h2
        className="text-3xl md:text-4xl text-center mb-10 font-serif px-6"
        style={{ color: templateColor }}
      >
        Celebrate With Us
      </h2>

      {/* Scroll indicator dots */}
      <div className="flex justify-center gap-2 mb-6 px-6">
        {events.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            className="transition-all duration-300"
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 8,
              borderRadius: 999,
              background:
                i === activeIndex ? templateColor : `${templateColor}33`,
            }}
            aria-label={`Scroll to event ${i + 1}`}
          />
        ))}
      </div>

      {/* Horizontal scroll-snap container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {events.map((event, index) => {
          const isActive = index === activeIndex;
          return (
            <article
              key={event.id}
              className="snap-start shrink-0 w-[85vw] sm:w-[400px] lg:w-[420px] bg-white rounded-2xl shadow-lg border border-black/5 overflow-hidden transition-shadow duration-300 hover:shadow-xl"
              style={{
                borderLeftColor: templateColor,
                borderLeftWidth: 4,
                boxShadow: isActive
                  ? `0 0 0 2px ${templateColor}, 0 8px 30px ${templateColor}30`
                  : undefined,
              }}
            >
              {/* Card header */}
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="text-4xl shrink-0">
                    {getEventIcon(event.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="text-xl sm:text-2xl font-serif font-semibold truncate"
                        style={{ color: templateColor }}
                      >
                        {event.name}
                      </h3>
                      {isActive && (
                        <span
                          className="shrink-0 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                          style={{
                            background: `${templateColor}18`,
                            color: templateColor,
                          }}
                        >
                          Next
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-black/60">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {event.time && ` • ${event.time}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Venue info */}
              <div className="px-5 sm:px-6 pb-2">
                <div className="rounded-xl bg-black/[0.03] p-3.5 border border-black/5">
                  <p className="text-[10px] uppercase tracking-widest text-black/40 font-medium">
                    Venue
                  </p>
                  <p className="mt-1 text-sm font-medium text-black/80">
                    {event.venueName}
                  </p>
                  <p className="mt-0.5 text-sm text-black/60">
                    {event.venueAddress}
                  </p>
                </div>
              </div>

              {/* iOS-style pill buttons */}
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleAddToCalendar(event)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.97]"
                  style={{
                    background: templateColor,
                    color: "#fff",
                    boxShadow: `0 4px 14px ${templateColor}40`,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Save
                </button>
                {event.mapLink ? (
                  <a
                    href={event.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.97] border-2"
                    style={{
                      borderColor: templateColor,
                      color: templateColor,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Directions
                  </a>
                ) : (
                  <span className="flex-1 text-xs text-black/40 self-center text-center">
                    No map link
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
