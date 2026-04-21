'use client'

import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { EventFormData } from '@/types/order.types'

interface EventFormProps {
  event: EventFormData
  index: number
  onUpdate: (index: number, event: EventFormData) => void
  onRemove: (index: number) => void
  errors?: Partial<Record<keyof EventFormData, string>>
}

export default function EventForm({
  event,
  index,
  onUpdate,
  onRemove,
  errors = {},
}: EventFormProps) {
  const set = (field: keyof EventFormData, value: string) => {
    onUpdate(index, { ...event, [field]: value })
  }

  const displayName = event.event_name || `Event ${index + 1}`

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2.5">
          <span
            className="w-6 h-6 rounded-full bg-[--color-charcoal] text-[--color-cream] text-xs font-semibold flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-[--color-charcoal] truncate max-w-[200px]">
            {displayName}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label={`Remove ${displayName}`}
          className={cn(
            'flex items-center gap-1.5 text-xs text-gray-400 px-2.5 py-1 rounded-lg',
            'hover:bg-red-50 hover:text-red-500 transition-colors duration-150'
          )}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Remove
        </button>
      </div>

      {/* Form fields */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Event Name"
            placeholder="e.g. Wedding Ceremony"
            required
            value={event.event_name}
            onChange={(e) => set('event_name', e.target.value)}
            error={errors.event_name}
          />
          <Input
            label="Date"
            type="date"
            required
            value={event.event_date}
            onChange={(e) => set('event_date', e.target.value)}
            error={errors.event_date}
          />
          <Input
            label="Time"
            type="time"
            required
            value={event.event_time}
            onChange={(e) => set('event_time', e.target.value)}
            error={errors.event_time}
          />
          <Input
            label="Venue Name"
            placeholder="e.g. The Grand Palace"
            required
            value={event.venue_name}
            onChange={(e) => set('venue_name', e.target.value)}
            error={errors.venue_name}
          />
          <Input
            label="City"
            placeholder="e.g. Mumbai"
            required
            value={event.venue_city}
            onChange={(e) => set('venue_city', e.target.value)}
            error={errors.venue_city}
          />
          <Input
            label="Address"
            placeholder="Street address, landmark..."
            value={event.venue_address}
            onChange={(e) => set('venue_address', e.target.value)}
          />
        </div>

        <Input
          label="Google Maps Link"
          type="url"
          placeholder="https://maps.google.com/..."
          value={event.venue_map_link}
          onChange={(e) => set('venue_map_link', e.target.value)}
          error={errors.venue_map_link}
          hint="Optional — helps guests navigate to the venue"
        />
      </div>
    </div>
  )
}
