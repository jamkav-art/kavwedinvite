"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface PaymentButtonEnhancedProps {
  disabledReason?: string | null;
  loading?: boolean;
  onClick: () => Promise<void> | void;
}

export default function PaymentButtonEnhanced({
  disabledReason,
  loading = false,
  onClick,
}: PaymentButtonEnhancedProps) {
  const disabled = Boolean(disabledReason) || loading;
  const priceControls = useAnimation();
  const [flipIndex, setFlipIndex] = useState(0);

  // Colors for the price cycling
  const priceColors = [
    "#D4756C", // terracotta
    "#9CA986", // sage
    "#C9A962", // gold
    "#E8638C", // rose
    "#C0185F", // magenta
  ];

  // Continuous flip animation
  useEffect(() => {
    if (disabled) return;

    const interval = setInterval(async () => {
      await priceControls.start({
        rotateX: [0, 180, 360],
        scale: [1, 1.1, 1],
        transition: { duration: 1.2, ease: "easeInOut" },
      });
      setFlipIndex((prev) => (prev + 1) % priceColors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [disabled, priceControls, priceColors.length]);

  const handleClick = async () => {
    if (disabled) return;
    // Trigger an extra flip on click
    await priceControls.start({
      rotateX: [0, 360, 720],
      scale: [1, 1.3, 1],
      transition: { duration: 0.8 },
    });
    await onClick();
  };

  return (
    <div className="space-y-2">
      <motion.div
        className="relative inline-block w-full"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Floral border SVG */}
        <div className="absolute -inset-2 -z-10 overflow-hidden rounded-2xl">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="floral-pattern"
                patternUnits="userSpaceOnUse"
                width="40"
                height="40"
              >
                <path
                  d="M20 10 C20 10, 10 15, 20 25 C30 15, 20 10, 20 10"
                  fill={priceColors[flipIndex]}
                  fillOpacity="0.5"
                />
                <circle cx="20" cy="10" r="3" fill={priceColors[flipIndex]} />
              </pattern>
              <linearGradient
                id="button-glow"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={priceColors[flipIndex]}
                  stopOpacity="0.6"
                />
                <stop
                  offset="100%"
                  stopColor={priceColors[(flipIndex + 2) % priceColors.length]}
                  stopOpacity="0.3"
                />
              </linearGradient>
            </defs>
            <rect
              x="2"
              y="2"
              width="196"
              height="56"
              rx="28"
              fill="url(#floral-pattern)"
              stroke="url(#button-glow)"
              strokeWidth="2"
            />
          </svg>
        </div>

        <Button
          type="button"
          size="lg"
          loading={loading}
          disabled={disabled}
          onClick={() => void handleClick()}
          title={disabledReason ?? undefined}
          className="w-full h-14 text-base font-semibold relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${priceColors[flipIndex]}20, ${priceColors[(flipIndex + 2) % priceColors.length]}20)`,
            border: `2px solid ${priceColors[flipIndex]}40`,
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <span>Pay</span>
            <motion.span
              className="inline-block font-bold px-1 rounded"
              animate={priceControls}
              style={{
                color: priceColors[flipIndex],
                textShadow: `0 0 10px ${priceColors[flipIndex]}80`,
              }}
            >
              ₹699
            </motion.span>
            <span>Securely</span>
          </span>

          {/* Sparkle particles */}
          {!disabled && (
            <>
              <motion.div
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                initial={{ x: -10, y: -5, opacity: 0 }}
                animate={{
                  x: [0, 20, 0],
                  y: [0, -10, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
              />
              <motion.div
                className="absolute w-1 h-1 bg-pink-300 rounded-full"
                initial={{ x: 10, y: -5, opacity: 0 }}
                animate={{
                  x: [0, -15, 0],
                  y: [0, 5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
              />
            </>
          )}
        </Button>
      </motion.div>
      {disabledReason && (
        <p className="text-xs text-[--color-terracotta]">{disabledReason}</p>
      )}
    </div>
  );
}
