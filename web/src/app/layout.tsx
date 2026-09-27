import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "CourseDrop — Coursera Deals & Discounts",
    template: "%s | CourseDrop",
  },
  description:
    "Discover the latest Coursera course deals, discounts, and free coupons. CourseDrop tracks offers so you never miss a deal.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100 antialiased">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
