/**
 * Synthetic Audio Generator
 *
 * Generates short placeholder music tracks using the Web Audio API.
 * Each track mood produces a distinct tonal pattern so users get
 * a real auditory preview while choosing their background music.
 *
 * Tracks are ~12 seconds long, generated once and cached as Blob URLs.
 */

const TRACK_DURATION = 12; // seconds
const SAMPLE_RATE = 44100;

/* ── Cached blob URLs ─────────────────────────────────────── */
const cache = new Map<string, string>();

/* ── Utility: float32 → WAV blob ──────────────────────────── */
function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");

  // fmt chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data chunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/* ── Generate audio buffer per mood ───────────────────────── */
async function generateBuffer(
  ctx: OfflineAudioContext,
  mood: string,
): Promise<AudioBuffer> {
  const sr = ctx.sampleRate;
  const len = ctx.length;

  switch (mood) {
    case "Romantic":
      renderRomantic(ctx, sr, len);
      break;
    case "Warm":
      renderWarm(ctx, sr, len);
      break;
    case "Sweet":
      renderSweet(ctx, sr, len);
      break;
    case "Epic":
      renderEpic(ctx, sr, len);
      break;
    case "Chill":
      renderChill(ctx, sr, len);
      break;
    case "Fun":
      renderFun(ctx, sr, len);
      break;
    default:
      renderRomantic(ctx, sr, len);
  }

  return ctx.startRendering();
}

/* ── Mood renderers ───────────────────────────────────────── */

function renderRomantic(ctx: OfflineAudioContext, sr: number, len: number) {
  // C4, E4, G4, B4 arpeggio loop with soft envelope
  const notes = [0, 4, 7, 11]; // C major 7
  const noteLen = sr * 0.45;
  const baseFreq = 261.63; // C4

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = baseFreq;
  gain.gain.setValueAtTime(0, 0);

  for (let i = 0; i < Math.floor(len / noteLen); i++) {
    const t = (i * noteLen) / sr;
    const noteIdx = i % notes.length;
    osc.frequency.setValueAtTime(
      baseFreq * Math.pow(2, notes[noteIdx] / 12),
      t,
    );
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.04);
    gain.gain.linearRampToValueAtTime(0.12, t + noteLen / sr - 0.04);
    gain.gain.linearRampToValueAtTime(0, t + noteLen / sr);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(len / sr);
}

function renderWarm(ctx: OfflineAudioContext, sr: number, len: number) {
  // Gentle strum pattern on G major
  const strumLen = sr * 0.6;
  const baseFreq = 196.0; // G3

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  gain.gain.setValueAtTime(0, 0);

  for (let i = 0; i < Math.floor(len / strumLen); i++) {
    const t = (i * strumLen) / sr;
    const chord = [0, 4, 7, 12]; // G major
    const wobble = Math.sin(i * 0.7) * 0.5;
    const freqIdx = Math.floor(
      ((i % chord.length) + wobble + chord.length) % chord.length,
    );
    osc.frequency.setValueAtTime(
      baseFreq * Math.pow(2, chord[freqIdx] / 12),
      t,
    );
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.03);
    gain.gain.setValueAtTime(0.1, t + strumLen / sr - 0.03);
    gain.gain.linearRampToValueAtTime(0, t + strumLen / sr);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(len / sr);
}

function renderSweet(ctx: OfflineAudioContext, sr: number, len: number) {
  // Simple ascending-descending pentatonic pattern
  const pentatonic = [0, 2, 4, 7, 9, 7, 4, 2];
  const noteLen = sr * 0.35;
  const baseFreq = 440; // A4

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  gain.gain.setValueAtTime(0, 0);

  for (let i = 0; i < Math.floor(len / noteLen); i++) {
    const t = (i * noteLen) / sr;
    const idx = i % pentatonic.length;
    osc.frequency.setValueAtTime(
      baseFreq * Math.pow(2, pentatonic[idx] / 12),
      t,
    );
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.16, t + 0.03);
    gain.gain.linearRampToValueAtTime(0.1, t + noteLen / sr - 0.03);
    gain.gain.linearRampToValueAtTime(0, t + noteLen / sr);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(len / sr);
}

