import type { Metadata } from "next";
import { CategoryNav } from "@/components/CategoryNav";
import { Navbar } from "@/components/Navbar";
import { OfferCard } from "@/components/OfferCard";
import { SearchBar } from "@/components/SearchBar";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from "@/components/MotionWrapper";
import { IconSparkles } from "@/components/Icons";
import { SectionDecorativeBackground } from "@/components/SectionDecorativeBackground";
import { fetchCategories, fetchOffers } from "@/lib/api";

export const metadata: Metadata = {
  title: "All Coursera Deals & Discounts - CourseDrop",
  description: "Browse all active Coursera discounts, specializations savings, and promotion codes.",
};

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const { sort = "featured", page = "1" } = await searchParams;
  const pageNum = parseInt(page, 10) || 1;

  const [categories, offersData] = await Promise.all([
    fetchCategories(),
    fetchOffers({ sort, page: pageNum, page_size: 24 }),
  ]);

  const offers = offersData.items;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)] relative">
      <Navbar />

      <main className="flex-1 relative z-10">
        {/* Editorial Header Banner */}
        <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-16 px-4 sm:px-6 lg:px-8">
          <SectionDecorativeBackground variant="split" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <MotionFadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
                All Active Coursera Deals
              </h1>
            </MotionFadeIn>

            <MotionFadeIn delay={0.3}>
              <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-[var(--text-secondary)]">
                Explore hand-verified discounts, coupons, and certificate offers across all subjects.
              </p>
            </MotionFadeIn>

            <MotionFadeIn delay={0.4}>
              <div className="mt-8 mx-auto max-w-xl">
                <SearchBar placeholder="Search active deals by keyword or skill..." />
              </div>
            </MotionFadeIn>
          </div>
        </section>

        {/* Categories Bar */}
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/95 sticky top-0 z-30 backdrop-blur-md shadow-2xs">
          <div className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-3">
            <CategoryNav categories={categories} activeSlug="all" />
          </div>
        </div>

        {/* Deals Listing */}
        <section className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[var(--accent-sage)]"></span>
              <p className="text-xs text-[var(--text-secondary)]">
                Showing <span className="font-semibold text-[var(--text-primary)]">{offers.length}</span> active educational offers
              </p>
            </div>
          </div>

          <MotionStaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            {offers.map((offer) => (
              <MotionStaggerItem key={offer.id}>
                <OfferCard offer={offer} />
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </section>
      </main>
    </div>
  );
}
