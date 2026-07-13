import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  images: {
    localPatterns: [
      {
        pathname: '/api/image',
        search: '**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'zerowin.tplinkdns.com',
      },
    ],
  },
};

export default nextConfig;
