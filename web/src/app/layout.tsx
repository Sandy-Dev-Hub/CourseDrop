import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway, Work_Sans } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

// Type system: display (Cormorant Garamond) / body (Raleway) / UI + numerals (Work Sans).
// Latin subset only; Cormorant loads just the weights used (no italics).
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: "normal",
  variable: "--nf-display",
  display: "swap",
});

const body = Raleway({
  subsets: ["latin"],
  variable: "--nf-body",
  display: "swap",
});

const ui = Work_Sans({
  subsets: ["latin"],
  variable: "--nf-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CourseDrop - Coursera Deals & Discounts",
    template: "%s | CourseDrop",
  },
  description:
    "Discover verified Coursera course deals, discounts, and free coupons. CourseDrop tracks educational promotions daily.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  robots: { index: true, follow: true },
  other: {
    "impact-site-verification": "21252960-8ea6-48eb-97ae-43c29c508e61",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${ui.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('cd_theme');
                  var theme = (stored === 'light' || stored === 'dark') ? stored : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
        <ThemeProvider>
          <SmoothScrollProvider>
            <main className="flex-1 flex flex-col">{children}</main>
            <SiteFooter />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
