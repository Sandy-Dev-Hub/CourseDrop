"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconSearch } from "./Icons";

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  size?: "default" | "large";
}

export function SearchBar({
  initialQuery = "",
  placeholder = "Search Coursera deals, specializations, or promo codes...",
  size = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/deals");
    }
  };

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className="w-full relative outline-none focus:outline-none">
      <div
        className={`relative flex items-center w-full rounded-full transition-all duration-200 border ${
          isFocused
            ? "border-[var(--accent-sage)] shadow-sm ring-2 ring-[var(--accent-sage)]/20"
            : "border-[var(--border-subtle)] shadow-xs"
        } bg-[var(--bg-card)]`}
      >
        <span
          className={`absolute left-4.5 transition-colors ${
            isFocused ? "text-[var(--accent-sage)]" : "text-[var(--text-muted)]"
          } pointer-events-none flex items-center justify-center`}
        >
          <IconSearch size={isLarge ? 18 : 15} />
        </span>
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:outline-none focus-visible:outline-none border-none ring-0 focus:ring-0 ${
            isLarge
              ? "py-3.5 pl-12 pr-28 text-sm sm:text-base rounded-full"
              : "py-2.5 pl-11 pr-24 text-xs sm:text-sm rounded-full"
          }`}
        />
        <button
          type="submit"
          className={`absolute right-1.5 rounded-full bg-[var(--accent-sage)] font-semibold text-white shadow-xs hover:opacity-90 active:scale-[0.98] transition-all ${
            isLarge ? "px-5 py-2 text-xs sm:text-sm" : "px-3.5 py-1.5 text-xs"
          }`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
