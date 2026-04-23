"use client";

import { useState } from "react";
import { PreLoader } from "@/components/invite/PreLoader";

export default function TestPreLoaderPage() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleComplete = () => {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    setLogs((prev) => [...prev, `Preloader completed at ${timestamp}`]);
    setCompleted(true);
    setShowPreloader(false);
  };

  const handleRestart = () => {
    setShowPreloader(true);
    setCompleted(false);
    setLogs((prev) => [...prev, "Restarted preloader"]);
  };

  const templateColor = "#8B5CF6"; // Example purple

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">PreLoader Component Test</h1>
        <p className="mb-4">
          This page tests the PreLoader component with GSAP animations. The
          preloader should auto-dismiss after approximately 2.5 seconds.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
              <div className="relative h-96 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {showPreloader && (
                  <PreLoader
                    templateColor={templateColor}
                    onComplete={handleComplete}
                  />
                )}
                {!showPreloader && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <p className="text-lg font-medium">Preloader dismissed</p>
                      <p className="text-sm text-gray-600 mt-2">
                        The onComplete callback was triggered.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Restart Preloader
                </button>
                <button
                  onClick={() => setLogs([])}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Component Props</h2>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-40">templateColor:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {templateColor}
                  </code>
                </div>
                <div className="flex">
                  <span className="font-medium w-40">onComplete:</span>
                  <span className="text-gray-700">
                    Callback triggered after animation
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Event Log</h2>
              <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                {logs.length === 0 ? (
                  <p className="text-gray-500 italic">No events yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {logs.map((log, idx) => (
                      <li key={idx} className="font-mono text-sm">
                        <span className="text-gray-500">[{idx + 1}]</span> {log}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Expected behavior:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Preloader appears with gradient background</li>
                  <li>Mandala SVG rotates and scales in</li>
                  <li>Text fades up and pulses</li>
                  <li>Entire preloader fades out after ~2.5s</li>
                  <li>onComplete callback is called</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Status</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${showPreloader ? "bg-yellow-500" : "bg-green-500"}`}
                  />
                  <span>
                    {showPreloader
                      ? "Preloader is active"
                      : "Preloader completed"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${completed ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span>onComplete called: {completed ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 bg-blue-500" />
                  <span>Log entries: {logs.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-2">Testing Instructions</h3>
          <p className="text-gray-700">
            1. The preloader should automatically start when the page loads.
            <br />
            2. Observe the animation sequence: fade in, mandala animation, text
            pulse, fade out.
            <br />
            3. After the animation completes, the onComplete callback will log
            an event.
            <br />
            4. Use the "Restart Preloader" button to test again.
          </p>
        </div>
      </div>
    </div>
  );
}
