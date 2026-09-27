import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md">
          <span className="text-6xl font-extrabold text-indigo-500">404</span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
            Deal or Page Not Found
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            The course deal you are looking for may have expired, been removed, or moved to a different URL.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              Browse Active Deals
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
