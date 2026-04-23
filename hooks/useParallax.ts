"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

function registerPluginsOnce() {
  if (pluginsRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  pluginsRegistered = true;
}

export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    registerPluginsOnce();

    const element = ref.current;
    const animation = gsap.to(element, {
      y: () => -(window.innerHeight * speed),
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      // Kill the animation and its associated ScrollTrigger
      animation.kill();
      const scrollTrigger = animation.scrollTrigger;
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, [speed]);

  return ref;
};
