import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Redirect removed - this deployment should show the root page directly
  /*
  async redirects() {
    return [
      {
        source: '/',
        destination: '/demos',
        permanent: false, // Use temporary redirect (307) initially
      },
    ];
  },
  */
};

export default nextConfig;
