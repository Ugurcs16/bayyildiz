import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Teslimat ve ödeme",
  description: `${SITE_NAME} — misafir alışveriş ile teslimat bilgileri.`,
};

export default function OdemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
