import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from "@/components/MotionWrapper";
import { IconChevronRight, IconLayers } from "@/components/Icons";
import { SectionDecorativeBackground } from "@/components/SectionDecorativeBackground";
import { fetchCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Course Categories - CourseDrop",
  description: "Browse Coursera deals, discounts, and promotions by subject category.",
};

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)] relative">
      <Navbar />

      <main className="flex-1 relative z-10">
        <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-16 px-4 sm:px-6 lg:px-8">
          <SectionDecorativeBackground variant="split" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <MotionFadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
                Browse Categories
              </h1>
            </MotionFadeIn>

            <MotionFadeIn delay={0.3}>
              <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Find verified deals and promotional coupons categorized by academic and industry disciplines.
              </p>
            </MotionFadeIn>
          </div>
        </section>

        <section className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-14">
          <MotionStaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => (
              <MotionStaggerItem key={cat.id}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group flex items-center justify-between editorial-card p-6 active:scale-[0.98] transition-all"
                >
                  <div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-sage)] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                      {cat.offer_count} active {cat.offer_count === 1 ? "offer" : "offers"}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] group-hover:bg-[var(--accent-sage)] group-hover:text-white group-hover:border-[var(--accent-sage)] transition-all shadow-xs">
                    <IconChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </section>
      </main>
    </div>
  );
}
