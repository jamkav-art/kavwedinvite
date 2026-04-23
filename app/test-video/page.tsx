"use client";

import { SaveTheDateVideo } from "@/components/invite/SaveTheDateVideo";

export default function TestVideoPage() {
  const sampleVideoUrl =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const templateColor = "#8B5CF6"; // Purple

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Save The Date Video Component Test
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Testing custom video player with controls, progress bar, fullscreen,
          and animations.
        </p>

        <div className="mb-12">
          <SaveTheDateVideo
            videoUrl={sampleVideoUrl}
            templateColor={templateColor}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Features Tested</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <span>16:9 aspect ratio container</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <span>Custom play/pause controls</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <span>Progress bar with click‑to‑seek</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <span>Mute/unmute button</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <span>Fullscreen support</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <span>Scroll‑triggered fade animation</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <span>Fallback when no video provided</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
            <p className="mb-4">
              Click the large play button to start the video. Use the controls
              at the bottom to pause, mute, adjust progress, or enter
              fullscreen.
            </p>
            <p className="mb-4">
              The component uses <code>useScrollAnimation</code> hook to fade in
              when scrolled into view.
            </p>
            <p>
              If you remove the <code>videoUrl</code> prop, the component will
              render nothing (fallback).
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            This is a test page for development purposes. The video is from the
            "Big Buck Bunny" sample.
          </p>
        </div>
      </div>
    </div>
  );
}
