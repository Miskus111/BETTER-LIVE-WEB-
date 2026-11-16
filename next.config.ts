import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // separate build folder for Playwright so tests don't clobber a running `npm run dev`
  distDir: process.env.NEXT_DIST_DIR || '.next',
  /* config options here */
};

export default nextConfig;
