import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// استخراج hostname و port از API URL
function parseHostname(url: string): {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
} {
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
    };
  } catch {
    return { protocol: "http", hostname: "localhost" };
  }
}

const apiHost = parseHostname(API_URL);

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
      // سرور اصلی از env
      {
        protocol: apiHost.protocol,
        hostname: apiHost.hostname,
        ...(apiHost.port ? { port: apiHost.port } : {}),
        pathname: "/media/**",
      },
      // localhost برای توسعه
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      // IP مستقیم بدون port
      {
        protocol: "http",
        hostname: "5.198.179.184",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;