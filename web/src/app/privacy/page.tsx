import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { IconShieldCheck } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Privacy Policy - CourseDrop",
  description: "CourseDrop privacy policy - cookieless, privacy-respecting practices.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 pt-28 pb-14 sm:pt-32 sm:pb-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Effective Date: September 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">
              1. What Data We Collect
            </h2>
            <p className="mb-3">
              CourseDrop collects <strong className="text-[var(--text-primary)]">anonymous click events</strong> when you choose to open an offer link. These events record only:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[var(--text-muted)] mb-3">
              <li>Which offer was clicked (offer ID)</li>
              <li>A salted, one-way cryptographic hash of IP for bot mitigation (raw IP is never saved)</li>
              <li>The page path you clicked from</li>
            </ul>
            <p className="font-semibold text-[var(--text-primary)]">
              We do not store your raw IP address or personal identifying information. Click events cannot be linked back to you individually.
            </p>
          </div>

          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">
              2. Third-Party Affiliate Tracking
            </h2>
            <p className="mb-3">
              When you follow an affiliate link, you are redirected to Coursera through an affiliate network (Impact Radius). Impact and/or Coursera may set cookies on your browser to attribute course enrollment to CourseDrop.
            </p>
            <p>
              This third-party tracking is governed by{" "}
              <a
                href="https://www.coursera.org/about/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-sage)] underline"
              >
                Coursera Privacy Policy
              </a>{" "}
              and Impact privacy standards.
            </p>
          </div>

          <div className="editorial-card p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">
              3. Cookies and Analytics
            </h2>
            <p className="mb-3">
              CourseDrop does not use Google Analytics, Meta Pixel, or intrusive tracking scripts. We do not set first-party tracking cookies on your device.
            </p>
            <p>
              Because we do not use tracking cookies, no disruptive cookie banners are required on our website.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <Link href="/legal" className="text-[var(--accent-sage)] hover:underline">
              Terms of Service →
            </Link>
            <Link href="/contact" className="hover:text-[var(--text-primary)]">
              Privacy Inquiries
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
