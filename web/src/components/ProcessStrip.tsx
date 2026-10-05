import Image from "next/image";

/**
 * Copy is grounded in the real backend rules:
 * - sources: impact_feed / manual / seed (api/app/models ck_offers_source), no scraping
 * - validation: tracking host allow-list, price math, discount % cross-check, date order
 * - reverify job: scheduled offers activate at start time, active offers expire past end date
 */
const STEPS = [
  {
    num: "01",
    title: "Discover",
    desc: "Aggregating daily promotions from direct Coursera affiliate data.",
    detail:
      "Offers come from the Impact affiliate feed, manual entry, or official sources. Nothing is scraped.",
    imageSrc: "/step-discover.png",
  },
  {
    num: "02",
    title: "Verify",
    desc: "Checking active coupons, discount percentages, and landing URLs.",
    detail:
      "Every link must point to an approved tracking host, and listed prices are cross-checked against the stated discount before an offer goes live.",
    imageSrc: "/step-verify.png",
  },
  {
    num: "03",
    title: "Track",
    desc: "Continuous monitoring of validity dates and new cohort openings.",
    detail:
      "Offers are re-checked regularly: scheduled ones go live at their start date, and active ones expire automatically once their listed end date passes.",
    imageSrc: "/step-track.png",
  },
  {
    num: "04",
    title: "Save",
    desc: "Direct sponsored links and instant one-click coupon copying.",
    detail:
      "You get a direct tracking link to Coursera, plus a visible promo code whenever the source provided one.",
    imageSrc: "/step-save.png",
  },
];

/**
 * "How CourseDrop Works" — left: sticky-stacking cards, right: pinned heading.
 *
 * The baseline markup/CSS is a plain responsive grid (mobile + reduced motion).
 * The sticky stacking is layered on in CSS only (see globals.css `.process*`),
 * at >= 1024px with motion allowed. All four cards stay in the DOM and the
 * accessibility tree; no JS is needed, so native scroll, keyboard scrolling,
 * anchors and the global Lenis instance (SmoothScrollProvider) are untouched.
 */
export function ProcessStrip() {
  return (
    <section
      id="how-it-works"
      className="process"
      aria-labelledby="process-heading"
    >
      <div className="process__bg" aria-hidden="true">
        <div className="process__bg-pin" />
      </div>
      <div className="process__layout mx-auto max-w-[1720px] w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="process__aside">
          <div className="process__aside-inner">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              From source to savings
            </span>
            <h2
              id="process-heading"
              className="process__heading mt-2 font-bold tracking-tight text-[var(--text-primary)]"
            >
              How <span className="text-[var(--accent-sage)]">Course</span>Drop Works
            </h2>
          </div>
        </div>

        <ol className="process__steps list-none p-0 m-0">
          {STEPS.map((step, idx) => (
            <li key={step.num} className="process__item" data-index={idx}>
              <figure className="process__card editorial-card m-0">
                <div className="flex items-center gap-3.5 mb-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-sage-soft)] border border-[var(--border-subtle)] text-xs font-bold num text-[var(--accent-sage-soft-text)]">
                    {step.num}
                  </span>
                  <div className="flex items-center justify-center" aria-hidden="true">
                    <Image
                      src={step.imageSrc}
                      alt=""
                      width={44}
                      height={44}
                      className="h-10 w-10 sm:h-11 sm:w-11 object-contain dark:invert dark:brightness-110 transition-all"
                    />
                  </div>
                </div>
                <h3 className="process__title font-semibold text-[var(--text-primary)]">{step.title}</h3>
                <figcaption className="mt-3 space-y-2">
                  <p className="process__desc text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                  <p className="process__detail text-[var(--text-muted)] leading-relaxed">{step.detail}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