function renderEpic(ctx: OfflineAudioContext, sr: number, len: number) {
  // Sustained pad with slow filter sweep
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc1.type = "sawtooth";
  osc2.type = "triangle";
  osc1.frequency.value = 130.81; // C3
  osc2.frequency.value = 261.63; // C4
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(200, 0);
  filter.frequency.linearRampToValueAtTime(800, len / sr);
  filter.frequency.linearRampToValueAtTime(300, len / sr);

  gain.gain.setValueAtTime(0, 0);
  gain.gain.linearRampToValueAtTime(0.08, 0.3);
  gain.gain.setValueAtTime(0.08, len / sr - 1);
  gain.gain.linearRampToValueAtTime(0, len / sr - 0.1);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc1.start(0);
  osc2.start(0);
  osc1.stop(len / sr);
  osc2.stop(len / sr);
}

function renderChill(ctx: OfflineAudioContext, sr: number, len: number) {
  // Detuned lo-fi chords with subtle wobble
  const notes = [-5, 0, 4, 7]; // Fmaj7-ish
  const noteLen = sr * 1.2;
  const baseFreq = 220; // A3

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = "sine";
  osc2.type = "sine";
  osc2.detune.value = -15;

  gain.gain.setValueAtTime(0, 0);

  for (let i = 0; i < Math.floor(len / noteLen); i++) {
    const t = (i * noteLen) / sr;
    const idx = i % notes.length;
    const freq = baseFreq * Math.pow(2, notes[idx] / 12);
    osc1.frequency.setValueAtTime(freq, t);
    osc2.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.06);
    gain.gain.linearRampToValueAtTime(0.06, t + noteLen / sr - 0.06);
    gain.gain.linearRampToValueAtTime(0, t + noteLen / sr);
  }

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  osc1.start(0);
  osc2.start(0);
  osc1.stop(len / sr);
  osc2.stop(len / sr);
}

function renderFun(ctx: OfflineAudioContext, sr: number, len: number) {
  // Quick ascending arpeggios reminiscent of bollywood
  const arp = [0, 4, 7, 12, 7, 4, 0, -5];
  const noteLen = sr * 0.2;
  const baseFreq = 293.66; // D4

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  gain.gain.setValueAtTime(0, 0);

  for (let i = 0; i < Math.floor(len / noteLen); i++) {
    const t = (i * noteLen) / sr;
    const idx = i % arp.length;
    osc.frequency.setValueAtTime(baseFreq * Math.pow(2, arp[idx] / 12), t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.07, t + 0.02);
    gain.gain.linearRampToValueAtTime(0.04, t + noteLen / sr - 0.02);
    gain.gain.linearRampToValueAtTime(0, t + noteLen / sr);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(len / sr);
}

/* ── Public API ───────────────────────────────────────────── */

/**
 * Generates (or retrieves from cache) a synthetic audio blob URL
 * for the given track mood.
 *
 * @param trackId - Unique identifier for the track (used as cache key).
 * @param mood    - Mood string matching TRACK_MOOD_COLORS keys.
 * @returns A blob: URL pointing to the generated WAV audio.
 */
export async function getSyntheticAudio(
  trackId: string,
  mood: string,
): Promise<string> {
  if (cache.has(trackId)) {
    return cache.get(trackId)!;
  }

  const ctx = new OfflineAudioContext(
    1,
    SAMPLE_RATE * TRACK_DURATION,
    SAMPLE_RATE,
  );
  const buffer = await generateBuffer(ctx, mood);
  const samples = buffer.getChannelData(0);
  const blob = encodeWAV(samples, SAMPLE_RATE);
  const url = URL.createObjectURL(blob);

  cache.set(trackId, url);
  return url;
}

/**
 * Pre-generates synthetic audio for all tracks.
 * Call once on mount to warm the cache.
 */
export async function preGenerateAll(
  tracks: { id: string; mood: string }[],
): Promise<void> {
  await Promise.all(tracks.map((t) => getSyntheticAudio(t.id, t.mood)));
}
