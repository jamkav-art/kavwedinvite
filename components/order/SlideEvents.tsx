"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useOrderStore } from "@/hooks/useOrderStore";
import type { EventFormData } from "@/types/order.types";
import EventForm from "./EventForm";
import SlideSlideWrapper from "./SlideSlideWrapper";

const QUICK_ADD_EVENTS = [
  { name: "Mehendi", emoji: "🌺" },
  { name: "Haldi", emoji: "🟡" },
  { name: "Sangeet", emoji: "🎶" },
  { name: "Wedding", emoji: "💒" },
  { name: "Reception", emoji: "🥂" },
];

function makeEmptyEvent(name = ""): EventFormData {
  return {
    event_name: name,
    event_date: "",
    event_time: "",
    venue_name: "",
    venue_address: "",
    venue_city: "",
    venue_map_link: "",
  };
}

export default function SlideEvents() {
  const events = useOrderStore((s) => s.events);
  const addEvent = useOrderStore((s) => s.addEvent);
  const updateEvent = useOrderStore((s) => s.updateEvent);
  const removeEvent = useOrderStore((s) => s.removeEvent);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);

  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleQuickAdd = (name: string) => {
    const exists = events.some(
      (e) => e.event_name.toLowerCase() === name.toLowerCase(),
    );
    if (!exists) {
      addEvent(makeEmptyEvent(name));
    }
  };

  const handleAddCustom = () => {
    addEvent(makeEmptyEvent("Custom Event"));
    setShowCustomForm(true);
  };

  const isValid = events.length >= 1;

  return (
    <SlideSlideWrapper
      emoji="🎉"
      heading="Your wedding events"
      onContinue={nextStep}
      onBack={prevStep}
      showBack
      continueDisabled={!isValid}
    >
      <div className="w-full space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {/* Quick-add pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {QUICK_ADD_EVENTS.map((ev) => {
            const exists = events.some(
              (e) => e.event_name.toLowerCase() === ev.name.toLowerCase(),
            );
            return (
              <motion.button
                key={ev.name}
                onClick={() => handleQuickAdd(ev.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={exists}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${
                    exists
                      ? "bg-[var(--wiz-accent-gold)]/20 text-[var(--wiz-accent-gold)] cursor-default opacity-60"
                      : "bg-white/10 text-[var(--wiz-text-secondary)] hover:bg-white/20 hover:text-[var(--wiz-accent-gold)]"
                  }
                `}
              >
                {ev.emoji} {ev.name}
              </motion.button>
            );
          })}
          <motion.button
            onClick={handleAddCustom}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-[var(--wiz-text-secondary)] hover:bg-white/20 hover:text-[var(--wiz-accent-gold)] transition-all"
          >
            + Custom
          </motion.button>
        </div>

        {/* Event cards */}
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <EventForm
              event={event}
              index={i}
              onUpdate={updateEvent}
              onRemove={removeEvent}
            />
          </motion.div>
        ))}
      </div>
    </SlideSlideWrapper>
  );
}
