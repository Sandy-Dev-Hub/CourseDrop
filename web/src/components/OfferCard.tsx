import Link from "next/link";
import { Offer } from "@/types";
import { getOfferClickUrl } from "@/lib/api";
import { CopyCouponButton } from "./CopyCouponButton";

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
    <article className="group relative flex flex-col justify-between rounded-xl border border-gray-800 bg-gray-900/60 p-5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-indigo-500/10">
      {/* Top badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-950/60 px-2.5 py-0.5 text-[11px] font-medium text-blue-400 border border-blue-800/40">
            <span>🎓</span> Coursera
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
              isFree
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
            }`}
          >
            {discountText}
          </span>
        </div>

        {/* Title / Headline */}
        <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
          {course?.title || offer.headline}
        </h3>

        {/* Course Description / Deal notes */}
        <p className="mt-2 text-xs text-gray-400 line-clamp-2">
          {offer.description || course?.description || offer.headline}
        </p>

        {/* Categories if available */}
        {course?.categories && course.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {course.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="rounded bg-gray-800/80 px-2 py-0.5 text-[10px] text-gray-300"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pricing and Action */}
      <div className="mt-5 pt-4 border-t border-gray-800/80">
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-2">
            {isFree ? (
              <span className="text-lg font-bold text-emerald-400">FREE</span>
            ) : offer.discounted_price !== null && offer.discounted_price !== undefined ? (
              <span className="text-lg font-bold text-white">
                ${Number(offer.discounted_price).toFixed(2)}
              </span>
            ) : (
              <span className="text-sm font-semibold text-indigo-300">Discounted</span>
            )}
            {offer.original_price && (
              <span className="text-xs text-gray-500 line-through">
                ${Number(offer.original_price).toFixed(2)}
              </span>
            )}
          </div>

          {offer.coupon_code && <CopyCouponButton code={offer.coupon_code} />}
        </div>

        {/* CTA and affiliate notice */}
        <a
          href={clickUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
        >
          <span>Get Deal on Coursera</span>
          <span aria-hidden="true">→</span>
        </a>

        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500">
          <span>Ad / Affiliate Link</span>
          {offer.valid_to && (
            <span>
              Expires {new Date(offer.valid_to).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
