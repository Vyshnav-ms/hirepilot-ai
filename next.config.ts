import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  experimental: {
    serverComponentsExternalPackages: ["pdfjs-dist"],
  },
};

export default nextConfig;