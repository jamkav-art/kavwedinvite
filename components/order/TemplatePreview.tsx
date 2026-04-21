import type { TemplateConfig } from '@/types/template.types'
import type { CSSProperties } from 'react'

interface TemplatePreviewProps {
  template: TemplateConfig
}

export default function TemplatePreview({ template }: TemplatePreviewProps) {
  const { colors, name, borders } = template
  const isDouble = borders.style === 'double'

  return (
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
        style={{ height: '28%', backgroundColor: colors.primary, opacity: 0.92 }}
      />

      {/* Accent line beneath hero */}
      <div
        className="absolute inset-x-4"
        style={{
          top: 'calc(28% + 12px + 3px)',
          height: '1px',
          backgroundColor: colors.secondary,
          opacity: 0.7,
        }}
      />

      {/* Simulated couple name — wide thick bar */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: 'calc(28% + 12px + 12px)',
          width: '60%',
          height: '6px',
          borderRadius: '2px',
          backgroundColor: colors.primary,
          opacity: 0.85,
        }}
      />

      {/* Simulated subtitle — thin bar */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: 'calc(28% + 12px + 24px)',
          width: '40%',
          height: '3px',
          borderRadius: '1px',
          backgroundColor: colors.secondary,
          opacity: 0.6,
        }}
      />

      {/* Divider ornament */}
      <div
        className="absolute inset-x-6 flex items-center gap-1"
        style={{ top: 'calc(28% + 12px + 38px)' }}
      >
        <div className="flex-1 h-px" style={{ backgroundColor: colors.border, opacity: 0.5 }} />
        <div
          className="w-1.5 h-1.5 rotate-45 shrink-0"
          style={{ backgroundColor: colors.secondary, opacity: 0.7 }}
        />
        <div className="flex-1 h-px" style={{ backgroundColor: colors.border, opacity: 0.5 }} />
      </div>

      {/* Simulated event lines */}
      <div
        className="absolute inset-x-5 space-y-1.5"
        style={{ top: 'calc(28% + 12px + 52px)' }}
      >
        {[75, 60, 50].map((width, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full"
            style={{
              width: `${width}%`,
              backgroundColor: colors.text,
              opacity: 0.12,
              marginLeft: i === 0 ? 0 : 'auto',
              marginRight: i === 0 ? 'auto' : 0,
            }}
          />
        ))}
      </div>

      {/* Simulated photo grid dots */}
      <div
        className="absolute bottom-5 inset-x-4 grid grid-cols-3 gap-1"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm"
            style={{
              aspectRatio: '1',
              backgroundColor: colors.accent,
              border: `0.5px solid ${colors.border}`,
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      {/* Mood watermark — subtle */}
      <div
        className="absolute bottom-1.5 inset-x-0 text-center"
        style={{ fontSize: '4px', color: colors.text, opacity: 0.25, letterSpacing: '0.05em' }}
      >
        {name.toUpperCase()}
      </div>
    </div>
  )
}

function CornerDot({
  color,
  position,
}: {
  color: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}) {
  const posStyles: Record<typeof position, CSSProperties> = {
    'top-left': { top: 4, left: 4 },
    'top-right': { top: 4, right: 4 },
    'bottom-left': { bottom: 4, left: 4 },
    'bottom-right': { bottom: 4, right: 4 },
  }

  return (
    <div
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: color, opacity: 0.8, ...posStyles[position] }}
    />
  )
}
