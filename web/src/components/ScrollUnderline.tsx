"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";

/**
 * Hand-drawn rough-notation underline for "Latest Verified Deals":
 * - When at the top / before scrolling down, the line is 0% visible (hidden).
 * - As the user scrolls down into the section, it draws from "L" across to "s".
 * - When the user scrolls back up, it un-draws backward from "s" back to "L".
 */
export function ScrollUnderline({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const textEl = textRef.current;
    const container = containerRef.current;
    if (!textEl || !container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent-sage").trim() || "#3f5844";

    // Create rough-notation underline without built-in keyframe animation
    const annotation = annotate(textEl, {
      type: "underline",
      color: accent,
      strokeWidth: 3,
      padding: [0, 2],
      iterations: 1,
      animate: false,
    });
    annotation.show();

    // rough-notation inserts <svg class="rough-annotation"> after textEl (inside container)
    const getPaths = (): SVGPathElement[] => {
      const svgs = container.querySelectorAll<SVGElement>("svg.rough-annotation");
      const paths: SVGPathElement[] = [];
      svgs.forEach((svg) => {
        svg.style.pointerEvents = "none";
        svg.querySelectorAll<SVGPathElement>("path").forEach((p) => paths.push(p));
      });
      return paths;
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const paths = getPaths();
      if (paths.length === 0) return;

      const rect = textEl.getBoundingClientRect();
      const vh = window.innerHeight;

      // Start drawing at L when heading is 90% down viewport
      // Complete drawing at s when heading reaches 35% down viewport
      const start = vh * 0.9;
      const end = vh * 0.35;
      const progress = reduced ? 1 : Math.min(1, Math.max(0, (start - rect.top) / (start - end)));

      paths.forEach((path) => {
        const len = path.getTotalLength();
        if (len === 0) return;

        const pStart = path.getPointAtLength(0);
        const pEnd = path.getPointAtLength(len);
        const isLtoR = pStart.x <= pEnd.x;

        path.style.strokeDashoffset = "0";
        if (isLtoR) {
          // Path naturally runs L -> s
          path.style.strokeDasharray = `${progress * len} ${len}`;
        } else {
          // Path runs s -> L: offset gap so reveal strictly runs L -> s
          path.style.strokeDasharray = `0 ${(1 - progress) * len} ${progress * len} ${len}`;
        }
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Initial pass immediately after DOM injection
    update();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const ro = new ResizeObserver(() => {
      schedule();
    });
    ro.observe(textEl);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      annotation.remove();
    };
  }, []);

  return (
    <span ref={containerRef} className="relative inline-block">
      <span ref={textRef} className="relative inline-block">
        {children}
      </span>
    </span>
  );
}
