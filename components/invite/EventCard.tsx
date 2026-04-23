"use client";

import { useMemo } from "react";
import type { Event } from "@/types/database.types";
import { cn } from "@/lib/utils";

type EventCardProps = {
  event: Event;
  accentColor?: string;
  className?: string;
};

function formatDate(date: string) {
  const d = new Date(date);
  if (!Number.isFinite(d.getTime())) return date;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string | null) {
  if (!time) return null;
  return time;
}

function buildMapsLink(event: Event) {
  if (event.venue_map_link) return event.venue_map_link;
  const q = [event.venue_name, event.venue_address, event.venue_city]
    .filter(Boolean)
    .join(", ");
  if (!q) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function buildIcs(event: Event) {
  const start = new Date(
    `${event.event_date}T${(event.event_time || "12:00").slice(0, 5)}:00`,
  );
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const dt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

  const location = [event.venue_name, event.venue_address, event.venue_city]
    .filter(Boolean)
    .join(", ");

  const lines = [
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
    `SUMMARY:${escapeIcsText(event.event_name)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export default function EventCard({
  event,
  accentColor,
  className,
}: EventCardProps) {
  const mapsLink = useMemo(() => buildMapsLink(event), [event]);

  const addToCalendar = () => {
    const ics = buildIcs(event);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.event_name}.ics`.replace(/[^\w.-]+/g, "_");
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-black/10 bg-white/70 p-4 sm:p-5",
        className,
      )}
      style={{ borderColor: `${accentColor ?? "var(--invite-border)"}55` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-black/45">
            Event
          </p>
          <h3 className="mt-1 font-[var(--font-cormorant)] text-xl sm:text-2xl font-semibold">
            {event.event_name}
          </h3>
          <p className="mt-2 text-sm text-black/60">
            {formatDate(event.event_date)}
            {formatTime(event.event_time)
              ? ` • ${formatTime(event.event_time)}`
              : ""}
          </p>
        </div>

        <div
          className="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
          style={{
            background: `${accentColor ?? "var(--invite-secondary)"}1a`,
            color: accentColor ?? "var(--invite-secondary)",
          }}
        >
          Save the date
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-black/10 bg-white/60 p-3">
          <p className="text-xs text-black/45">Venue</p>
          <p className="mt-1 text-sm font-medium text-black/80">
            {event.venue_name}
          </p>
          <p className="mt-0.5 text-sm text-black/60">{event.venue_address}</p>
          {event.venue_city ? (
            <p className="mt-0.5 text-sm text-black/60">{event.venue_city}</p>
          ) : null}
        </div>

        <div className="rounded-xl border border-black/10 bg-white/60 p-3">
          <p className="text-xs text-black/45">Actions</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={addToCalendar}
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                background: accentColor ?? "var(--invite-primary)",
                color: "#fff",
                boxShadow: `0 4px 14px ${accentColor ?? "var(--invite-primary)"}40`,
              }}
            >
              <svg
                className="mr-1.5"
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
            {mapsLink ? (
              <a
                href={mapsLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.97] border-2"
                style={{
                  borderColor: accentColor ?? "var(--invite-primary)",
                  color: accentColor ?? "var(--invite-primary)",
                }}
              >
                <svg
                  className="mr-1.5"
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
              <span className="text-xs text-black/45 self-center">
                No map link provided.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
