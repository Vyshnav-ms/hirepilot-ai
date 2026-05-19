import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this project directory so it doesn't
  // accidentally pick up a package-lock.json from a parent folder.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
