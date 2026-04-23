"use client";

import { useEffect, useRef } from "react";
import { animations } from "@/lib/animations";
import type gsap from "gsap";

export const useScrollAnimation = (
  animationType: "fade" | "parallax" | "reveal",
) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    let animation: gsap.core.Tween | undefined;

    switch (animationType) {
      case "fade":
        animation = animations.fadeInOnScroll([ref.current]);
        break;
      case "parallax":
        animation = animations.createParallax(ref.current, 0.3);
        break;
      case "reveal":
        animation = animations.fadeInOnScroll([ref.current], 0);
        break;
    }

    return () => {
      if (animation) animation.kill();
    };
  }, [animationType]);

  return ref;
};
