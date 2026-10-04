import Link from "next/link";
import { Offer } from "@/types";
import { getOfferClickUrl } from "@/lib/api";
import { CopyCouponButton } from "./CopyCouponButton";
import { IconArrowRight, IconClock, IconGraduationCap, IconShieldCheck } from "./Icons";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const course = offer.course;
  const clickUrl = getOfferClickUrl(offer.id);
  const isFree = offer.offer_type === "FREE_ACCESS" || offer.discount_percentage === 100.0;
  const discountText = isFree
    ? "100% FREE"
    : offer.discount_percentage
    ? `${Math.round(offer.discount_percentage)}% OFF`
    : "SPECIAL DEAL";

  return (
    <article className="group relative flex h-full flex-col justify-between editorial-card p-5 sm:p-6">
      {/* Top badges & course info */}
      <div className="flex flex-col flex-1">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 h-7 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] border border-[var(--border-subtle)] shadow-xs">
            <IconGraduationCap size={13} className="text-[var(--accent-sage)]" />
            <span>Coursera</span>
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-tight ${
              isFree
                ? "bg-[var(--accent-free-soft)] text-[var(--accent-free-soft-text)] border border-[var(--accent-free)]/20"
                : "bg-[var(--accent-sage-soft)] text-[var(--accent-sage-soft-text)] border border-[var(--accent-sage)]/20"
            }`}
          >
            {discountText}
          </span>
        </div>

        {/* Title / Headline (uniform clamped height) */}
        <h3 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-sage)] transition-colors line-clamp-2 leading-snug min-h-[2.85rem] flex items-center">
          {course?.slug ? (
            <Link href={`/course/${course.slug}`} className="hover:underline line-clamp-2">
              {course?.title || offer.headline}
            </Link>
          ) : (
            <span className="line-clamp-2">{course?.title || offer.headline}</span>
          )}
        </h3>

        {/* Course Description (uniform clamped height) */}
        <p className="mt-2 text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {offer.description || course?.description || offer.headline}
        </p>

        {/* Category tags (fixed container height for uniform alignment) */}
        <div className="mt-3.5 min-h-[1.75rem] flex flex-wrap gap-1.5 items-center">
          {course?.categories && course.categories.length > 0 ? (
            course.categories.slice(0, 2).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
              >
                {cat.name}
              </Link>
            ))
          ) : (
            <span className="text-[10px] text-[var(--text-muted)] opacity-60">Verified Course</span>
          )}
        </div>
      </div>

      {/* Pricing, coupon & CTA (always pinned to bottom) */}
      <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
        {/* Pricing Row */}
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-2">
            {isFree ? (
              <span className="text-xl font-bold text-[var(--accent-free)]">FREE</span>
            ) : offer.discounted_price !== null && offer.discounted_price !== undefined ? (
              <span className="text-xl font-bold text-[var(--text-primary)] num">
                ${Number(offer.discounted_price).toFixed(2)}
              </span>
            ) : (
              <span className="text-sm font-semibold text-[var(--accent-sage)]">Discounted</span>
            )}
            {offer.original_price !== null && offer.original_price !== undefined && (
              <span className="text-xs text-[var(--text-muted)] line-through num">
                ${Number(offer.original_price).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Coupon Code Strip (Contained inside card) */}
        {offer.coupon_code && (
          <div className="mb-3">
            <CopyCouponButton code={offer.coupon_code} />
          </div>
        )}

        {/* Outbound CTA with rel="sponsored nofollow noopener" */}
        <a
          href={clickUrl}
          target="_blank"
          rel="sponsored nofollow noopener"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-sage)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <span>Get Deal on Coursera</span>
          <IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </a>

        {/* Affiliate disclosure micro-notice and expiry */}
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <IconShieldCheck size={11} className="text-[var(--accent-sage)]" />
            <span>Ad / Affiliate Link</span>
          </span>
          {offer.valid_to && (
            <span className="flex items-center gap-1">
              <IconClock size={10} />
              <span>Expires {new Date(offer.valid_to).toLocaleDateString()}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
