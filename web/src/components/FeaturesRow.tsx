import { IconCheckCircle, IconGift, IconGraduationCap, IconShieldCheck } from "./Icons";

export function FeaturesRow() {
  const features = [
    {
      icon: <IconShieldCheck size={18} className="text-[var(--accent-sage)]" />,
      title: "Direct Coursera Verification",
      desc: "All coupon codes and discounts are validated against live landing pages before listing.",
    },
    {
      icon: <IconGift size={18} className="text-[var(--accent-free)]" />,
      title: "100% Free Opportunities",
      desc: "Instant access to completely free full courses, financial aid options, and free audit modes.",
    },
    {
      icon: <IconGraduationCap size={18} className="text-[var(--accent-sage)]" />,
      title: "Top Global Institutions",
      desc: "Curated programs from Yale, Stanford, Google, IBM, University of Michigan, and more.",
    },
    {
      icon: <IconCheckCircle size={18} className="text-[var(--accent-sage)]" />,
      title: "Zero Hidden Fees",
      desc: "Direct transparent links with complete affiliate disclosure and no extra membership cost.",
    },
  ];

  return (
    <section className="py-14 px-4 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-[1720px] w-full">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-sage)]">
            OUR COMMITMENT
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Verified Learning Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="editorial-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-sage-soft)] border border-[var(--border-subtle)] mb-4">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
