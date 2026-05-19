import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      { source: "/learn", destination: "/today", permanent: false },
      { source: "/courses", destination: "/programs", permanent: false },
      {
        source: "/courses/:courseId",
        destination: "/programs/:courseId",
        permanent: false,
      },
      {
        source: "/nuggets/:nuggetId",
        destination: "/programs/steps/:nuggetId",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
