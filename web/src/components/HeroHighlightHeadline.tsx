"use client";

import { useEffect, useRef, useState } from "react";
import { annotate, annotationGroup } from "rough-notation";

/**
 * Hero headline with authentic Rough Notation highlight:
 * - Real hand-drawn RoughJS marker stroke that hugs letter height snugly.
 * - Perfectly aligned with cap-height and baseline of "Coursera" and "courses".
 * - Sequenced: "Coursera" sweeps first, followed immediately by "courses".
 * - Drawn once on scroll-into-view / load, stays visible permanently.
 * - Theme-adaptive green using var(--accent-highlight).
 * - Instant final green text on prefers-reduced-motion without drawing SVG.
 * - Double rAF + document.fonts.ready ensures measurement against final settled layout.
 */
export function HeroHighlightHeadline() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const courseraRef = useRef<HTMLSpanElement>(null);
  const coursesRef = useRef<HTMLSpanElement>(null);

  const [courseraActive, setCourseraActive] = useState(false);
  const [coursesActive, setCoursesActive] = useState(false);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCourseraActive(true);
      setCoursesActive(true);
      return;
    }

    let cancelled = false;
    let a1: ReturnType<typeof annotate> | null = null;
    let a2: ReturnType<typeof annotate> | null = null;
    let timer: number | undefined;

    const run = async () => {
      // Ensure web font (Cormorant Garamond) has resolved
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (cancelled) return;

      // Two rAF frames ensure layout, line-height, and subpixels are fully settled
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (cancelled) return;

      const courseraEl = courseraRef.current;
      const coursesEl = coursesRef.current;
      if (!courseraEl || !coursesEl) return;

      a1 = annotate(courseraEl, {
        type: "highlight",
        color: "var(--accent-highlight)",
        animationDuration: 550,
        iterations: 2,
        multiline: false,
        padding: [2, 6, 2, 6],
      });

      a2 = annotate(coursesEl, {
        type: "highlight",
        color: "var(--accent-highlight)",
        animationDuration: 550,
        iterations: 2,
        multiline: false,
        padding: [2, 6, 2, 6],
      });

      const ag = annotationGroup([a1, a2]);
      ag.show();
      setCourseraActive(true);

      timer = window.setTimeout(() => {
        if (!cancelled) {
          setCoursesActive(true);
        }
      }, 550);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.15 }
    );

    io.observe(heading);

    return () => {
      cancelled = true;
      io.disconnect();
      if (timer) window.clearTimeout(timer);
      if (a1) a1.remove();
      if (a2) a2.remove();
    };
  }, []);

  return (
    <h1
      ref={headingRef}
      className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.12]"
    >
      Save on top{" "}
      <span className="rn-highlight-wrapper">
        <span
          ref={courseraRef}
          className={`rn-highlight-target ${courseraActive ? "is-highlighted" : ""}`}
        >
          Coursera
        </span>
      </span>{" "}
      <span className="rn-highlight-wrapper">
        <span
          ref={coursesRef}
          className={`rn-highlight-target ${coursesActive ? "is-highlighted" : ""}`}
        >
          courses
        </span>
      </span>{" "}
      and{" "}
      <span className="text-[var(--accent-sage)]">specializations</span>
      .
    </h1>
  );
}
