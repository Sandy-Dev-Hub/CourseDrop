import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CopyCouponButton } from "@/components/CopyCouponButton";
import { MotionFadeIn } from "@/components/MotionWrapper";
import {
  IconArrowRight,
  IconExternalLink,
  IconGraduationCap,
  IconShieldCheck,
  IconStar,
} from "@/components/Icons";
import { SectionDecorativeBackground } from "@/components/SectionDecorativeBackground";
import { fetchCourseBySlug, fetchOffers, getOfferClickUrl } from "@/lib/api";

interface CourseDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CourseDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await fetchCourseBySlug(slug);
  if (!course) {
    return {
      title: "Course Not Found - CourseDrop",
    };
  }
  return {
    title: `${course.title} Deals & Discounts - CourseDrop`,
    description: `Verified discounts, promo codes, and pricing details for ${course.title} on Coursera.`,
  };
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const { slug } = await params;
  const [course, offersData] = await Promise.all([
    fetchCourseBySlug(slug),
    fetchOffers({ search: slug.replace(/-/g, " "), page_size: 10 }),
  ]);

  if (!course) {
    notFound();
  }

  // Find active offer for this course if available
  const activeOffer = offersData.items.find(
    (o) => o.course_id === course.id || o.course?.slug === course.slug
  ) || offersData.items[0];

  const isFree = activeOffer && (activeOffer.offer_type === "FREE_ACCESS" || activeOffer.discount_percentage === 100);
  const clickUrl = activeOffer ? getOfferClickUrl(activeOffer.id) : `https://www.coursera.org/learn/${course.slug}`;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)] relative">
      <Navbar />

      <main className="flex-1 relative z-10">
        {/* Breadcrumb strip */}
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] pt-24 pb-3.5 sm:pt-28 sm:pb-3.5 px-4 sm:px-8 lg:px-12 xl:px-16 text-xs text-[var(--text-muted)]">
          <div className="mx-auto max-w-[1720px] flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-[var(--text-primary)] transition-colors">
              Courses
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)] truncate max-w-[35ch]">{course.title}</span>
          </div>
        </div>

        {/* Hero Course Header */}
        <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 px-4 sm:px-8 lg:px-12 xl:px-16">
          <SectionDecorativeBackground variant="right" />
          <div className="relative z-10 mx-auto max-w-[1720px]">
            <MotionFadeIn delay={0.1}>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card)] px-3 py-1 text-[11px] font-medium text-[var(--text-secondary)] border border-[var(--border-subtle)] shadow-xs">
                  <IconGraduationCap size={13} className="text-[var(--accent-sage)]" />
                  <span>Coursera Verified</span>
                </span>
                {course.categories && course.categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/categories/${c.slug}`}
                    className="rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] px-3 py-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </MotionFadeIn>

            <MotionFadeIn delay={0.2}>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-tight max-w-4xl">
                {course.title}
              </h1>
            </MotionFadeIn>

            {course.description && (
              <MotionFadeIn delay={0.3}>
                <p className="mt-4 max-w-4xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  {course.description}
                </p>
              </MotionFadeIn>
            )}

            {/* Quick stats strip */}
            <MotionFadeIn delay={0.4}>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-[var(--text-muted)]">
                {course.rating && (
                  <div className="flex items-center gap-1.5 font-semibold text-amber-500">
                    <IconStar size={15} />
                    <span>{Number(course.rating).toFixed(1)} / 5.0 Star Rating</span>
                  </div>
                )}
                {course.enrollment_count && (
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {course.enrollment_count.toLocaleString()}
                    </span>{" "}
                    enrolled learners
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[var(--accent-sage)] font-medium">
                  <IconShieldCheck size={15} />
                  <span>Active & Verified Deal</span>
                </div>
              </div>
            </MotionFadeIn>
          </div>
        </section>

        {/* Course Details & Offer Card Layout */}
        <section className="mx-auto max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Col: Course Details Table & Info */}
            <div className="lg:col-span-8 space-y-6">
              <MotionFadeIn delay={0.2}>
                <div className="editorial-card p-6 sm:p-8">
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">
                    Course Specifications
                  </h3>
                  <dl className="divide-y divide-[var(--border-subtle)] text-xs sm:text-sm">
                    <div className="py-3.5 flex justify-between">
                      <dt className="text-[var(--text-muted)]">Platform</dt>
                      <dd className="font-medium text-[var(--text-primary)]">Coursera</dd>
                    </div>
                    <div className="py-3.5 flex justify-between">
                      <dt className="text-[var(--text-muted)]">Catalog Slug</dt>
                      <dd className="font-mono text-[var(--text-secondary)]">{course.slug}</dd>
                    </div>
                    <div className="py-3.5 flex justify-between">
                      <dt className="text-[var(--text-muted)]">Status</dt>
                      <dd className="font-medium text-[var(--accent-sage)] flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-sage)]"></span>
                        <span>Active & Listed</span>
                      </dd>
                    </div>
                    {course.categories && course.categories.length > 0 && (
                      <div className="py-3.5 flex justify-between">
                        <dt className="text-[var(--text-muted)]">Primary Category</dt>
                        <dd className="font-medium text-[var(--text-primary)]">{course.categories[0].name}</dd>
                      </div>
                    )}
                    <div className="py-3.5 flex justify-between">
                      <dt className="text-[var(--text-muted)]">Official Link</dt>
                      <dd>
                        <a
                          href={course.course_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--accent-sage)] hover:underline transition-colors"
                        >
                          <span>Coursera Page</span>
                          <IconExternalLink size={13} />
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </MotionFadeIn>

              {/* Price Transparency Information */}
              <MotionFadeIn delay={0.3}>
                <div className="editorial-card p-6 sm:p-8">
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
                    Pricing & Free Audit Options
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    Most Coursera individual courses offer free auditing (video lectures, readings, and exercises without graded assignments or certificates). For certificates and graded coursework, look for active promo codes or apply for Coursera Financial Aid directly on the course landing page.
                  </p>
                </div>
              </MotionFadeIn>
            </div>

            {/* Right Col: Active Deal Box */}
            <div className="lg:col-span-4">
              <MotionFadeIn delay={0.2}>
                <div className="sticky top-24 editorial-card p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Active Promotion
                    </span>
                    {activeOffer && (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          isFree
                            ? "bg-[var(--accent-free-soft)] text-[var(--accent-free-soft-text)] border border-[var(--accent-free)]/20"
                            : "bg-[var(--accent-sage-soft)] text-[var(--accent-sage-soft-text)] border border-[var(--accent-sage)]/20"
                        }`}
                      >
                        {isFree
                          ? "100% FREE"
                          : activeOffer.discount_percentage
                          ? `${Math.round(activeOffer.discount_percentage)}% OFF`
                          : "DISCOUNT"}
                      </span>
                    )}
                  </div>

                  {/* Price display */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2">
                      {isFree ? (
                        <span className="text-3xl font-bold text-[var(--accent-free)]">FREE</span>
                      ) : activeOffer?.discounted_price !== null && activeOffer?.discounted_price !== undefined ? (
                        <span className="text-3xl font-bold text-[var(--text-primary)] font-mono">
                          ${Number(activeOffer.discounted_price).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-xl font-bold text-[var(--text-primary)]">Special Pricing</span>
                      )}
                      {activeOffer?.original_price !== null && activeOffer?.original_price !== undefined && (
                        <span className="text-sm text-[var(--text-muted)] line-through font-mono">
                          ${Number(activeOffer.original_price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {activeOffer?.headline && (
                      <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">{activeOffer.headline}</p>
                    )}
                  </div>

                  {/* Coupon Code */}
                  {activeOffer?.coupon_code && (
                    <div className="mb-5">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wider block mb-1.5">
                        Promo Code
                      </span>
                      <CopyCouponButton code={activeOffer.coupon_code} />
                    </div>
                  )}

                  {/* CTA Button */}
                  <a
                    href={clickUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-sage)] px-4 py-3 text-sm font-semibold text-white shadow-xs hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    <span>Claim on Coursera</span>
                    <IconArrowRight size={15} />
                  </a>

                  {/* Micro Disclosure */}
                  <div className="mt-3.5 text-center text-[10px] text-[var(--text-muted)]">
                    <span>Ad / Affiliate Link. Prices subject to change by Coursera.</span>
                  </div>
                </div>
              </MotionFadeIn>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
