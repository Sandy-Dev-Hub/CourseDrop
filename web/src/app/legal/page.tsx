import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service & Affiliate Disclosure",
  description:
    "CourseDrop's Terms of Service, affiliate disclosure, and content policies.",
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-8">Legal</h1>

      {/* Terms of Service */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Terms of Service</h2>
        <p className="text-gray-400 mb-4">
          By using CourseDrop, you agree to the following terms. This site is provided for informational purposes only.
          We do not guarantee the accuracy, completeness, or availability of any deal or offer listed.
        </p>
        <p className="text-gray-400">
          CourseDrop is not responsible for any loss or damage arising from your use of this site or links to
          third-party sites.
        </p>
      </section>

      {/* Affiliate Disclosure */}
      <section id="affiliate-disclosure" className="mb-12">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Affiliate Disclosure</h2>
        <p className="text-gray-400 mb-4">
          CourseDrop participates in affiliate programs. When you click on certain links and make a purchase, we may
          receive a commission at no additional cost to you. This is how we fund the site.
        </p>
        <p className="text-gray-400 mb-4">
          <strong className="text-gray-200">CourseDrop is not affiliated with or endorsed by Coursera.</strong> We are
          an independent affiliate site. All course content, prices, and availability are subject to change by Coursera.
        </p>
        <p className="text-gray-400">
          All offer links use <code className="text-indigo-400">rel="sponsored nofollow noopener"</code> to comply with
          search engine guidelines.
        </p>
      </section>

      {/* Content Policy */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Content Policy</h2>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>All discounts are calculated from two source prices; we do not invent or inflate discounts.</li>
          <li>Promo codes are displayed only when provided by the affiliate source — never generated.</li>
          <li>
            Offers marked &ldquo;Free&rdquo; are sourced from official channels and verified before display.
          </li>
        </ul>
      </section>

      <p className="text-sm text-gray-600">
        Questions?{" "}
        <Link href="/privacy" className="underline hover:text-gray-400">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
