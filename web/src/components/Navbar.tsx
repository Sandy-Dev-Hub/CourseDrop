import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              CD
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                CourseDrop
              </span>
              <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">
                Coursera Deals
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-300">
            <Link
              href="/"
              className="rounded-md px-3 py-1.5 hover:bg-gray-800 hover:text-white transition-colors"
            >
              All Deals
            </Link>
            <Link
              href="/free"
              className="rounded-md px-3 py-1.5 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 transition-colors font-semibold"
            >
              100% Free
            </Link>
            <Link
              href="/categories/computer-science"
              className="rounded-md px-3 py-1.5 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Computer Science
            </Link>
            <Link
              href="/categories/data-science"
              className="rounded-md px-3 py-1.5 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Data Science
            </Link>
            <Link
              href="/categories/business"
              className="rounded-md px-3 py-1.5 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Business
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs text-gray-500 hover:text-gray-400 transition-colors px-2 py-1 rounded"
          >
            Admin
          </Link>
          <Link
            href="/free"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:opacity-95 transition-opacity"
          >
            <span>🎁</span> Free Deals
          </Link>
        </div>
      </div>
    </header>
  );
}
