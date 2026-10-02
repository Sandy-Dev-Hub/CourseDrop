import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { IconGraduationCap, IconShieldCheck, IconSparkles } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About CourseDrop - Independent Educational Deals Directory",
  description:
    "Learn how CourseDrop helps learners find verified discounts and coupons for Coursera courses.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 pt-28 pb-14 sm:pt-32 sm:pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            About CourseDrop
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            CourseDrop is an independent directory dedicated to helping learners worldwide discover verified discounts, coupons, and free course access on Coursera.
          </p>
        </div>

        <div className="space-y-8 text-sm text-[var(--text-secondary)] leading-relaxed">
          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <IconShieldCheck size={18} className="text-[var(--accent-sage)]" />
              <span>How We Verify Deals</span>
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              Unlike generic coupon aggregators filled with expired codes and clickbait links, CourseDrop uses automated daily validation against official affiliate feeds. Every deal listed is tested for validity, currency accuracy, and active redemption windows.
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-muted)]">
              <li>No fabricated discounts: original prices and discount percentages are sourced directly.</li>
              <li>Coupon codes are provided only when verified by official promotional feeds.</li>
              <li>Automated delisting checks ensure 404s and expired offers are promptly pruned.</li>
            </ul>
          </div>

          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <IconGraduationCap size={18} className="text-[var(--accent-sage)]" />
              <span>Independence & Transparency</span>
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              <strong className="text-[var(--text-primary)]">CourseDrop is an independent entity and is not affiliated with or endorsed by Coursera, Inc.</strong> We are passionate about lifelong education and aim to make university-level learning accessible to all budgets.
            </p>
            <p className="text-[var(--text-secondary)]">
              To support server costs and daily verification pipelines, CourseDrop participates in affiliate marketing programs. When you follow an affiliate link and make a purchase, we may earn a small referral fee at no additional cost to you.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <Link href="/affiliate-disclosure" className="text-[var(--accent-sage)] hover:underline">
              Read our Affiliate Disclosure →
            </Link>
            <Link href="/contact" className="hover:text-[var(--text-primary)]">
              Contact us
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
