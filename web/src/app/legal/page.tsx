import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Terms of Service & Legal Notice - CourseDrop",
  description:
    "CourseDrop Terms of Service, affiliate disclosures, and content guidelines.",
};

export default function LegalPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 pt-28 pb-14 sm:pt-32 sm:pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-8">
          Terms of Service
        </h1>

        <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          {/* Terms of Service */}
          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">1. General Terms</h2>
            <p className="mb-3">
              By using CourseDrop, you agree to these terms. This site is provided solely for educational and informational purposes. We do not guarantee the availability, pricing, or duration of third-party deals.
            </p>
            <p>
              CourseDrop is not responsible for any transactions, refunds, course delivery, or billing conducted on Coursera or through payment providers.
            </p>
          </div>

          {/* Affiliate Disclosure Section */}
          <div id="affiliate-disclosure" className="editorial-card p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">2. Affiliate Disclosure</h2>
            <p className="mb-3">
              CourseDrop participates in affiliate partnerships. When you click outbound deal links and purchase courses, we may receive a commission at no extra cost to you.
            </p>
            <p className="mb-3">
              <strong className="text-[var(--text-primary)]">CourseDrop is not affiliated with or endorsed by Coursera.</strong> All course titles, trademarks, and logos belong to their respective owners.
            </p>
            <p>
              All affiliate links carry <code className="text-[var(--accent-sage)] font-mono text-xs">rel=&quot;sponsored nofollow noopener&quot;</code> attributes in compliance with web standards.
            </p>
          </div>

          {/* Content Policy */}
          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">3. Content Verification Policy</h2>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-muted)]">
              <li>Discounts are calculated from source retail prices; we never inflate percentage figures.</li>
              <li>Promo codes are displayed only when supplied by verified affiliate feeds.</li>
              <li>Offers marked Free are verified for zero-cost audit or tuition waiver availability.</li>
            </ul>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <Link href="/privacy" className="text-[var(--accent-sage)] hover:underline">
              Privacy Policy →
            </Link>
            <Link href="/contact" className="hover:text-[var(--text-primary)]">
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
