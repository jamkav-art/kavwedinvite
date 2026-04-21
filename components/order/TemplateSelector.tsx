'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TEMPLATES } from '@/lib/templates'
import TemplatePreview from './TemplatePreview'

interface TemplateSelectorProps {
  selectedSlug: string | null
  onSelect: (slug: string) => void
}

export default function TemplateSelector({ selectedSlug, onSelect }: TemplateSelectorProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {TEMPLATES.map((template, index) => {
          const isSelected = selectedSlug === template.slug
          return (
            <motion.button
              key={template.slug}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(template.slug)}
              aria-pressed={isSelected}
              aria-label={`Select ${template.name} template`}
              className="relative text-left rounded-xl overflow-hidden focus-visible:outline-none transition-shadow duration-200"
              style={{
                boxShadow: isSelected
                  ? `0 0 0 2px white, 0 0 0 4px ${template.colors.primary}, 0 8px 24px ${template.colors.primary}22`
                  : '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              {/* Miniature invite preview */}
              <TemplatePreview template={template} />

              {/* Selected checkmark overlay */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-start justify-end p-2 pointer-events-none"
                    style={{ backgroundColor: `${template.colors.primary}18` }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="rounded-full flex items-center justify-center w-6 h-6 shrink-0"
                      style={{ backgroundColor: template.colors.primary }}
                    >
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="w-3.5 h-3.5"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name + mood label */}
              <div
                className="px-2.5 py-2"
                style={{ backgroundColor: 'white', borderTop: `1px solid ${template.colors.border}33` }}
              >
                <p className="text-xs font-semibold text-[#2D2D2D] leading-tight truncate">
                  {template.name}
                </p>
                <p className="text-[10px] text-[#2D2D2D]/50 truncate mt-0.5 leading-tight">
                  {template.mood}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Selected template detail strip */}
      <AnimatePresence mode="wait">
        {selectedSlug && (() => {
          const t = TEMPLATES.find((tmpl) => tmpl.slug === selectedSlug)
          if (!t) return null
          return (
            <motion.div
              key={selectedSlug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-4 rounded-xl px-4 py-3 flex items-start gap-3"
              style={{
                backgroundColor: `${t.colors.primary}0D`,
                border: `1px solid ${t.colors.border}44`,
              }}
            >
              {/* Color swatch row */}
              <div className="flex gap-1 pt-0.5 shrink-0">
                {[t.colors.primary, t.colors.secondary, t.colors.accent].map((c, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full border border-white/60"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: t.colors.primary }}>
                  {t.name}
                </p>
                <p className="text-xs text-[#2D2D2D]/60 mt-0.5 leading-relaxed line-clamp-2">
                  {t.description}
                </p>
              </div>

              {/* Tag pills */}
              <div className="hidden sm:flex flex-wrap gap-1 shrink-0 max-w-[120px] justify-end">
                {t.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: `${t.colors.primary}18`,
                      color: t.colors.primary,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
