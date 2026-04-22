"use client";

import { motion } from "framer-motion";

export interface FloralCornerProps {
  color?: string;
  size?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

export function FloralCorner({
  color = "#9CA986",
  size = 60,
  position = "top-left",
  className = "",
}: FloralCornerProps) {
  const positions = {
    "top-left": { top: 0, left: 0, transform: "rotate(0deg)" },
    "top-right": { top: 0, right: 0, transform: "rotate(90deg)" },
    "bottom-left": { bottom: 0, left: 0, transform: "rotate(-90deg)" },
    "bottom-right": { bottom: 0, right: 0, transform: "rotate(180deg)" },
  };

  const style = positions[position];

  return (
    <motion.div
      className={`absolute ${className}`}
      style={{
        ...style,
        width: size,
        height: size,
        position: "absolute",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vine stem */}
        <path
          d="M30 10C30 10 15 20 15 30C15 40 30 50 30 50"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />
        {/* Leaves */}
        <path
          d="M25 18L20 15L22 22"
          stroke={color}
          strokeWidth="1.2"
          fill={color}
          fillOpacity="0.3"
        />
        <path
          d="M35 22L40 18L38 25"
          stroke={color}
          strokeWidth="1.2"
          fill={color}
          fillOpacity="0.3"
        />
        {/* Small flowers */}
        <circle cx="20" cy="35" r="3" fill={color} fillOpacity="0.5" />
        <circle cx="40" cy="25" r="3" fill={color} fillOpacity="0.5" />
        <circle cx="30" cy="15" r="4" fill={color} fillOpacity="0.6" />
      </svg>
    </motion.div>
  );
}

export interface FloralSideBorderProps {
  color?: string;
  height?: number;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function FloralSideBorder({
  color = "#D4756C",
  height = 200,
  position = "top",
  className = "",
}: FloralSideBorderProps) {
  const isVertical = position === "left" || position === "right";
  const positions = {
    top: { top: 0, left: 0, width: "100%", height: 30 },
    bottom: { bottom: 0, left: 0, width: "100%", height: 30 },
    left: { top: 0, left: 0, width: 30, height: "100%" },
    right: { top: 0, right: 0, width: 30, height: "100%" },
  };

  const style = positions[position];

  return (
    <motion.div
      className={`absolute overflow-hidden ${className}`}
      style={style}
      initial={{ opacity: 0, [isVertical ? "x" : "y"]: -20 }}
      animate={{ opacity: 1, [isVertical ? "x" : "y"]: 0 }}
      transition={{ duration: 0.7 }}
    >
      <svg
        width={isVertical ? 30 : "100%"}
        height={isVertical ? height : 30}
        viewBox={`0 0 ${isVertical ? 30 : 200} ${isVertical ? height : 30}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Repeated floral pattern */}
        <pattern
          id={`pattern-${position}`}
          patternUnits="userSpaceOnUse"
          width={isVertical ? 30 : 60}
          height={isVertical ? 60 : 30}
        >
          <circle
            cx={isVertical ? 15 : 30}
            cy={isVertical ? 30 : 15}
            r="4"
            fill={color}
            fillOpacity="0.4"
          />
          <path
            d={isVertical ? "M15 10L10 15L20 15" : "M30 10L25 15L35 15"}
            stroke={color}
            strokeWidth="1"
            fill="none"
          />
        </pattern>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill={`url(#pattern-${position})`}
        />
      </svg>
    </motion.div>
  );
}

export interface FloralBorderWrapperProps {
  children: React.ReactNode;
  corners?: boolean;
  sides?: boolean;
  cornerColor?: string;
  sideColor?: string;
  className?: string;
}

export default function FloralBorderWrapper({
  children,
  corners = true,
  sides = false,
  cornerColor = "#9CA986",
  sideColor = "#D4756C",
  className = "",
}: FloralBorderWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      {corners && (
        <>
          <FloralCorner position="top-left" color={cornerColor} />
          <FloralCorner position="top-right" color={cornerColor} />
          <FloralCorner position="bottom-left" color={cornerColor} />
          <FloralCorner position="bottom-right" color={cornerColor} />
        </>
      )}
      {sides && (
        <>
          <FloralSideBorder position="top" color={sideColor} />
          <FloralSideBorder position="bottom" color={sideColor} />
          <FloralSideBorder position="left" color={sideColor} />
          <FloralSideBorder position="right" color={sideColor} />
        </>
      )}
      {children}
    </div>
  );
}
