# Synthetic Audio Implementation Plan

## Problem

6 background music MP3 files referenced in `lib/anniversary-music.ts` are missing from `public/sounds/`, causing 404 errors when users click play.

## Solution

Generate synthetic audio placeholders using the Web Audio API.

## Files to Create/Modify

### 1. Create [`lib/synthetic-audio.ts`](lib/synthetic-audio.ts)

Utility that uses `OfflineAudioContext` to compose short (12s) musical loops:

- **Romantic** → gentle piano-like sine arpeggios (C major 7)
- **Warm** → soft triangle-wave guitar-like strums (G major)
- **Sweet** → ascending/descending pentatonic pattern (A4)
- **Epic** → sustained sawtooth+triangle pad with filter sweep
- **Chill** → detuned lo-fi sine waves with slight wobble
- **Fun** → quick square-wave arpeggios (bollywood-style)

Exports:

- `getSyntheticAudio(trackId, mood)` → generates + caches blob URL
- `preGenerateAll(tracks)` → warms cache for all tracks

### 2. Modify [`components/anniversary-order/MusicTrackPicker.tsx`](components/anniversary-order/MusicTrackPicker.tsx)

- Import `getSyntheticAudio` and `CURATED_TRACKS` moods
- On mount, pre-generate all synthetic audio URLs
- In `handlePlay`, use the generated blob URL as the audio `src` instead of `track.src`
- Since blob URLs are generated once and cached, subsequent plays are instant

## Why This Approach

- No external dependencies
- Works offline
- Keeps existing component architecture intact
- Replaces 404-silent-failure with actual audible previews
- Easy to swap with real MP3s later by simply toggling the source
