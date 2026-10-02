import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { OfferCard } from "@/components/OfferCard";
import { SearchBar } from "@/components/SearchBar";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from "@/components/MotionWrapper";
import { IconSparkles } from "@/components/Icons";
import { SectionDecorativeBackground } from "@/components/SectionDecorativeBackground";
import { fetchOffers } from "@/lib/api";

interface BestCollectionProps {
  params: Promise<{ collection: string }>;
}

export async function generateMetadata({ params }: BestCollectionProps): Promise<Metadata> {
  const { collection } = await params;
  const name = collection.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Best ${name} Coursera Deals & Coupons - CourseDrop`,
    description: `Curated best ${name} courses, specializations, and verified promo discounts.`,
  };
}

export default async function BestCollectionPage({ params }: BestCollectionProps) {
  const { collection } = await params;
  const searchKeywords = collection.replace(/-/g, " ");
  const isFree = collection.includes("free");

  const offersData = await fetchOffers({
    search: searchKeywords,
    is_free: isFree ? true : undefined,
    sort: "discount_desc",
    page_size: 24,
  });

  const title = collection.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const offers = offersData.items;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)] relative">
      <Navbar />

      <main className="flex-1 relative z-10">
        <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-16 px-4 sm:px-6 lg:px-8">
          <SectionDecorativeBackground variant="left" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <MotionFadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
                Best {title} Deals
              </h1>
            </MotionFadeIn>

            <MotionFadeIn delay={0.3}>
              <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Top-rated programs, university specializations, and verified discounts in {title}.
              </p>
            </MotionFadeIn>

            <MotionFadeIn delay={0.4}>
              <div className="mt-8 mx-auto max-w-xl">
                <SearchBar placeholder={`Search within ${title}...`} />
              </div>
            </MotionFadeIn>
          </div>
        </section>

        <section className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
          {offers.length === 0 ? (
            <div className="editorial-card p-12 text-center">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">No active offers for {title}</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Check back shortly or browse our complete deals directory.
              </p>
            </div>
          ) : (
            <MotionStaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
              {offers.map((offer) => (
                <MotionStaggerItem key={offer.id}>
                  <OfferCard offer={offer} />
                </MotionStaggerItem>
              ))}
            </MotionStaggerContainer>
          )}
        </section>
      </main>
    </div>
  );
}
