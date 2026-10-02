import type { Metadata } from "next";
import { CategoryNav } from "@/components/CategoryNav";
import { Navbar } from "@/components/Navbar";
import { OfferCard } from "@/components/OfferCard";
import { IconGift } from "@/components/Icons";
import { fetchCategories, fetchOffers } from "@/lib/api";

interface FreeCategoryProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: FreeCategoryProps): Promise<Metadata> {
  const { category } = await params;
  const name = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Free ${name} Courses & Coupons - CourseDrop`,
    description: `Verified 100% free Coursera courses and certificates in ${name}.`,
  };
}

export default async function FreeCategoryPage({ params }: FreeCategoryProps) {
  const { category } = await params;
  const [categories, offersData] = await Promise.all([
    fetchCategories(),
    fetchOffers({ category, is_free: true, page: 1, page_size: 32 }),
  ]);

  const currentCategory = categories.find((c) => c.slug === category);
  const title = currentCategory?.name || category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const offers = offersData.items;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              Free {title} Courses
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-[var(--text-secondary)]">
              Verified 100% free courses and coupon waivers for {title}.
            </p>
          </div>
        </section>

        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/90 sticky top-16 z-40 backdrop-blur-md">
          <div className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-2.5">
            <CategoryNav categories={categories} activeSlug={category} />
          </div>
        </div>

        <section className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs text-[var(--text-secondary)]">
              Showing <span className="font-semibold text-[var(--accent-free)]">{offers.length}</span> free deals in {title}
            </p>
          </div>

          {offers.length === 0 ? (
            <div className="editorial-card p-12 text-center">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                No free courses in {title} right now
              </h3>
              <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                Check back soon or explore all discounted deals in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
