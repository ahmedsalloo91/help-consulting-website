"use client";

import { useEffect } from "react";

const revealSelector = [
  "main section",
  ".premium-card",
  "main article",
  ".motion-reveal"
].join(",");

export function MotionLayer() {
  useEffect(() => {
    const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    document.documentElement.classList.add("motion-ready");

    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    elements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index % 7, 6) * 85}ms`);
    });

    const updateProgress = () => {
      if (!progress) {
        return;
      }

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
      progress.style.transform = `scaleX(${Math.min(Math.max(amount, 0), 1)})`;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12
      }
    );

    elements.forEach((element) => observer.observe(element));
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return <div data-scroll-progress className="scroll-progress" aria-hidden />;
}
