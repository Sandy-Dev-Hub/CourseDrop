import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryNav } from "@/components/CategoryNav";
import { Navbar } from "@/components/Navbar";
import { OfferCard } from "@/components/OfferCard";
import { fetchCategories, fetchOffers } from "@/lib/api";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} Coursera Deals & Discounts — CourseDrop`,
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
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {title} Coursera Deals
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">
              Verified promotions and discounted courses in {title}.
            </p>
          </div>
        </section>

        {/* Categories Bar */}
        <div className="border-b border-gray-800/80 bg-gray-950/60 sticky top-14 z-40 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
            <CategoryNav categories={categories} activeSlug={slug} />
          </div>
        </div>

        {/* Deals Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {offers.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-12 text-center">
              <span className="text-3xl">📂</span>
              <h3 className="mt-3 text-base font-semibold text-white">
                No active deals in {title} right now
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Check back soon or explore other categories.
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
