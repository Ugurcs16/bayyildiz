import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { LEGAL_ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  robots: { index: false, follow: true },
};

/** Legacy path — canonical privacy notice lives at /gizlilik-politikasi. */
export default function LegacyPrivacyRedirect() {
  permanentRedirect(LEGAL_ROUTES.privacy);
}
