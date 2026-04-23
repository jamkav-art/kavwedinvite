"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

export const EventTimeline = ({
  events,
  templateColor,
}: EventTimelineProps) => {
  const timelineRef = useRef<SVGLineElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  // Determine which event is active (today or next upcoming)
  const getActiveEventIndex = (): number => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    for (let i = 0; i < events.length; i++) {
      const eventDate = new Date(events[i].date);
      eventDate.setHours(0, 0, 0, 0);
      if (eventDate >= now) return i;
    }
    return -1; // no upcoming events
  };

  const activeIndex = getActiveEventIndex();

  useEffect(() => {
    const triggers = triggersRef.current;
    // Clear previous triggers
    triggers.forEach((trigger) => trigger.kill());
    triggers.length = 0;

    // Draw timeline
    if (timelineRef.current) {
      const timelineTween = gsap.fromTo(
        timelineRef.current,
        { attr: { y2: "0%" } },
        {
          attr: { y2: "100%" },
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        },
      );
      if (timelineTween.scrollTrigger) {
        triggers.push(timelineTween.scrollTrigger);
      }
    }

    // Animate cards
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const cardTween = gsap.fromTo(
        card,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
      if (cardTween.scrollTrigger) {
        triggers.push(cardTween.scrollTrigger);
      }
    });

    // Cleanup ScrollTrigger instances
    return () => {
      triggers.forEach((trigger) => trigger.kill());
      triggers.length = 0;
    };
  }, [events]);

  const getEventIcon = (eventName: string) => {
    const name = eventName.toLowerCase();
    if (name.includes("mehendi")) return "📿";
    if (name.includes("sangeet")) return "🎵";
    if (name.includes("haldi")) return "🌼";
    if (name.includes("wedding")) return "💍";
    if (name.includes("reception")) return "🥂";
    return "✨";
  };

  const downloadCalendar = (event: Event) => {
    // Generate .ics file
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${new Date(event.date).toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:${event.name}
LOCATION:${event.venueName}, ${event.venueAddress}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.name.replace(/\s/g, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      <h2
        className="text-3xl md:text-4xl text-center mb-12 font-serif"
        style={{ color: templateColor }}
      >
        Celebrate With Us
      </h2>

      <div className="relative">
        {/* Timeline SVG */}
        <svg
          className="absolute left-8 top-0 h-full"
          width="2"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
        >
          <line
            ref={timelineRef}
            x1="1"
            y1="0%"
            x2="1"
            y2="0%"
            stroke={templateColor}
            strokeWidth="2"
          />
        </svg>

        {/* Events */}
        <div className="space-y-12 pl-20">
          {events.map((event, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={event.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="relative"
              >
                {/* Dot with active highlight */}
                <div
                  className="absolute -left-[4.5rem] top-4 w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: templateColor,
                    boxShadow: isActive
                      ? `0 0 0 4px ${templateColor}, 0 0 0 8px ${templateColor}40`
                      : undefined,
                  }}
                />

                {/* Card */}
                <div
                  className="bg-white rounded-xl shadow-lg p-6 border-l-4 transition-all duration-300"
                  style={{
                    borderLeftColor: templateColor,
                    boxShadow: isActive
                      ? `0 0 0 2px ${templateColor}, 0 4px 20px ${templateColor}40`
                      : undefined,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{getEventIcon(event.name)}</span>
                    <div className="flex-1">
                      <h3
                        className="text-2xl font-serif mb-2"
                        style={{ color: templateColor }}
                      >
                        {event.name}
                      </h3>
                      <p className="text-gray-700 mb-1">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        {event.time && `, ${event.time}`}
                      </p>
                      <p className="text-gray-600 mb-4">
                        {event.venueName}
                        <br />
                        {event.venueAddress}
                      </p>

                      {/* Buttons */}
                      <div className="flex gap-3 flex-wrap">
                        {event.mapLink && (
                          <a
                            href={event.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg border-2 hover:bg-opacity-10 transition-colors text-sm"
                            style={{
                              borderColor: templateColor,
                              color: templateColor,
                            }}
                          >
                            📍 View on Map
                          </a>
                        )}
                        <button
                          onClick={() => downloadCalendar(event)}
                          className="px-4 py-2 rounded-lg border-2 hover:bg-opacity-10 transition-colors text-sm"
                          style={{
                            borderColor: templateColor,
                            color: templateColor,
                          }}
                        >
                          📅 Add to Calendar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
