import { IconCheck, IconClock, IconSearch, IconSparkles } from "./Icons";

export function ProcessStrip() {
  const steps = [
    {
      num: "01",
      title: "Discover",
      desc: "Aggregating daily promotions from direct Coursera affiliate data.",
      icon: <IconSearch size={15} className="text-[var(--accent-sage)]" />,
    },
    {
      num: "02",
      title: "Verify",
      desc: "Checking active coupons, discount percentages, and landing URLs.",
      icon: <IconCheck size={15} className="text-[var(--accent-sage)]" />,
    },
    {
      num: "03",
      title: "Track",
      desc: "Continuous monitoring of validity dates and new cohort openings.",
      icon: <IconClock size={15} className="text-[var(--accent-sage)]" />,
    },
    {
      num: "04",
      title: "Save",
      desc: "Direct sponsored links and instant one-click coupon copying.",
      icon: <IconSparkles size={15} className="text-[var(--accent-sage)]" />,
    },
  ];

  return (
    <section className="py-14 px-4 sm:px-8 lg:px-12 xl:px-16 border-b border-[var(--border-subtle)] bg-[var(--bg-page)]">
      <div className="mx-auto max-w-[1720px] w-full">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-sage)]">
            HOW COURSEDROP WORKS
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            From Source to Savings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3 mb-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-sage-soft)] border border-[var(--border-subtle)] text-xs font-bold font-mono text-[var(--accent-sage-soft-text)]">
                  {step.num}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  {step.icon}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed max-w-[28ch]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
