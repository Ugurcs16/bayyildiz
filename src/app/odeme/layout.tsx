import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

const desc = `${SITE_NAME} — misafir alışveriş ile teslimat bilgileri.`;

export const metadata: Metadata = {
  title: "Teslimat ve ödeme",
  description: desc,
  alternates: { canonical: "/odeme" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Teslimat ve ödeme",
    description: desc,
    url: "/odeme",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "Teslimat ve ödeme",
    description: desc,
  },
};

export default function OdemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
