import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Add redirect from root to /demos page
  async redirects() {
    return [
      {
        source: '/',
        destination: '/demos',
        permanent: false, // Use temporary redirect (307) initially
      },
    ];
  },
};

export default nextConfig;
