import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CourseDrop — Coursera Deals & Discounts",
  description:
    "Discover the latest Coursera course deals, discounts, and free coupons. CourseDrop tracks offers so you never miss a deal.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <div className="text-center max-w-2xl">
        {/* Logo area */}
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">CD</span>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">CourseDrop</span>
        </div>

        <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
          Coursera deals,{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            tracked for you
          </span>
        </h1>

        <p className="text-lg text-gray-400 mb-10">
          CourseDrop finds discounts, free courses, and promo codes from Coursera&apos;s official affiliate programme.
          Never pay full price again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#offers"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
          >
            Browse Deals
          </a>
          <a
            href="/legal#affiliate-disclosure"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold transition-colors"
          >
            Affiliate Disclosure
          </a>
        </div>

        {/* Coming soon badge */}
        <p className="mt-12 text-sm text-gray-600">
          Offers are loading — full listings coming in Phase 5 build.
        </p>
      </div>
    </div>
  );
}
