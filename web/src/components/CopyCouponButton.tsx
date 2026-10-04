"use client";

import { useState } from "react";
import { IconCheck, IconCopy } from "./Icons";

interface CopyCouponButtonProps {
  code: string;
}

export function CopyCouponButton({ code }: CopyCouponButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy coupon:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      aria-label={`Copy coupon code ${code}`}
      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs num font-medium text-[var(--accent-sage)] hover:border-[var(--accent-sage)] hover:bg-[var(--accent-sage-soft)] active:scale-[0.99] transition-all"
    >
      <span className="font-bold text-[var(--text-primary)] tracking-wide truncate max-w-[150px] sm:max-w-[180px]">
        {code}
      </span>
      <span className="inline-flex items-center text-[11px] font-sans font-medium text-[var(--text-secondary)] shrink-0">
        {copied ? (
          <span className="inline-flex items-center gap-1 text-[var(--accent-free)] font-semibold">
            <IconCheck size={12} />
            <span>Copied</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <IconCopy size={12} className="opacity-75" />
            <span>Copy</span>
          </span>
        )}
      </span>
    </button>
  );
}
