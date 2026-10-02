"use client";

import React, { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "var(--accent-sage-soft)",
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const reduce = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    if (!reduce) setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (!reduce) setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-7 shadow-[var(--card-shadow)] transition-all duration-300 hover:border-[var(--border-hover)] ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      {!reduce && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 55%)`,
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10 flex h-full flex-col justify-between">{children}</div>
    </div>
  );
}
