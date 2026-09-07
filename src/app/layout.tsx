import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { AppProviders } from "@/components/providers/app-providers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

/** Editorial serif: clearer strokes than Cormorant; latin-ext for Turkish glyphs. */
const display = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "erkek ayakkabı",
    "hakiki deri ayakkabı",
    "Bursa ayakkabı",
    "deri ayakkabı",
    "Bayyıldız",
  ],
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body
        className={`${inter.variable} ${display.variable} flex min-h-full flex-col antialiased`}
      >
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}
