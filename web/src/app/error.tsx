"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { IconAlertCircle } from "@/components/Icons";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/20 border border-red-800/40 text-red-400 mb-4">
            <IconAlertCircle size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Something went wrong
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            We encountered an unexpected error while loading course deals. Please try again or return home.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex items-center rounded-xl bg-[var(--accent-sage)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
