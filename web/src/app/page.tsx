import type { Metadata } from "next";
import { CategoryNav } from "@/components/CategoryNav";
import { Navbar } from "@/components/Navbar";
import { OfferCard } from "@/components/OfferCard";
import { fetchCategories, fetchOffers } from "@/lib/api";

export const metadata: Metadata = {
  title: "CourseDrop — Verified Coursera Deals, Coupons & Discounts",
  description:
    "Find verified Coursera course discounts, exclusive promotion codes, and 100% free courses updated daily.",
  openGraph: {
    title: "CourseDrop — Coursera Deals & Coupons",
    description: "Verified Coursera discounts and free courses.",
    type: "website",
  },
};

export default async function HomePage() {
  const [categories, offersData] = await Promise.all([
    fetchCategories(),
    fetchOffers({ page: 1, page_size: 24 }),
  ]);

  const offers = offersData.items;

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-sm mb-4">
              <span>⚡</span> Daily Verified Coursera Discounts & Free Coupons
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Learn for Less on{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Coursera
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
              Explore verified promotions, specializations discounts, and 100% free course access from top universities.
            </p>
          </div>
        </section>

        {/* Categories & Filter Bar */}
        <div className="border-b border-gray-800/80 bg-gray-950/60 sticky top-14 z-40 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
            <CategoryNav categories={categories} />
          </div>
        </div>

        {/* Deals Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Latest Verified Deals</h2>
              <p className="text-xs text-gray-400">
                Showing {offers.length} active promotions
              </p>
            </div>
          </div>

          {offers.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-12 text-center">
              <span className="text-3xl">🔍</span>
              <h3 className="mt-3 text-base font-semibold text-white">No active deals right now</h3>
              <p className="mt-1 text-sm text-gray-400">
                Check back soon or run the offer sync job in the admin dashboard.
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
