import type { Metadata } from "next";
import { CategoryNav } from "@/components/CategoryNav";
import { Navbar } from "@/components/Navbar";
import { OfferCard } from "@/components/OfferCard";
import { fetchCategories, fetchOffers } from "@/lib/api";

export const metadata: Metadata = {
  title: "100% Free Coursera Courses & Coupons — CourseDrop",
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
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-3">
              <span>🎁</span> Zero Cost Learning
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              100% Free Coursera Courses
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">
              Hand-picked free courses and full tuition waiver discounts.
            </p>
          </div>
        </section>

        {/* Categories Bar */}
        <div className="border-b border-gray-800/80 bg-gray-950/60 sticky top-14 z-40 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
            <CategoryNav categories={categories} activeSlug="free" />
          </div>
        </div>

        {/* Deals Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {offers.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-12 text-center">
              <span className="text-3xl">🎁</span>
              <h3 className="mt-3 text-base font-semibold text-white">No 100% free deals right now</h3>
              <p className="mt-1 text-sm text-gray-400">
                Check back soon or explore our discounted deals on the home page.
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
