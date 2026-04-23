import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/dist/DrawSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
}

export const animations = {
  // Hero entrance animations
  fadeInHero: (element: HTMLElement, duration = 1.5) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration, ease: "power3.out" },
    );
  },

  slideInHero: (element: HTMLElement, duration = 1.5) => {
    return gsap.fromTo(
      element,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration, ease: "power4.out" },
    );
  },

  scaleInHero: (element: HTMLElement, duration = 1.5) => {
    return gsap.fromTo(
      element,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration, ease: "elastic.out(1, 0.5)" },
    );
  },

  // Scroll-triggered fade in
  fadeInOnScroll: (elements: HTMLElement[], stagger = 0.2) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: elements[0],
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );
  },

  // Timeline draw animation
  drawTimeline: (path: SVGPathElement) => {
    return gsap.fromTo(
      path,
      { drawSVG: "0%" },
      {
        drawSVG: "100%",
        duration: 2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: path,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      },
    );
  },

  // Parallax effect
  createParallax: (element: HTMLElement, speed = 0.5) => {
    return gsap.to(element, {
      y: () => -(window.innerHeight * speed),
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  },

  // Cleanup function
  cleanup: () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  },
};
