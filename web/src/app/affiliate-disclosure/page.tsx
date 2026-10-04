import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { IconInfo, IconShieldCheck } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Affiliate Disclosure - CourseDrop",
  description: "Complete transparent affiliate disclosure and advertising policy for CourseDrop.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 pt-28 pb-14 sm:pt-32 sm:pb-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Affiliate Disclosure
          </h1>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Last updated: September 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">
              How CourseDrop is Funded
            </h2>
            <p className="mb-4">
              CourseDrop participates in affiliate marketing programs, primarily the Coursera affiliate program managed through Impact Radius.
            </p>
            <p className="mb-4">
              When you click on certain outbound links on this website and subsequently enroll in a course or purchase a Coursera Plus subscription, we may receive a small referral commission.
            </p>
            <p className="font-semibold text-[var(--text-primary)]">
              This commission comes at absolutely no extra cost to you. The price you pay is identical to (or discounted from) standard retail prices.
            </p>
          </div>

          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">
              Non-Affiliation Notice
            </h2>
            <p className="mb-3">
              <strong className="text-[var(--text-primary)]">CourseDrop is an independent website and is not owned, operated, endorsed by, or affiliated with Coursera, Inc.</strong>
            </p>
            <p>
              Coursera, the Coursera logo, and related trademarks are the property of Coursera, Inc. All course materials, pricing structures, and university certificates are governed by Coursera terms.
            </p>
          </div>

          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <IconShieldCheck size={16} className="text-[var(--accent-sage)]" />
              <span>Link Compliance & Editorial Independence</span>
            </h2>
            <p className="mb-3">
              All promotional outbound links on CourseDrop use the <code className="text-[var(--accent-sage)] num text-xs">rel=&quot;sponsored nofollow noopener&quot;</code> attribute in accordance with FTC guidelines and search engine standards.
            </p>
            <p>
              We maintain strict editorial standards: commissions never influence which deals are featured as top offers or marked as verified.
            </p>
          </div>

          <div className="pt-4 text-xs text-[var(--text-muted)]">
            <Link href="/legal" className="text-[var(--accent-sage)] hover:underline">
              View Terms of Service →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
