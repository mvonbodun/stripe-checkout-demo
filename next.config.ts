import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '**',  // Allow all domains as fallback - useful during development with different image sources
      },
    ],
    unoptimized: true, // This will disable the Image Optimization API when running through tunnels like ngrok
    domains: ['placehold.co'], // For legacy compatibility
  },
};

export default nextConfig;
