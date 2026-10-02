import type { Metadata } from "next";
import { CategoryNav } from "@/components/CategoryNav";
import { Navbar } from "@/components/Navbar";
import { OfferCard } from "@/components/OfferCard";
import { SearchBar } from "@/components/SearchBar";
import { SectionDecorativeBackground } from "@/components/SectionDecorativeBackground";
import { fetchCategories, fetchOffers } from "@/lib/api";

interface CategoryCoursesProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryCoursesProps): Promise<Metadata> {
  const { category } = await params;
  const name = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} Courses & Programs - CourseDrop`,
    description: `Explore ${name} courses and specializations with verified promotions on Coursera.`,
  };
}

export default async function CategoryCoursesPage({ params }: CategoryCoursesProps) {
  const { category } = await params;
  const [categories, offersData] = await Promise.all([
    fetchCategories(),
    fetchOffers({ category, page: 1, page_size: 32 }),
  ]);

  const currentCategory = categories.find((c) => c.slug === category);
  const title = currentCategory?.name || category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const offers = offersData.items;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-16 px-4 sm:px-6 lg:px-8">
          <SectionDecorativeBackground variant="split" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {title} Courses & Programs
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-[var(--text-secondary)]">
              Top-rated programs and discounts in {title}.
            </p>
            <div className="mt-6 mx-auto max-w-xl">
              <SearchBar placeholder={`Search ${title}...`} />
            </div>
          </div>
        </section>

        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/90 sticky top-16 z-40 backdrop-blur-md">
          <div className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-2.5">
            <CategoryNav categories={categories} activeSlug={category} />
          </div>
        </div>

        <section className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
