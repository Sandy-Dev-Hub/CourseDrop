"use client";

import React from "react";

interface SectionDecorativeBackgroundProps {
  variant?: "right" | "left" | "split" | "minimal";
  className?: string;
}

export function SectionDecorativeBackground({
  variant = "right",
  className = "",
}: SectionDecorativeBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inset-0 z-0 overflow-hidden w-full h-full ${className}`}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1400 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="section-grad-right" x1="100%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#dcefe4" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#ecf6f0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fbf9f5" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="section-grad-left" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#d8ebe0" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#eaf4ee" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fbf9f5" stopOpacity="0" />
          </linearGradient>

          {/* Dark Mode Gradients */}
          <linearGradient id="section-dark-grad-right" x1="100%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#1e3525" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#17281d" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#131412" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="section-dark-grad-left" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#1c3022" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#15241a" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#131412" stopOpacity="0" />
          </linearGradient>
        </defs>

        {(variant === "right" || variant === "split") && (
          <>
            {/* Light Mode Right Wave */}
            <path
              d="M850,-50 C1050,-20 1280,80 1480,20 L1480,480 C1300,520 1120,400 950,280 C820,180 750,40 850,-50 Z"
              fill="url(#section-grad-right)"
              className="dark:hidden"
            />
            {/* Dark Mode Right Wave */}
            <path
              d="M850,-50 C1050,-20 1280,80 1480,20 L1480,480 C1300,520 1120,400 950,280 C820,180 750,40 850,-50 Z"
              fill="url(#section-dark-grad-right)"
              className="hidden dark:inline"
            />
          </>
        )}

        {(variant === "left" || variant === "split") && (
          <>
            {/* Light Mode Left Wave */}
            <path
              d="M-80,-60 C120,-30 240,120 180,320 C130,480 -20,540 -100,640 L-120,-60 Z"
              fill="url(#section-grad-left)"
              className="dark:hidden"
            />
            {/* Dark Mode Left Wave */}
            <path
              d="M-80,-60 C120,-30 240,120 180,320 C130,480 -20,540 -100,640 L-120,-60 Z"
              fill="url(#section-dark-grad-left)"
              className="hidden dark:inline"
            />
          </>
        )}
      </svg>

      {/* Subtle Dot Cluster (4 cols x 3 rows) */}
      {variant !== "minimal" && (
        <div
          className={`absolute opacity-35 dark:opacity-20 ${
            variant === "left" ? "top-10 left-12" : "top-8 right-12 sm:right-20"
          }`}
        >
          <svg width="72" height="48" viewBox="0 0 72 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[0, 24, 48, 72].map((x) =>
              [0, 24, 48].map((y) => (
                <circle
                  key={`section-dot-${x}-${y}`}
                  cx={x}
                  cy={y}
                  r="2"
                  className="fill-[var(--accent-sage)]"
                />
              ))
            )}
          </svg>
        </div>
      )}

      {/* Subtle Sparkle Accent */}
      {variant !== "minimal" && (
        <div
          className={`absolute text-[var(--accent-sage)] opacity-60 dark:opacity-40 ${
            variant === "left" ? "top-20 left-44" : "top-14 right-8 sm:right-12"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
          </svg>
        </div>
      )}
    </div>
  );
}
