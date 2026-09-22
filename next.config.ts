import type { NextConfig } from "next";

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
};

export default nextConfig;
