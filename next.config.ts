import type { NextConfig } from "next";
import { GSC_LEGACY_REDIRECTS_PKG1 } from "./src/lib/gsc-legacy-redirects-pkg1";

const nextConfig: NextConfig = {
  images: {
    // Vercel Image Optimization returns 402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED
    // on cache miss. Catalog photos must render from the origin URL instead.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bayyildiz.com",
      },
      {
        protocol: "https",
        hostname: "www.bayyildiz.com",
      },
      {
        protocol: "https",
        hostname: "images.bizimhesap.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/kategori/yeni-sezon",
        destination: "/kategori/sneaker",
        permanent: true,
      },
      ...GSC_LEGACY_REDIRECTS_PKG1.map((rule) => ({
        source: rule.source,
        destination: rule.destination,
        permanent: rule.permanent,
      })),
    ];
  },
};

export default nextConfig;
