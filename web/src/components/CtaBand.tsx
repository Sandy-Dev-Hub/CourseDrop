import Link from "next/link";
import { IconArrowRight, IconGift, IconMail, IconSparkles } from "./Icons";
import { SectionDecorativeBackground } from "./SectionDecorativeBackground";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden py-14 px-4 sm:px-8 lg:px-12 xl:px-16">
      <SectionDecorativeBackground variant="minimal" />
      <div className="relative z-10 mx-auto max-w-[1720px] w-full">
        <div className="editorial-card bg-[var(--bg-surface)] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-sage)] flex items-center gap-1.5">
              <IconSparkles size={13} />
              <span>STAY AHEAD ON DEALS</span>
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Never Miss a Coursera Discount
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Browse over 80+ verified promotions and 100% free course opportunities updated every morning.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/free"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-sage)] px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <IconGift size={16} />
              <span>Explore Free Courses</span>
              <IconArrowRight size={14} />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-3 text-xs sm:text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-hover)] active:scale-[0.98] transition-all"
            >
              <IconMail size={15} className="text-[var(--accent-sage)]" />
              <span>Submit a Deal</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
