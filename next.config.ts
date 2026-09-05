import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
