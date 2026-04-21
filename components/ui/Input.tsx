'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[--color-charcoal]/75"
          >
            {label}
            {props.required && (
              <span className="ml-0.5 text-[--color-magenta]/80" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={cn(
            'h-12 w-full rounded-xl border-[1.5px] bg-white/90 px-4 text-base text-[--color-charcoal]',
            'placeholder:text-[--color-charcoal]/30',
            'transition-[border-color,box-shadow] duration-200',
            'focus:outline-none focus:border-[--color-gold]/55 focus:shadow-[0_0_0_3px_rgba(201,169,98,0.18),0_0_18px_rgba(201,169,98,0.1)]',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            error
              ? 'border-[--color-terracotta]/70 focus:border-[--color-terracotta] focus:shadow-[0_0_0_3px_rgba(212,117,108,0.18)]'
              : 'border-[--color-gold]/22 hover:border-[--color-gold]/45',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-gray-500">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-[--color-terracotta]"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }
