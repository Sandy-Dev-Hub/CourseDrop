import type { Metadata } from "next";
import { CategoryNav } from "@/components/CategoryNav";
import { Navbar } from "@/components/Navbar";
import { OfferCard } from "@/components/OfferCard";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from "@/components/MotionWrapper";
import { IconGift } from "@/components/Icons";
import { SectionDecorativeBackground } from "@/components/SectionDecorativeBackground";
import { fetchCategories, fetchOffers } from "@/lib/api";

export const metadata: Metadata = {
  title: "100% Free Coursera Courses & Coupons - CourseDrop",
  description:
    "Browse verified free Coursera courses, 100% discount coupons, and free financial aid opportunities.",
};

export default async function FreeDealsPage() {
  const [categories, offersData] = await Promise.all([
    fetchCategories(),
    fetchOffers({ is_free: true, page: 1, page_size: 50 }),
  ]);

  const offers = offersData.items;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)] relative">
      <Navbar />

      <main className="flex-1 relative z-10">
        {/* Editorial Header */}
        <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-16 px-4 sm:px-6 lg:px-8">
          <SectionDecorativeBackground variant="right" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <MotionFadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
                100% Free Coursera Courses
              </h1>
            </MotionFadeIn>

            <MotionFadeIn delay={0.3}>
              <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Hand-picked free courses, promo codes, and full tuition discounts with verified free audit options.
              </p>
            </MotionFadeIn>
          </div>
        </section>

        {/* Categories Bar */}
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/95 sticky top-0 z-30 backdrop-blur-md shadow-2xs">
          <div className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-3">
            <CategoryNav categories={categories} activeSlug="free" />
          </div>
        </div>

        {/* Deals Grid */}
        <section className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs text-[var(--text-secondary)]">
              Showing <span className="font-semibold text-[var(--accent-free)]">{offers.length}</span> zero-cost promotions
            </p>
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
