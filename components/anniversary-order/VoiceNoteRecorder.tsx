"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceNoteRecorderProps {
  value: { url: string; name: string } | null;
  onChange: (blob: Blob | null) => void;
}

const MAX_DURATION = 30; // seconds

export default function VoiceNoteRecorder({
  value,
  onChange,
}: VoiceNoteRecorderProps) {
  const [state, setState] = useState<"idle" | "recording" | "playing">("idle");
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(value?.url ?? null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl && !value?.url) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, value]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorder.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onChange(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setState("recording");
      setDuration(0);

      // Timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= MAX_DURATION) {
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      alert("Microphone access denied. Please allow microphone permissions.");
    }
  }, [onChange]);

  const stopRecording = useCallback(() => {
    mediaRecorder.current?.stop();
    mediaRecorder.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    setState("idle");
  }, []);

  const playRecording = () => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.onended = () => setState("idle");
    audio.play();
    setState("playing");
  };

  const stopPlaying = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setState("idle");
  };

  const handleDelete = () => {
    if (audioUrl && !value?.url) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    onChange(null);
    setState("idle");
    setDuration(0);
  };

  // Progress circle
  const progress = (duration / MAX_DURATION) * 100;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[--color-charcoal]">
        Voice Note{" "}
        <span className="text-xs text-gray-400 font-normal">
          (optional, max 30s)
        </span>
      </p>

      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100">
        {/* Record button */}
        <motion.button
          type="button"
          onClick={state === "recording" ? stopRecording : startRecording}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "relative shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all",
            state === "recording"
              ? "bg-[--color-terracotta] shadow-lg shadow-[--color-terracotta]/30"
              : "bg-[--color-magenta] hover:bg-[--color-magenta]/90 shadow-md",
          )}
          aria-label={
            state === "recording" ? "Stop recording" : "Start recording"
          }
        >
          {state === "recording" ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-5 h-5 rounded-sm bg-white"
            />
          ) : (
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-6 h-6 text-white ml-0.5"
            >
              <path d="M8 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zm4 9a4 4 0 01-8 0V5a4 4 0 018 0v6z" />
              <path d="M3 10a.75.75 0 01.75.75v1.5a4.25 4.25 0 008.5 0v-1.5a.75.75 0 011.5 0v1.5a5.75 5.75 0 01-11.5 0v-1.5A.75.75 0 013 10z" />
            </svg>
          )}

          {/* Recording timer badge */}
          {state === "recording" && (
            <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-white text-[--color-terracotta] px-1.5 py-0.5 rounded-full shadow-sm">
              {MAX_DURATION - duration}s
            </span>
          )}
        </motion.button>

        {/* Status / controls */}
        <div className="flex-1 min-w-0">
          {state === "idle" && !audioUrl && (
            <div>
              <p className="text-sm font-medium text-[--color-charcoal]">
                No recording yet
              </p>
              <p className="text-xs text-gray-400">
                Tap the mic to record your love note
              </p>
            </div>
          )}

          {state === "recording" && (
            <div>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-[--color-terracotta]"
                />
                <p className="text-sm font-medium text-[--color-terracotta]">
                  Recording...
                </p>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  className="h-full bg-[--color-terracotta] rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {state === "playing" && (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[--color-gold]"
              />
              <p className="text-sm font-medium text-[--color-gold]">
                Playing...
              </p>
            </div>
          )}

          {state === "idle" && audioUrl && (
            <div>
              <p className="text-sm font-medium text-[--color-sage]">
                Recording saved
              </p>
              <p className="text-xs text-gray-400">{duration}s voice note</p>
            </div>
          )}
        </div>

        {/* Play / delete controls */}
        {audioUrl && state === "idle" && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={playRecording}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[--color-blush] hover:text-[--color-magenta] transition-colors"
              aria-label="Play recording"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M6.79 3.094A.5.5 0 016 3.5v9a.5.5 0 00.79.406l6-4.5a.5.5 0 000-.812l-6-4.5z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-[--color-terracotta] transition-colors"
              aria-label="Delete recording"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
                <path
                  fillRule="evenodd"
                  d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
