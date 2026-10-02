import type { Metadata } from "next";
import { CategoryNav } from "@/components/CategoryNav";
import { Navbar } from "@/components/Navbar";
import { OfferCard } from "@/components/OfferCard";
import { SearchBar } from "@/components/SearchBar";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from "@/components/MotionWrapper";
import { SectionDecorativeBackground } from "@/components/SectionDecorativeBackground";
import { fetchCategories, fetchOffers } from "@/lib/api";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} Coursera Deals & Discounts - CourseDrop`,
    description: `Browse verified Coursera discounts and coupons for ${name} courses.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [categories, offersData] = await Promise.all([
    fetchCategories(),
    fetchOffers({ category: slug, page: 1, page_size: 40 }),
  ]);

  const currentCategory = categories.find((c) => c.slug === slug);
  const title = currentCategory?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const offers = offersData.items;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)] relative">
      <Navbar />

      <main className="flex-1 relative z-10">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-16 px-4 sm:px-6 lg:px-8">
          <SectionDecorativeBackground variant="split" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <MotionFadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
                {title} Deals & Coupons
              </h1>
            </MotionFadeIn>

            <MotionFadeIn delay={0.3}>
              <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-[var(--text-secondary)]">
                Verified promotions, fee waivers, and course discounts in {title}.
              </p>
            </MotionFadeIn>

            <MotionFadeIn delay={0.4}>
              <div className="mt-8 mx-auto max-w-xl">
                <SearchBar placeholder={`Search in ${title}...`} />
              </div>
            </MotionFadeIn>
          </div>
        </section>

        {/* Categories Bar */}
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/95 sticky top-0 z-30 backdrop-blur-md shadow-2xs">
          <div className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-3">
            <CategoryNav categories={categories} activeSlug={slug} />
          </div>
        </div>

        {/* Deals Grid */}
        <section className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs text-[var(--text-secondary)]">
              Showing <span className="font-semibold text-[var(--text-primary)]">{offers.length}</span> active deals in {title}
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
