import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { OfferCard } from "@/components/OfferCard";
import { SearchBar } from "@/components/SearchBar";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from "@/components/MotionWrapper";
import { IconSearch } from "@/components/Icons";
import { SectionDecorativeBackground } from "@/components/SectionDecorativeBackground";
import { fetchOffers } from "@/lib/api";

export const metadata: Metadata = {
  title: "Search Deals - CourseDrop",
  description: "Search Coursera courses, promotions, and coupons.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const trimmedQuery = q.trim();

  const offersData = trimmedQuery
    ? await fetchOffers({ search: trimmedQuery, page_size: 32 })
    : { items: [], total: 0, page: 1, page_size: 32, total_pages: 1 };

  const offers = offersData.items;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)] relative">
      <Navbar />

      <main className="flex-1 relative z-10">
        {/* Search header */}
        <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-16 px-4 sm:px-6 lg:px-8">
          <SectionDecorativeBackground variant="split" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <MotionFadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
                Search Coursera Deals
              </h1>
            </MotionFadeIn>

            <MotionFadeIn delay={0.2}>
              <SearchBar initialQuery={trimmedQuery} size="large" />
            </MotionFadeIn>

            {/* Quick search tags */}
            <MotionFadeIn delay={0.3}>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">Popular searches:</span>
                <Link
                  href="/search?q=Python"
                  className="rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] px-3.5 py-1 text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Python
                </Link>
                <Link
                  href="/search?q=Data%20Science"
                  className="rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] px-3.5 py-1 text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Data Science
                </Link>
                <Link
                  href="/search?q=Google"
                  className="rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] px-3.5 py-1 text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Google Certificates
                </Link>
                <Link
                  href="/search?q=Free"
                  className="rounded-full bg-[var(--accent-free-soft)] border border-[var(--accent-free)]/30 px-3.5 py-1 text-[var(--accent-free-soft-text)] hover:opacity-90 font-semibold transition-colors"
                >
                  Free Access
                </Link>
              </div>
            </MotionFadeIn>
          </div>
        </section>

        {/* Results */}
        <section className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
          {trimmedQuery ? (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Search results for &ldquo;{trimmedQuery}&rdquo;
                </h2>
                <span className="text-xs text-[var(--text-muted)]">
                  {offers.length} {offers.length === 1 ? "deal" : "deals"} found
                </span>
              </div>

              {offers.length === 0 ? (
                <div className="editorial-card p-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] mb-3">
                    <IconSearch size={22} />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    No matching deals found
                  </h3>
                  <p className="mt-1 text-xs text-[var(--text-muted)] max-w-md mx-auto">
                    Try searching for broader keywords like &ldquo;Python&rdquo;, &ldquo;Machine Learning&rdquo;, or &ldquo;Free&rdquo;.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/deals"
                      className="inline-flex items-center rounded-xl bg-[var(--accent-sage)] px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
                    >
                      Browse All Deals
                    </Link>
                  </div>
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
            </div>
          ) : (
            <div className="editorial-card p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-sage-soft)] text-[var(--accent-sage-soft-text)] border border-[var(--border-subtle)] mb-3">
                <IconSearch size={22} />
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                Enter a topic or course name to search
              </h3>
              <p className="mt-1 text-xs text-[var(--text-muted)] max-w-md mx-auto">
                Find verified discounts, coupon codes, and university specializations.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
