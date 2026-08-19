import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  // اجازه دسترسی به API بک‌اند از Next.js
  async rewrites() {
    return [];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "5.198.179.184",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;