"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnswerFeedbackSVGProps {
  type: "correct" | "wrong";
}

export default function AnswerFeedbackSVG({ type }: AnswerFeedbackSVGProps) {
  if (type === "correct") {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 30 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center"
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sparkle particles */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, times: [0, 0.2, 1] }}
          >
            {/* Top-left sparkle */}
            <motion.path
              d="M30 20 L32 16 L34 20 L38 22 L34 24 L32 28 L30 24 L26 22Z"
              fill="#FFD700"
              animate={{ scale: [0, 1.2, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 1.5, repeat: 0 }}
            />
            {/* Top-right sparkle */}
            <motion.path
              d="M90 25 L92 21 L94 25 L98 27 L94 29 L92 33 L90 29 L86 27Z"
              fill="#FF69B4"
              animate={{ scale: [0, 1.2, 0], rotate: [0, -180, -360] }}
              transition={{ duration: 1.5, delay: 0.2, repeat: 0 }}
            />
            {/* Bottom-left sparkle */}
            <motion.path
              d="M25 85 L27 81 L29 85 L33 87 L29 89 L27 93 L25 89 L21 87Z"
              fill="#FFD700"
              animate={{ scale: [0, 1.2, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 1.5, delay: 0.4, repeat: 0 }}
            />
            {/* Bottom-right sparkle */}
            <motion.path
              d="M95 90 L97 86 L99 90 L103 92 L99 94 L97 98 L95 94 L91 92Z"
              fill="#FF1493"
              animate={{ scale: [0, 1.2, 0], rotate: [0, -180, -360] }}
              transition={{ duration: 1.5, delay: 0.3, repeat: 0 }}
            />
          </motion.g>

          {/* Main Heart */}
          <motion.g
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 0.8, times: [0, 0.5, 1] }}
          >
            <svg x="25" y="30" width="70" height="70" viewBox="0 0 70 70">
              {/* Glow effect */}
              <defs>
                <filter id="heartGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M35 62 C35 62 5 42 5 22 C5 10 15 4 24 4 C30 4 35 10 35 16 C35 10 40 4 46 4 C55 4 65 10 65 22 C65 42 35 62 35 62Z"
                fill="url(#heartGradient)"
                filter="url(#heartGlow)"
              />
              {/* Love eyes */}
              <motion.g
                animate={{ scaleY: [1, 1.3, 1] }}
                transition={{ duration: 0.6, times: [0, 0.5, 1], repeat: 1 }}
              >
                {/* Left eye - heart shape */}
                <circle cx="26" cy="28" r="4" fill="#FF1493" />
                <circle cx="26" cy="28" r="1.5" fill="white" />
                {/* Right eye - heart shape */}
                <circle cx="44" cy="28" r="4" fill="#FF1493" />
                <circle cx="44" cy="28" r="1.5" fill="white" />
              </motion.g>
              {/* Smile */}
              <motion.path
                d="M24 38 Q35 48 46 38"
                stroke="#FF1493"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                animate={{ scaleY: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              {/* Rosy cheeks */}
              <circle cx="18" cy="36" r="4" fill="#FFB6C1" opacity="0.6" />
              <circle cx="52" cy="36" r="4" fill="#FFB6C1" opacity="0.6" />
            </svg>
          </motion.g>

          {/* Animated gradient for heart */}
          <defs>
            <linearGradient
              id="heartGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF1493" />
              <stop offset="50%" stopColor="#FF69B4" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    );
  }

  // Wrong answer — Sad but cute love-coded SVG face
  return (
    <motion.div
      initial={{ scale: 0, rotate: 30 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: -30 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="inline-flex items-center justify-center"
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main heart (sad) */}
        <motion.g
          animate={{
            rotate: [0, -5, 5, -3, 3, 0],
          }}
          transition={{ duration: 0.8 }}
        >
          <svg x="15" y="20" width="70" height="70" viewBox="0 0 70 70">
            <defs>
              <filter id="sadHeartGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M35 58 C35 58 8 40 8 22 C8 12 16 6 24 6 C30 6 35 12 35 18 C35 12 40 6 46 6 C54 6 62 12 62 22 C62 40 35 58 35 58Z"
              fill="#A0A0B0"
              opacity="0.6"
              filter="url(#sadHeartGlow)"
            />
            {/* Sad eyes */}
            <motion.g
              animate={{ scaleY: [1, 0.8, 1] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1] }}
            >
              {/* Left eye */}
              <ellipse cx="25" cy="28" rx="3.5" ry="4.5" fill="#6B7280" />
              <circle cx="25" cy="27" r="1.5" fill="#9CA3AF" />
              {/* Right eye */}
              <ellipse cx="45" cy="28" rx="3.5" ry="4.5" fill="#6B7280" />
              <circle cx="45" cy="27" r="1.5" fill="#9CA3AF" />
            </motion.g>
            {/* Sad mouth */}
            <motion.path
              d="M24 44 Q35 38 46 44"
              stroke="#9CA3AF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              animate={{ scaleY: [1, 0.9, 1] }}
              transition={{ duration: 0.5 }}
            />
            {/* Blush */}
            <circle cx="16" cy="36" r="3.5" fill="#FCA5A5" opacity="0.4" />
            <circle cx="54" cy="36" r="3.5" fill="#FCA5A5" opacity="0.4" />
          </svg>
        </motion.g>

        {/* Gentle tear drop */}
        <motion.g
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: [0, 1, 0.6], y: [0, 8, 12] }}
          transition={{ duration: 1.5, times: [0, 0.3, 1] }}
        >
          <path
            d="M33 32 C33 32 35 38 35 40 C35 42 33 42 33 42 C33 42 31 42 31 40 C31 38 33 32 33 32Z"
            fill="#93C5FD"
            opacity="0.7"
          />
        </motion.g>

        {/* Small floating hearts */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <text x="65" y="20" fontSize="10" fill="#FCA5A5" opacity="0.5">
            💔
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}
