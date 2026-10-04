import { IconCheckCircle, IconGraduationCap, IconLayers, IconSparkles } from "./Icons";

interface StatsBandProps {
  dealCount?: number;
  courseCount?: number;
  categoryCount?: number;
  freeCount?: number;
}

export function StatsBand({
  dealCount = 80,
  courseCount = 50,
  categoryCount = 12,
  freeCount = 20,
}: StatsBandProps) {
  const stats = [
    {
      icon: <IconSparkles size={20} className="text-[var(--accent-sage)]" />,
      value: `${dealCount}+`,
      label: "Active Verified Deals",
      subtext: "Validated daily via direct feeds",
    },
    {
      icon: <IconGraduationCap size={20} className="text-[var(--accent-sage)]" />,
      value: `${courseCount}+`,
      label: "Top Courses Monitored",
      subtext: "From leading global universities",
    },
    {
      icon: <IconLayers size={20} className="text-[var(--accent-sage)]" />,
      value: `${categoryCount}+`,
      label: "Subject Categories",
      subtext: "Tech, Business, Data & more",
    },
    {
      icon: <IconCheckCircle size={20} className="text-[var(--accent-free)]" />,
      value: `${freeCount}+`,
      label: "100% Free Opportunities",
      subtext: "Full courses and audit options",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-[1720px] w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                {stat.icon}
              </div>
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] num">
                {stat.value}
              </span>
              <span className="mt-1 text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                {stat.label}
              </span>
              <span className="mt-0.5 text-[11px] text-[var(--text-muted)] hidden sm:block">
                {stat.subtext}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
