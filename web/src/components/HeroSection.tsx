"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { SpotlightCard } from "./SpotlightCard";
import { MotionFadeIn } from "./MotionWrapper";
import { IconArrowRight, IconGraduationCap, IconShieldCheck, IconSparkles, IconStar } from "./Icons";
import { Offer } from "@/types";

import { Navbar } from "./Navbar";
import { HeroDecorativeBackground } from "./HeroDecorativeBackground";

interface HeroSectionProps {
  featuredOffer?: Offer | null;
}

export function HeroSection({ featuredOffer }: HeroSectionProps) {
  const displayOffer = featuredOffer || {
    id: 101,
    headline: "The Science of Well-Being by Yale University",
    description: "Yale's world-famous course on building productive habits, happiness, and cognitive wellbeing.",
    discount_percentage: 100,
    offer_type: "FREE_ACCESS",
    course: {
      title: "The Science of Well-Being",
      slug: "the-science-of-well-being",
      rating: 4.9,
      enrollment_count: 4500000,
    },
  };

  const isFree = displayOffer.offer_type === "FREE_ACCESS" || displayOffer.discount_percentage === 100;

  return (
    <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-page)] min-h-screen flex flex-col justify-between">
      {/* Decorative Atmosphere Background Layer */}
      <HeroDecorativeBackground />

      {/* Transparent Navbar embedded inside Hero */}
      <Navbar transparent={true} />

      <div className="mx-auto max-w-[1720px] relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 my-auto py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Asymmetric Editorial Typography & Search */}
          <div className="lg:col-span-7 space-y-6">
            <MotionFadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.12]">
                Save on top Coursera courses and specializations.
              </h1>
            </MotionFadeIn>

            <MotionFadeIn delay={0.3}>
              <p className="max-w-2xl text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed">
                Track verified discounts, active promo codes, and 100% free courses updated daily from official feeds.
              </p>
            </MotionFadeIn>

            <MotionFadeIn delay={0.4}>
              <div className="pt-2 max-w-2xl">
                <SearchBar size="large" />
              </div>
            </MotionFadeIn>

            {/* Quick Pills */}
            <MotionFadeIn delay={0.5}>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)] pt-1">
                <span className="text-[var(--text-muted)] font-medium">Quick links:</span>
                <Link
                  href="/free"
                  className="rounded-full border border-[var(--accent-free)]/30 bg-[var(--accent-free-soft)] px-3 py-1 text-[var(--accent-free-soft-text)] font-semibold hover:opacity-90 shadow-xs transition-all"
                >
                  100% Free
                </Link>
                <Link
                  href="/categories/computer-science"
                  className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-all"
                >
                  Computer Science
                </Link>
                <Link
                  href="/categories/data-science"
                  className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-all"
                >
                  Data Science
                </Link>
                <Link
                  href="/best/ai-machine-learning"
                  className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-all"
                >
                  AI & ML
                </Link>
              </div>
            </MotionFadeIn>
          </div>

          {/* Right Column: Featured Live Spotlight Deal */}
          <div className="lg:col-span-5">
            <MotionFadeIn delay={0.3} direction="left">
              <SpotlightCard className="editorial-card p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-sage-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-sage-soft-text)] border border-[var(--border-subtle)]">
                      <IconSparkles size={12} />
                      <span>Featured Deal Spotlight</span>
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        isFree
                          ? "bg-[var(--accent-free-soft)] text-[var(--accent-free-soft-text)] border border-[var(--accent-free)]/20"
                          : "bg-[var(--accent-sage-soft)] text-[var(--accent-sage-soft-text)] border border-[var(--accent-sage)]/20"
                      }`}
                    >
                      {isFree ? "100% FREE" : `${Math.round(displayOffer.discount_percentage || 50)}% OFF`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-2">
                    <IconGraduationCap size={14} className="text-[var(--accent-sage)]" />
                    <span>Yale University / Coursera</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] line-clamp-2">
                    {displayOffer.course?.title || displayOffer.headline}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                    {displayOffer.description}
                  </p>

                  <div className="mt-5 flex items-center gap-4 text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-4">
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <IconStar size={13} />
                      <span>4.9 / 5.0</span>
                    </div>
                    <span>4.5M+ enrolled</span>
                    <div className="flex items-center gap-1 text-[var(--accent-sage)] ml-auto font-medium">
                      <IconShieldCheck size={13} />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/course/${displayOffer.course?.slug || "the-science-of-well-being"}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-sage)] px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    <span>View Deal Details</span>
                    <IconArrowRight size={14} />
                  </Link>
                </div>
              </SpotlightCard>
            </MotionFadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
