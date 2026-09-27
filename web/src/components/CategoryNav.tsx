import Link from "next/link";
import { Category } from "@/types";

interface CategoryNavProps {
  categories: Category[];
  activeSlug?: string;
}

export function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  return (
    <nav className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar" aria-label="Course categories">
      <Link
        href="/"
        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
          !activeSlug
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
            : "bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
        }`}
      >
        All Deals
      </Link>
      <Link
        href="/free"
        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
          activeSlug === "free"
            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
            : "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/40"
        }`}
      >
        🎁 100% Free
      </Link>
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
            }`}
          >
            {cat.name}
            {cat.offer_count > 0 && (
              <span className="ml-1.5 rounded-full bg-gray-800 px-1.5 py-0.2 text-[10px] text-gray-400">
                {cat.offer_count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
