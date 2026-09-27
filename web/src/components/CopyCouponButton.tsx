"use client";

import { useState } from "react";

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
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-dashed border-indigo-500/50 bg-indigo-950/30 text-xs font-mono font-medium text-indigo-300 hover:bg-indigo-900/50 transition-colors"
    >
      <span>{code}</span>
      <span className="text-[10px] text-indigo-400">
        {copied ? "✓ Copied" : "📋 Copy"}
      </span>
    </button>
  );
}
