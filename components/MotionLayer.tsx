"use client";

import { useEffect } from "react";

export function MotionLayer() {
  useEffect(() => {
    const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    document.documentElement.classList.add("motion-ready");

    const updateProgress = () => {
      if (!progress) {
        return;
      }

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
      progress.style.transform = `scaleX(${Math.min(Math.max(amount, 0), 1)})`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return <div data-scroll-progress className="scroll-progress" aria-hidden />;
}
