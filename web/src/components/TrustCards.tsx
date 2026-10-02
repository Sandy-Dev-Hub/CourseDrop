import { IconStar } from "./Icons";

export function TrustCards() {
  const reviews = [
    {
      quote:
        "CourseDrop helped me find an active 50% discount on the Google Data Analytics Professional Certificate. The link worked seamlessly.",
      author: "Elena Rostova",
      role: "Data Analyst",
      verified: true,
    },
    {
      quote:
        "Found Yale's Science of Well-Being with complete free access within seconds. Clear, clean, and no spammy redirect loops.",
      author: "Marcus Chen",
      role: "Product Designer",
      verified: true,
    },
  ];

  return (
    <section className="py-14 px-4 sm:px-8 lg:px-12 xl:px-16 border-b border-[var(--border-subtle)] bg-[var(--bg-page)]">
      <div className="mx-auto max-w-[1720px] w-full">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-sage)]">
            COMMUNITY FEEDBACK
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Trusted by Lifelong Learners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="editorial-card p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3.5">
                  {[...Array(5)].map((_, i) => (
                    <IconStar key={i} size={14} />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary)]">
                    {rev.author}
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)]">{rev.role}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[var(--accent-sage-soft)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--accent-sage-soft-text)]">
                  Verified Learner
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
