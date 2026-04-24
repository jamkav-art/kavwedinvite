"use client";

import { motion } from "framer-motion";

interface AnimatedPriceProps {
  price?: number;
  className?: string;
}

export default function AnimatedPrice({
  price = 399,
  className = "",
}: AnimatedPriceProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {/* Floral decorative dots */}
      <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-[#D4756C] opacity-70 animate-ping" />
      <div
        className="absolute -bottom-2 -right-2 w-3 h-3 rounded-full bg-[#9CA986] opacity-70 animate-ping"
        style={{ animationDelay: "0.3s" }}
      />
      <div
        className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-[#C9A962] opacity-70 animate-ping"
        style={{ animationDelay: "0.6s" }}
      />
      <div
        className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-[#E8638C] opacity-70 animate-ping"
        style={{ animationDelay: "0.9s" }}
      />

      {/* Animated gradient price */}
      <motion.span
        className="text-3xl sm:text-4xl font-bold tracking-tight"
        style={{
          background:
            "linear-gradient(135deg, #D4756C, #9CA986, #C9A962, #E8638C, #C0185F, #D4756C)",
          backgroundSize: "300% 300%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 20px rgba(212, 117, 108, 0.3)",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        ₹{price}
      </motion.span>

      {/* Floating petals */}
      <motion.div
        className="absolute -z-10"
        initial={{ y: 0, rotate: 0 }}
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4Z"
            fill="#D4756C"
            fillOpacity="0.6"
          />
        </svg>
      </motion.div>
      <motion.div
        className="absolute -z-10"
        initial={{ y: 0, rotate: 0 }}
        animate={{ y: [0, -8, 0], rotate: [0, -15, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9C15 7.34 13.66 6 12 6Z"
            fill="#9CA986"
            fillOpacity="0.6"
          />
        </svg>
      </motion.div>
    </div>
  );
}
