import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this project directory so it doesn't
  // accidentally pick up a package-lock.json from a parent folder.
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Prevent Next.js from bundling these packages — they contain native Node.js
  // addons or runtime file reads that break in a bundled/serverless context.
  //   • pdf-parse v2: class-based PDF parser built on pdfjs-dist
  //   • pdfjs-dist:   loads a PDF worker bundle at runtime via file path
  //   • @napi-rs/canvas: native .node addon for canvas rendering (image extraction)
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "@napi-rs/canvas"],
};

export default nextConfig;