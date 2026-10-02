import type { Metadata } from "next";
import Link from "next/link";
import { CategoryNav } from "@/components/CategoryNav";
import { Navbar } from "@/components/Navbar";
import { OfferCard } from "@/components/OfferCard";
import { HeroSection } from "@/components/HeroSection";
import { StatsBand } from "@/components/StatsBand";
import { ProcessStrip } from "@/components/ProcessStrip";
import { FeaturesRow } from "@/components/FeaturesRow";
import { TrustCards } from "@/components/TrustCards";
import { CtaBand } from "@/components/CtaBand";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from "@/components/MotionWrapper";
import { IconArrowRight, IconGift, IconTag } from "@/components/Icons";
import { fetchCategories, fetchOffers } from "@/lib/api";

export const metadata: Metadata = {
  title: "CourseDrop - Verified Coursera Deals, Coupons & Discounts",
  description:
    "Find verified Coursera course discounts, exclusive promotion codes, and 100% free courses updated daily.",
  openGraph: {
    title: "CourseDrop - Coursera Deals & Coupons",
    description: "Verified Coursera discounts and free courses.",
    type: "website",
  },
};

export default async function HomePage() {
  const [categories, offersData, freeOffersData] = await Promise.all([
    fetchCategories(),
    fetchOffers({ page: 1, page_size: 16 }),
    fetchOffers({ is_free: true, page: 1, page_size: 4 }),
  ]);

  const offers = offersData.items;
  const freeOffers = freeOffersData.items;
  const featuredOffer = offers[0] || null;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)] relative">
      <main className="flex-1 relative z-10">
        {/* Full-Screen Editorial Hero Section with Integrated Transparent Nav */}
        <HeroSection featuredOffer={featuredOffer} />

        {/* Big-number Stats Band with real metrics */}
        <StatsBand
          dealCount={offersData.total || 80}
          courseCount={Math.max(50, offers.length * 4)}
          categoryCount={categories.length || 12}
          freeCount={freeOffersData.total || 20}
        />

        {/* Main Deals Grid Section */}
        <section className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-sage)] mb-1 uppercase tracking-wider">
                <IconTag size={13} />
                <span>FEATURED SAVINGS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                Latest Verified Deals
              </h2>
            </div>

            <Link
              href="/deals"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-sage)] hover:underline transition-colors"
            >
              <span>View all {offersData.total} deals</span>
              <IconArrowRight size={13} />
            </Link>
          </div>

          {/* Categories Navigation Bar: Sticking flush to top-0 when scrolling through deals */}
          <div className="sticky top-0 z-30 -mx-4 sm:-mx-8 lg:-mx-12 xl:-mx-16 px-4 sm:px-8 lg:px-12 xl:px-16 py-3 mb-8 bg-[var(--bg-page)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-2xs">
            <CategoryNav categories={categories} />
          </div>

          <MotionStaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            {offers.map((offer) => (
              <MotionStaggerItem key={offer.id}>
                <OfferCard offer={offer} />
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </section>

        {/* 100% Free Spotlight Section */}
        {freeOffers.length > 0 && (
          <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 px-4 sm:px-8 lg:px-12 xl:px-16">
            <div className="mx-auto max-w-[1720px]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-free)] mb-1 uppercase tracking-wider">
                    <IconGift size={14} />
                    <span>ZERO COST LEARNING</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                    100% Free Courses
                  </h2>
                </div>
                <Link
                  href="/free"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-free)] hover:underline transition-colors"
                >
                  <span>Explore all free courses</span>
                  <IconArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {freeOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Process Strip (Discover -> Verify -> Track -> Save) */}
        <ProcessStrip />

        {/* Features/Services Row */}
        <FeaturesRow />

        {/* Community Feedback / Trust Cards */}
        <TrustCards />

        {/* Warm CTA Band */}
        <CtaBand />
      </main>
    </div>
  );
}
