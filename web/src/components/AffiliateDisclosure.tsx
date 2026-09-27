import Link from "next/link";

interface AffiliateDisclosureProps {
  /** "footer" renders the long form; "card" renders a one-liner */
  variant?: "footer" | "card";
}

export function AffiliateDisclosure({ variant = "footer" }: AffiliateDisclosureProps) {
  if (variant === "card") {
    return (
      <p className="text-xs text-gray-500 mt-2">
        Affiliate link.{" "}
        <Link href="/legal#affiliate-disclosure" className="underline hover:text-gray-300">
          Disclosure
        </Link>
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm text-gray-400">
      <p>
        <strong className="text-gray-200">Affiliate Disclosure:</strong> CourseDrop is an independent site and is{" "}
        <strong>not affiliated with or endorsed by Coursera</strong>. Some links on this site are affiliate links — if
        you purchase through them, we may earn a commission at no extra cost to you. This helps us keep the site
        running. We only list offers from official Coursera channels.
      </p>
      <p className="mt-2">
        <Link href="/legal#affiliate-disclosure" className="underline hover:text-white transition-colors">
          Read our full affiliate disclosure →
        </Link>
      </p>
    </div>
  );
}
