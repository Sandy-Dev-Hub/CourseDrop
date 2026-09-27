import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CourseDrop's privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">What data we collect</h2>
        <p className="text-gray-400 mb-4">
          CourseDrop collects <strong className="text-gray-200">anonymous click events</strong> when you click on an
          offer. These events record only:
        </p>
        <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
          <li>Which offer was clicked (offer ID)</li>
          <li>An optional anonymous session identifier (no user account required)</li>
          <li>The page path you clicked from</li>
        </ul>
        <p className="text-gray-400">
          <strong className="text-gray-200">We do not store your IP address or User-Agent string.</strong> Click events
          cannot be linked back to you individually.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Third-party affiliate tracking</h2>
        <p className="text-gray-400 mb-4">
          When you follow an affiliate link, you are redirected to Coursera through an affiliate tracking system (Impact
          Radius). Impact and/or Coursera may set cookies on your browser to attribute your purchase to CourseDrop. This
          is outside our control and governed by{" "}
          <a
            href="https://www.coursera.org/about/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-200"
          >
            Coursera&apos;s Privacy Policy
          </a>{" "}
          and Impact&apos;s privacy policy.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Analytics</h2>
        <p className="text-gray-400">
          CourseDrop does not use Google Analytics, Meta Pixel, or any other third-party analytics in V1. If analytics
          is added in a future version, it will be cookieless only and this policy will be updated first.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Cookies</h2>
        <p className="text-gray-400">
          CourseDrop does not set any first-party analytics cookies. We do not display a cookie consent banner because
          we do not set tracking cookies ourselves.
        </p>
      </section>

      <p className="text-sm text-gray-600">
        See also:{" "}
        <Link href="/legal" className="underline hover:text-gray-400">
          Terms of Service &amp; Affiliate Disclosure
        </Link>
      </p>
    </div>
  );
}
