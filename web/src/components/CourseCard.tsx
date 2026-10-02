import Link from "next/link";
import { Course } from "@/types";
import { IconArrowRight, IconGraduationCap, IconStar } from "./Icons";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="group relative flex h-full flex-col justify-between editorial-card p-5 sm:p-6">
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 h-7 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-secondary)] border border-[var(--border-subtle)]">
            <IconGraduationCap size={12} className="text-[var(--accent-sage)]" />
            <span>Coursera</span>
          </span>
          {course.rating && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
              <IconStar size={12} />
              <span>{Number(course.rating).toFixed(1)}</span>
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-sage)] transition-colors line-clamp-2 leading-snug min-h-[2.85rem] flex items-center">
          <Link href={`/course/${course.slug}`} className="hover:underline line-clamp-2">
            {course.title}
          </Link>
        </h3>

        {course.description && (
          <p className="mt-2 text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {course.description}
          </p>
        )}

        <div className="mt-3.5 min-h-[1.75rem] flex flex-wrap gap-1.5 items-center">
          {course.categories && course.categories.length > 0 ? (
            course.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]"
              >
                {cat.name}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-[var(--text-muted)] opacity-60">Verified Course</span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <span className="text-xs text-[var(--text-muted)]">
          {course.enrollment_count ? `${course.enrollment_count.toLocaleString()} learners` : "Active Course"}
        </span>

        <Link
          href={`/course/${course.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-sage)] hover:underline transition-colors"
        >
          <span>View Offers</span>
          <IconArrowRight size={12} />
        </Link>
      </div>
    </article>
  );
}
