import Link from "next/link";
import { IconInfo } from "./Icons";

interface AffiliateDisclosureProps {
  /** "footer" renders the long form; "card" renders a one-liner */
  variant?: "footer" | "card";
}

export function AffiliateDisclosure({ variant = "footer" }: AffiliateDisclosureProps) {
  if (variant === "card") {
    return (
      <p className="text-[11px] text-[var(--text-muted)] mt-2">
        Ad / Affiliate link.{" "}
        <Link href="/legal#affiliate-disclosure" className="underline hover:text-[var(--text-primary)]">
          Disclosure
        </Link>
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs text-[var(--text-secondary)] leading-relaxed">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 text-[var(--accent-sage)] shrink-0">
          <IconInfo size={16} />
        </div>
        <div>
          <p>
            <strong className="text-[var(--text-primary)]">Affiliate Disclosure:</strong> CourseDrop is an independent site and is{" "}
            <strong className="text-[var(--text-primary)]">not affiliated with or endorsed by Coursera</strong>. Some links on this site are affiliate links. If
            you purchase through them, we may earn a commission at no extra cost to you. This helps us keep the site
            running. We only list offers from official Coursera channels.
          </p>
          <p className="mt-2">
            <Link href="/legal#affiliate-disclosure" className="font-medium text-[var(--accent-sage)] hover:underline transition-colors">
              Read our full affiliate disclosure →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
