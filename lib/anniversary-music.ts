export interface MusicTrack {
  id: string;
  label: string;
  duration: string;
  mood: string;
  src: string; // placeholder path — real files TBD
}

export const CURATED_TRACKS: MusicTrack[] = [
  {
    id: "romantic-piano",
    label: "Romantic Piano",
    duration: "3:24",
    mood: "Romantic",
    src: "/sounds/romantic-piano.mp3",
  },
  {
    id: "soft-guitar",
    label: "Soft Guitar",
    duration: "4:02",
    mood: "Warm",
    src: "/sounds/soft-guitar.mp3",
  },
  {
    id: "acoustic-love",
    label: "Acoustic Love",
    duration: "3:45",
    mood: "Sweet",
    src: "/sounds/acoustic-love.mp3",
  },
  {
    id: "cinematic-strings",
    label: "Cinematic Strings",
    duration: "4:30",
    mood: "Epic",
    src: "/sounds/cinematic-strings.mp3",
  },
  {
    id: "calm-lo-fi",
    label: "Calm Lo-fi",
    duration: "3:15",
    mood: "Chill",
    src: "/sounds/calm-lo-fi.mp3",
  },
  {
    id: "bollywood-romance",
    label: "Bollywood Romance",
    duration: "3:55",
    mood: "Fun",
    src: "/sounds/bollywood-romance.mp3",
  },
];

export const TRACK_MOOD_COLORS: Record<string, string> = {
  Romantic: "#e8638c",
  Warm: "#c9a962",
  Sweet: "#9ca986",
  Epic: "#c0185f",
  Chill: "#a8720a",
  Fun: "#d4756c",
};
