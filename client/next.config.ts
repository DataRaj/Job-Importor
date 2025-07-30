import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
};

export default nextConfig;
