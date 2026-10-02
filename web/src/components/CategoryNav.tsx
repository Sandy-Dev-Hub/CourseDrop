"use client";

import Link from "next/link";
import { Category } from "@/types";
import { IconGift, IconLayers } from "./Icons";
import { motion } from "motion/react";

interface CategoryNavProps {
  categories: Category[];
  activeSlug?: string;
}

export function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  const isAll = !activeSlug || activeSlug === "all";
  const isFree = activeSlug === "free";

  return (
    <div className="relative flex items-center gap-1.5 overflow-x-auto py-1.5 no-scrollbar" aria-label="Course categories">
      {/* All Deals Tab */}
      <Link
        href="/deals"
        className={`relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
          isAll ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }`}
      >
        {isAll && (
          <motion.div
            layoutId="activeCategoryTab"
            className="absolute inset-0 rounded-xl bg-[var(--accent-sage)] shadow-xs"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <IconLayers size={14} />
          <span>All Deals</span>
        </span>
      </Link>

      {/* 100% Free Tab */}
      <Link
        href="/free"
        className={`relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
          isFree ? "text-white" : "text-[var(--accent-free)] hover:opacity-90"
        }`}
      >
        {isFree && (
          <motion.div
            layoutId="activeCategoryTab"
            className="absolute inset-0 rounded-xl bg-[var(--accent-free)] shadow-xs"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <IconGift size={14} />
          <span>100% Free</span>
        </span>
      </Link>

      {/* Category Pills */}
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className={`relative inline-flex items-center whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-medium transition-colors ${
              isActive ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategoryTab"
                className="absolute inset-0 rounded-xl bg-[var(--accent-sage)] shadow-xs"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center">
              <span>{cat.name}</span>
              {cat.offer_count > 0 && (
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                  }`}
                >
                  {cat.offer_count}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
