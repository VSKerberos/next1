import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   output: "export",           // tells Next to prepare for static export
  trailingSlash: true,        // optional, often helpful for static hosting
  images: {
    unoptimized: true,        // disable the runtime image optimizer so export works
  },
};

export default nextConfig;
