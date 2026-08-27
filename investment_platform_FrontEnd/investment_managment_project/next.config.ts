import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "5.198.179.184",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;