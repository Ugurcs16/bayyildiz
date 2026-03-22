import { HeroSection } from "@/components/home/HeroSection";
import { HomeCatalog } from "@/components/home/HomeCatalog";
import { DEFAULT_HERO_VIDEO, SITE_DESCRIPTION } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  return (
    <>
      <HeroSection videoUrl={DEFAULT_HERO_VIDEO} />
      <HomeCatalog />
    </>
  );
}
