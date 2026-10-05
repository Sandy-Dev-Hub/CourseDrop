"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconArrowRight,
  IconChevronDown,
  IconGift,
  IconMenu,
  IconSearch,
  IconX,
} from "./Icons";
import { ThemeToggle } from "./ThemeProvider";

interface NavbarProps {
  transparent?: boolean;
}

const CATEGORY_ITEMS = [
  {
    name: "Computer Science",
    href: "/categories/computer-science",
    description: "Software engineering, algorithms & dev",
  },
  {
    name: "Data Science",
    href: "/categories/data-science",
    description: "Analytics, Python, statistics & machine learning",
  },
  {
    name: "AI & ML",
    href: "/categories/artificial-intelligence",
    description: "GenAI, LLMs, neural networks & deep learning",
  },
  {
    name: "Cybersecurity",
    href: "/categories/cybersecurity",
    description: "Network defense, ethical hacking & audits",
  },
  {
    name: "Business",
    href: "/categories/business",
    description: "Finance, marketing, leadership & strategy",
  },
];

export function Navbar({ transparent = true }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Desktop dropdown state
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Mobile navigation state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection
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
          setIsCategoriesOpen(false);
          setIsMobileMenuOpen(false);
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

  // Handle outside click to close desktop dropdown and mobile menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !document.getElementById("mobile-menu-trigger")?.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileMenuOpen]);

  // Handle keyboard navigation (Escape to close, arrow keys)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsCategoriesOpen(false);
      setIsMobileMenuOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      if (!isCategoriesOpen) {
        setIsCategoriesOpen(true);
        setTimeout(() => itemRefs.current[0]?.focus(), 50);
      } else {
        const currentIndex = itemRefs.current.findIndex(
          (el) => el === document.activeElement
        );
        const nextIndex =
          currentIndex < itemRefs.current.length - 1 ? currentIndex + 1 : 0;
        itemRefs.current[nextIndex]?.focus();
      }
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      if (isCategoriesOpen) {
        const currentIndex = itemRefs.current.findIndex(
          (el) => el === document.activeElement
        );
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : itemRefs.current.length - 1;
        itemRefs.current[prevIndex]?.focus();
        e.preventDefault();
      }
    }
  };

  const shouldBeTransparent = transparent && !isScrolled && !isMobileMenuOpen;

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
        {/* 3-Column Grid for True Nav Centering */}
        <div className="mx-auto grid h-full max-w-[1720px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Left Column: Brand Logo */}
          <div className="flex items-center justify-start">
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
          </div>

          {/* Center Column: Exactly 3 Centered Nav Items */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center justify-center gap-1 text-xs font-medium text-[var(--text-secondary)]"
          >
            {/* 1. All Deals */}
            <Link
              href="/deals"
              className="rounded-lg px-3 py-1.5 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
            >
              All Deals
            </Link>

            {/* 2. 100% Free */}
            <Link
              href="/free"
              className="rounded-lg px-3 py-1.5 text-[var(--accent-free)] hover:bg-[var(--accent-free-soft)] transition-colors font-semibold"
            >
              100% Free
            </Link>

            {/* 3. Categories Dropdown */}
            <div
              ref={dropdownRef}
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
              onKeyDown={handleKeyDown}
              className="relative inline-block"
            >
              <button
                ref={triggerRef}
                type="button"
                id="categories-dropdown-trigger"
                aria-haspopup="true"
                aria-expanded={isCategoriesOpen}
                aria-controls="categories-dropdown-menu"
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-sage)] ${
                  isCategoriesOpen
                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                    : "hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span>Categories</span>
                <IconChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    isCategoriesOpen ? "rotate-180 text-[var(--accent-sage)]" : "text-[var(--text-muted)]"
                  }`}
                />
              </button>

              {/* Dropdown Menu Panel */}
              <div
                id="categories-dropdown-menu"
                role="menu"
                aria-labelledby="categories-dropdown-trigger"
                aria-orientation="vertical"
                className={`absolute left-1/2 top-full -translate-x-1/2 pt-2 transition-all duration-200 ease-out origin-top ${
                  isCategoriesOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto visible"
                    : "opacity-0 -translate-y-1.5 pointer-events-none invisible"
                }`}
              >
                <div className="w-72 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/95 backdrop-blur-md p-2 shadow-xl">
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Explore Disciplines
                  </div>

                  <div className="space-y-0.5">
                    {CATEGORY_ITEMS.map((cat, idx) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        ref={(el) => {
                          itemRefs.current[idx] = el;
                        }}
                        role="menuitem"
                        onClick={() => setIsCategoriesOpen(false)}
                        className="group flex flex-col rounded-xl px-2.5 py-2 transition-colors hover:bg-[var(--bg-surface)] focus-visible:outline-2 focus-visible:outline-[var(--accent-sage)]"
                      >
                        <span className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-sage)] transition-colors">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                          {cat.description}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="my-1.5 h-px bg-[var(--border-subtle)]" />

                  {/* View all categories link */}
                  <Link
                    href="/categories"
                    ref={(el) => {
                      itemRefs.current[CATEGORY_ITEMS.length] = el;
                    }}
                    role="menuitem"
                    onClick={() => setIsCategoriesOpen(false)}
                    className="group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-[var(--accent-sage)] hover:bg-[var(--accent-sage-soft)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-sage)]"
                  >
                    <span>View all categories</span>
                    <IconArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Column: Actions */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3">
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

            {/* Segmented sun/moon theme toggle */}
            <ThemeToggle />

            <Link
              href="/admin"
              className="hidden sm:inline-block text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-1.5 py-1"
            >
              Admin
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-trigger"
              type="button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {isMobileMenuOpen ? <IconX size={16} /> : <IconMenu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Sheet */}
        {isMobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            ref={mobileMenuRef}
            className="md:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/95 backdrop-blur-xl px-4 py-4 shadow-xl transition-all"
          >
            <nav className="flex flex-col space-y-1 text-sm font-medium text-[var(--text-primary)]">
              <Link
                href="/deals"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 hover:bg-[var(--bg-surface)] transition-colors"
              >
                All Deals
              </Link>
              <Link
                href="/free"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[var(--accent-free)] font-semibold hover:bg-[var(--accent-free-soft)] transition-colors"
              >
                100% Free
              </Link>

              {/* Mobile Categories Accordion */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 p-2">
                <button
                  type="button"
                  aria-expanded={isMobileCategoriesOpen}
                  onClick={() => setIsMobileCategoriesOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm font-medium text-[var(--text-primary)]"
                >
                  <span>Categories</span>
                  <IconChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${
                      isMobileCategoriesOpen ? "rotate-180 text-[var(--accent-sage)]" : "text-[var(--text-muted)]"
                    }`}
                  />
                </button>

                {isMobileCategoriesOpen && (
                  <div className="mt-1 space-y-0.5 border-t border-[var(--border-subtle)]/70 pt-1.5 pl-2">
                    {CATEGORY_ITEMS.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <Link
                      href="/categories"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--accent-sage)] hover:bg-[var(--accent-sage-soft)] transition-colors"
                    >
                      <span>View all categories</span>
                      <IconArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>

              <div className="my-2 h-px bg-[var(--border-subtle)]" />

              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5"
                >
                  Admin Portal
                </Link>
                <Link
                  href="/free"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-sage-soft)] bg-[var(--accent-sage-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-sage-soft-text)]"
                >
                  <IconGift size={13} />
                  <span>Free Deals</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer to prevent layout shifts on non-hero pages */}
      {!transparent && <div className="h-16 sm:h-20 w-full" aria-hidden="true" />}
    </>
  );
}

