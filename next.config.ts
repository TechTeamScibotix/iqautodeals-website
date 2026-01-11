import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'yzkbvk1txue5y0ml.public.blob.vercel-storage.com',
      },
      // Dealer website images
      {
        protocol: 'https',
        hostname: '*.turpindodgeofdubuque.net',
      },
      {
        protocol: 'https',
        hostname: 'www.turpindodgeofdubuque.net',
      },
    ],
  },
};

export default nextConfig;
