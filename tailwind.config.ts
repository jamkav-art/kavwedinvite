// Tailwind v4 — primary theme config lives in app/globals.css via @theme {}
// This file is kept for IDE tooling and any v3-compat plugins.

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
}

export default config
