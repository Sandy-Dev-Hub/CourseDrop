import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { IconSearch } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-20 sm:pt-36 sm:pb-24 text-center">
        <div className="max-w-md mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-sage-soft)] border border-[var(--border-subtle)] text-[var(--accent-sage)] mb-4">
            <IconSearch size={28} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-sage)]">404 Error</span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Deal or Page Not Found
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            The course deal you are looking for may have expired, been removed, or moved to a different URL.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-[var(--accent-sage)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Browse Active Deals
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
