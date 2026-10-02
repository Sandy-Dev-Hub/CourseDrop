"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconGift, IconSearch, IconSparkles } from "./Icons";
import { ThemeToggle } from "./ThemeProvider";

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = true }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // At the very top (opening position): always visible & transparent
      if (currentScrollY <= 20) {
        setIsVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);

        // Scrolling Down: hide the navbar
        if (currentScrollY > lastScrollY && currentScrollY > 60) {
          setIsVisible(false);
        } 
        // Scrolling Up (even a little bit): reveal the navbar
        else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
      }

      lastScrollY = Math.max(0, currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldBeTransparent = transparent && !isScrolled;

  return (
    <>
      {/* Smart Nav: visible on page open, hides on scroll down, reappears on scroll up */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        } ${
          shouldBeTransparent
            ? "h-20 bg-transparent border-b border-transparent shadow-none"
            : "h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/85 backdrop-blur-md shadow-xs"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1720px] items-center justify-between px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Brand Logo & Core Nav */}
          <div className="flex items-center gap-7">
            <Link href="/" className="flex items-center gap-2 group py-1">
              <Image
                src="/logo.png"
                alt="CourseDrop Logo"
                width={160}
                height={48}
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            {/* Primary single-line Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)]">
              <Link
                href="/deals"
                className="rounded-lg px-3 py-1.5 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
              >
                All Deals
              </Link>
              <Link
                href="/free"
                className="rounded-lg px-3 py-1.5 text-[var(--accent-free)] hover:bg-[var(--accent-free-soft)] transition-colors font-semibold"
              >
                100% Free
              </Link>
              <Link
                href="/categories"
                className="rounded-lg px-3 py-1.5 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/categories/computer-science"
                className="rounded-lg px-3 py-1.5 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
              >
                Computer Science
              </Link>
              <Link
                href="/categories/data-science"
                className="rounded-lg px-3 py-1.5 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
              >
                Data Science
              </Link>
              <Link
                href="/categories/artificial-intelligence"
                className="rounded-lg px-3 py-1.5 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
              >
                AI & ML
              </Link>
              <Link
                href="/categories/cybersecurity"
                className="rounded-lg px-3 py-1.5 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
              >
                Cybersecurity
              </Link>
              <Link
                href="/categories/business"
                className="rounded-lg px-3 py-1.5 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
              >
                Business
              </Link>
            </nav>
          </div>

          {/* Right Actions: Search, Free Deals Badge, Theme Toggle, Admin */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/search"
              aria-label="Search deals"
              className="flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              <IconSearch size={15} />
            </Link>

            <Link
              href="/free"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-sage-soft)] bg-[var(--accent-sage-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-sage-soft-text)] hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <IconGift size={13} />
              <span>Free Deals</span>
            </Link>

            {/* Dual-mode visual Theme Toggle */}
            <ThemeToggle />

            <Link
              href="/admin"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-1.5 py-1"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer to prevent layout shifts on non-hero pages */}
      {!transparent && <div className="h-16 sm:h-20 w-full" aria-hidden="true" />}
    </>
  );
}
