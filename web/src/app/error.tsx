"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";

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
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md">
          <span className="text-5xl">⚠️</span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            We encountered an unexpected error while loading course deals. Please try again.
          </p>
          <div className="mt-6">
            <button
              onClick={() => reset()}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
