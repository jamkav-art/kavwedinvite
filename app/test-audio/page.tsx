"use client";

import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useState } from "react";

export default function AudioTestPage() {
  const [audioUrl, setAudioUrl] = useState<string>("/sounds/confetti-pop.mp3");
  const { isPlaying, currentTime, duration, play, pause, togglePlay, seek } =
    useAudioPlayer(audioUrl);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  const handleLoadAnother = () => {
    setAudioUrl("/sounds/rsvp-success.mp3");
  };

  const handleReset = () => {
    setAudioUrl("");
    setTimeout(() => setAudioUrl("/sounds/confetti-pop.mp3"), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Audio Player Hook Test</h1>
        <p className="text-gray-300 mb-8">
          This page tests the <code>useAudioPlayer</code> hook with actual audio
          files.
        </p>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Controls</h2>
              <p className="text-gray-400">
                Current file: {audioUrl.split("/").pop()}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLoadAnother}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
              >
                Load Another Audio
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
              >
                Reset Audio
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className={`px-6 py-3 rounded-xl font-bold text-lg transition ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                onClick={play}
                disabled={isPlaying}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                Play
              </button>
              <button
                onClick={pause}
                disabled={!isPlaying}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                Pause
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Time: {currentTime.toFixed(2)}s</span>
                <span>Duration: {duration.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0s</span>
                <span>{(duration / 2).toFixed(1)}s</span>
                <span>{duration.toFixed(1)}s</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-xl">
                <h3 className="font-medium mb-2">State</h3>
                <pre className="text-sm font-mono">
                  {JSON.stringify(
                    { isPlaying, currentTime, duration },
                    null,
                    2,
                  )}
                </pre>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl">
                <h3 className="font-medium mb-2">Audio Info</h3>
                <p className="text-sm">
                  File loaded: {audioUrl ? "Yes" : "No"}
                  <br />
                  Duration:{" "}
                  {duration > 0
                    ? `${duration.toFixed(2)} seconds`
                    : "Loading..."}
                  <br />
                  Status: {isPlaying ? "Playing" : "Paused"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
          <h3 className="text-xl font-semibold mb-3">Test Instructions</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>
              Click <strong>Play</strong> to start audio playback.
            </li>
            <li>
              Click <strong>Pause</strong> to pause playback.
            </li>
            <li>Use the slider to seek to a different time.</li>
            <li>
              Click <strong>Load Another Audio</strong> to switch to a different
              sound (tests URL change).
            </li>
            <li>
              Click <strong>Reset Audio</strong> to re‑initialize the audio
              element.
            </li>
          </ul>
          <p className="mt-4 text-gray-400 text-sm">
            If all controls work as expected, the hook is functioning correctly.
          </p>
        </div>
      </div>
    </div>
  );
}
