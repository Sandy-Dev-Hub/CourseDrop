import Link from "next/link";
import { AffiliateDisclosure } from "./AffiliateDisclosure";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gray-800 bg-gray-950 py-10 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Non-affiliation line + disclosure */}
        <AffiliateDisclosure />

        {/* Links */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link href="/legal" className="hover:text-gray-300 transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/legal#affiliate-disclosure" className="hover:text-gray-300 transition-colors">
            Affiliate Disclosure
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-600">
          © {new Date().getFullYear()} CourseDrop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
