import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Terms of Service - CourseDrop",
  description: "CourseDrop Terms of Service and user agreement.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 pt-28 pb-14 sm:pt-32 sm:pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-8">
          Terms of Service
        </h1>

        <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">1. Agreement to Terms</h2>
            <p className="mb-3">
              By accessing and using CourseDrop, you acknowledge and agree to these terms. CourseDrop operates strictly as an informational and deal discovery directory for online educational courses.
            </p>
            <p>
              We do not sell courses, process payments, or provide educational accreditation directly.
            </p>
          </div>

          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">2. Accuracy of Promotions</h2>
            <p className="mb-3">
              We strive to keep all promotional pricing, coupons, and free availability current through automated synchronization jobs. However, Coursera and course instructors may change prices, cancel coupons, or alter course content at any time.
            </p>
            <p>
              Always verify final pricing on the checkout page on Coursera before confirming any enrollment or payment.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <Link href="/affiliate-disclosure" className="text-[var(--accent-sage)] hover:underline">
              Affiliate Disclosure →
            </Link>
            <Link href="/privacy" className="hover:text-[var(--text-primary)]">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
