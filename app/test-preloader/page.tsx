"use client";

import { useState } from "react";
import { Gatekeeper } from "@/components/invite/Gatekeeper";

// Full TemplateConfig for testing the Gatekeeper component
const testTemplate = {
  slug: "test-template",
  name: "Test Template",
  tagline: "A test template for Gatekeeper",
  description:
    "Used exclusively for testing the Gatekeeper component in isolation",
  mood: "romantic",
  tags: ["test", "gatekeeper"],
  colors: {
    background: "#0f0a1a",
    text: "#f8f5f0",
    primary: "#c9a96e",
    secondary: "#a37c5b",
    accent: "#e8d5a3",
    border: "#2a1f3d",
  },
  fonts: {
    heading: "playfair" as const,
    body: "lora" as const,
    accent: "cormorant" as const,
  },
  animations: {
    heroEntrance: "fade" as const,
    particleType: "sparkles" as const,
    scrollEffect: "parallax" as const,
  },
  music: {
    waveformColor: "#c9a96e",
  },
  borders: {
    style: "none" as const,
    svgPath: "",
    patternOpacity: 0.06,
  },
  decorations: {
    borderSvg: "",
    patternOpacity: 0.06,
    hasFloralAccent: false,
    hasGoldLeaf: false,
  },
  features: {
    hasVideoHero: false,
    hasParallax: true,
    hasFullBleed: true,
    hasSidebarLayout: false,
  },
  layout: {
    heroFullBleed: true,
    sidebarEvents: false,
    galleryGrid: false,
    floatingRsvp: true,
  },
};

export default function TestPreLoaderPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleUnlock = () => {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    setLogs((prev) => [...prev, `Gatekeeper unlocked at ${timestamp}`]);
    setUnlocked(true);
  };

  const handleRestart = () => {
    setUnlocked(false);
    setLogs((prev) => [...prev, "Restarted gatekeeper"]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gatekeeper Component Test</h1>
        <p className="mb-4">
          This page tests the Gatekeeper component. Tap the screen to unlock and
          reveal content. The Gatekeeper replaces the old PreLoader entirely.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
              <div className="relative h-96 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <Gatekeeper
                  coupleName1="John"
                  coupleName2="Jane"
                  template={testTemplate}
                  onUnlock={handleUnlock}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
                    <div className="text-center text-white p-8">
                      <div className="text-4xl mb-4">🎉</div>
                      <p className="text-2xl font-serif mb-2">
                        Welcome to the Invitation
                      </p>
                      <p className="text-white/70">
                        Content revealed after Gatekeeper unlock
                      </p>
                    </div>
                  </div>
                </Gatekeeper>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Restart Gatekeeper
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
                  <span className="font-medium w-40">coupleName1:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">John</code>
                </div>
                <div className="flex">
                  <span className="font-medium w-40">coupleName2:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">Jane</code>
                </div>
                <div className="flex">
                  <span className="font-medium w-40">onUnlock:</span>
                  <span className="text-gray-700">Callback on tap</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-40">template:</span>
                  <span className="text-gray-700">
                    Config with gold accents
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
                  <p className="text-gray-500 italic">
                    No events yet. Tap the gatekeeper to unlock.
                  </p>
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
                  <li>Monogram initials appear with scale animation</li>
                  <li>"Tap to Open" button pulses</li>
                  <li>On tap, overlay fades out with blur</li>
                  <li>Child content is revealed</li>
                  <li>onUnlock callback is called</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Status</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${!unlocked ? "bg-yellow-500" : "bg-green-500"}`}
                  />
                  <span>
                    {!unlocked ? "Gatekeeper is active" : "Gatekeeper unlocked"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${unlocked ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span>onUnlock called: {unlocked ? "Yes" : "No"}</span>
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
            1. The Gatekeeper should appear immediately when the component
            mounts.
            <br />
            2. Observe the monogram initials animation with ampersand.
            <br />
            3. Tap the "Tap to Open" button — the overlay should fade out with a
            blur effect.
            <br />
            4. After unlock, the child content ("Welcome to the Invitation")
            becomes visible.
            <br />
            5. Use the "Restart Gatekeeper" button to test again.
          </p>
        </div>
      </div>
    </div>
  );
}
