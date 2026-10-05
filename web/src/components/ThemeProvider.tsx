"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IconMoon, IconSun } from "./Icons";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cd_theme") as Theme | null;
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
        document.documentElement.setAttribute("data-theme", stored);
        if (stored === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        const initial = "light";
        setThemeState(initial);
        document.documentElement.setAttribute("data-theme", initial);
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // Fallback if localStorage is restricted
      setThemeState("light");
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("cd_theme", newTheme);
    } catch {
      // Storage unavailable
    }
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={`relative inline-flex h-8 w-[68px] items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5 ${className}`}
      >
        <span className="flex h-7 w-7 items-center justify-center opacity-40">
          <IconMoon size={14} />
        </span>
        <span className="flex h-7 w-7 items-center justify-center opacity-40">
          <IconSun size={14} />
        </span>
      </div>
    );
  }

  const isDark = theme === "dark";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setTheme("dark");
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setTheme("light");
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Theme preference"
      onKeyDown={handleKeyDown}
      className={`relative inline-flex h-8 items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5 shadow-xs transition-colors ${className}`}
    >
      {/* Animated active-segment highlight pill */}
      <div
        aria-hidden="true"
        className={`absolute top-0.5 bottom-0.5 left-0.5 w-7 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs transition-transform duration-250 ease-out motion-reduce:transition-none ${
          isDark ? "translate-x-0" : "translate-x-7"
        }`}
      />

      {/* Dark theme segment (Moon - Left) */}
      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        aria-label="Dark theme"
        title="Dark theme"
        tabIndex={isDark ? 0 : -1}
        onClick={() => setTheme("dark")}
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-sage)] focus-visible:outline-offset-1 ${
          isDark
            ? "text-amber-300 font-semibold"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
      >
        <IconMoon size={14} />
      </button>

      {/* Light theme segment (Sun - Right) */}
      <button
        type="button"
        role="radio"
        aria-checked={!isDark}
        aria-label="Light theme"
        title="Light theme"
        tabIndex={!isDark ? 0 : -1}
        onClick={() => setTheme("light")}
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-sage)] focus-visible:outline-offset-1 ${
          !isDark
            ? "text-amber-500 font-semibold"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
      >
        <IconSun size={14} />
      </button>
    </div>
  );
}

