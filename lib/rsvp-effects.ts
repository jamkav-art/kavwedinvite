import confetti from "canvas-confetti";

export const rsvpEffects = {
  // Confetti burst
  celebrateRSVP: (colors: string[]) => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: colors,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  },

  // Play success sound
  playSuccessSound: () => {
    try {
      const audio = new Audio("/sounds/rsvp-success.mp3");
      audio.volume = 0.5;
      audio.play().catch((err) => {
        console.log("Audio playback failed:", err);
      });
    } catch (error) {
      console.log("Audio not available");
    }
  },

  // Combined effect
  triggerSuccess: (templateColors: string[]) => {
    rsvpEffects.celebrateRSVP(templateColors);
    rsvpEffects.playSuccessSound();
  },
};
