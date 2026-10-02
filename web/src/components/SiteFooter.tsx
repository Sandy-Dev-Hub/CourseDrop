"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AffiliateDisclosure } from "./AffiliateDisclosure";
import { IconArrowRight, IconCheck } from "./Icons";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 px-4 sm:px-8 lg:px-12 xl:px-16 transition-colors">
      <div className="mx-auto max-w-[1720px] space-y-12 w-full">
        {/* Top disclosure block */}
        <AffiliateDisclosure variant="footer" />

        {/* Newsletter & Brand Strip inspired by Image 1 */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 mb-2">
              <Image
                src="/logo.png"
                alt="CourseDrop Logo"
                width={32}
                height={32}
                className="h-7 w-auto object-contain"
              />
              <span className="font-bold text-base text-[var(--text-primary)]">
                CourseDrop Digest
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Get weekly verified Coursera coupons and 100% free courses sent directly to your inbox. Zero spam, unsubscribe anytime.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex items-center gap-2">
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-xl bg-[var(--accent-sage-soft)] border border-[var(--border-subtle)] px-4 py-2.5 text-xs font-semibold text-[var(--accent-sage-soft-text)]">
                <IconCheck size={14} />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <div className="flex w-full sm:w-80 items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-1">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:outline-none focus-visible:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-sage)] text-white hover:opacity-90 active:scale-95 transition-all"
                >
                  <IconArrowRight size={14} />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* 4-column Navigation Links */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 pt-4 border-t border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.png"
                alt="CourseDrop Logo"
                width={140}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-[30ch]">
              Curated Coursera promotions, verified discounts, and free coupons updated daily from official channels.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
              Explore Deals
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/deals" className="hover:text-[var(--accent-sage)] transition-colors">
                  All Active Deals
                </Link>
              </li>
              <li>
                <Link href="/free" className="text-[var(--accent-free)] hover:opacity-90 transition-colors font-medium">
                  100% Free Courses
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-[var(--accent-sage)] transition-colors">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link href="/best/python" className="hover:text-[var(--accent-sage)] transition-colors">
                  Best Python Deals
                </Link>
              </li>
              <li>
                <Link href="/best/data-science" className="hover:text-[var(--accent-sage)] transition-colors">
                  Data Science Offers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
              Information
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/about" className="hover:text-[var(--accent-sage)] transition-colors">
                  About CourseDrop
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-[var(--accent-sage)] transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--accent-sage)] transition-colors">
                  Contact & Submit Deal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[var(--accent-sage)] transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/legal" className="hover:text-[var(--accent-sage)] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[var(--accent-sage)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal#affiliate-disclosure" className="hover:text-[var(--accent-sage)] transition-colors">
                  Disclosure Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} CourseDrop. All rights reserved.</p>
          <p className="text-[11px] text-[var(--text-muted)] text-center sm:text-right">
            Independent educational directory. Coursera is a registered trademark of Coursera, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
