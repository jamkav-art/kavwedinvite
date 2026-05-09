"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useOrderStore } from "@/hooks/useOrderStore";
import type { MediaAsset } from "@/types/order.types";
import SlideSlideWrapper from "./SlideSlideWrapper";

export default function SlideVoiceMessage() {
  const voice = useOrderStore((s) => s.media.voice);
  const updateMedia = useOrderStore((s) => s.updateMedia);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(voice?.url || null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const asset: MediaAsset = {
          name: "voice-message.webm",
          url,
          path: "voice-message.webm",
          mimeType: "audio/webm",
          size: blob.size,
        };
        updateMedia({ voice: asset });
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      alert("Microphone access denied. Please upload an audio file instead.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("audio/")) return;
    setIsUploading(true);
    try {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      const asset: MediaAsset = {
        name: file.name,
        url,
        path: file.name,
        mimeType: file.type,
        size: file.size,
      };
      updateMedia({ voice: asset });
    } finally {
      setIsUploading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current && audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const hasAudio = !!audioUrl;

  return (
    <SlideSlideWrapper
      emoji="🎤"
      heading="Record a voice message"
      subheading="Optional — make it personal!"
      onContinue={nextStep}
      onBack={prevStep}
      showBack
    >
      <div className="w-full space-y-4">
        {/* Record / Upload Zone */}
        <div className="flex flex-col items-center gap-3">
          {isRecording ? (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center gap-2"
            >
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-[var(--wiz-accent-rose)] flex items-center justify-center shadow-lg shadow-[var(--wiz-accent-rose)]/30"
              >
                <div className="w-6 h-6 bg-white rounded-sm" />
              </button>
              <span className="text-sm text-[var(--wiz-accent-rose)]">
                {formatDuration(recordingDuration)}
              </span>
              <span className="text-xs text-[var(--wiz-text-muted)]">
                Tap to stop
              </span>
            </motion.div>
          ) : (
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <span className="text-2xl">🎤</span>
                <span className="text-xs text-[var(--wiz-text-secondary)]">
                  Record
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <span className="text-2xl">📁</span>
                <span className="text-xs text-[var(--wiz-text-secondary)]">
                  Upload
                </span>
              </motion.button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = "";
            }}
          />
        </div>

        {/* Playback Bar */}
        {hasAudio && !isRecording && (
          <div className="wiz-glass px-4 py-3 rounded-xl flex items-center gap-3">
            <button
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-[var(--wiz-accent-gold)]/20 flex items-center justify-center hover:bg-[var(--wiz-accent-gold)]/30 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  className="w-4 h-4 text-[var(--wiz-accent-gold)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-[var(--wiz-accent-gold)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Simple waveform visualization */}
            <div className="flex-1 flex items-center gap-0.5 h-8">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isPlaying ? "bg-[var(--wiz-accent-gold)]/60" : "bg-white/20"
                  }`}
                  style={{
                    height: `${20 + Math.sin(i * 0.8 + Date.now() * 0.001) * 15}px`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </SlideSlideWrapper>
  );
}
