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
      // DealerSocket CDN images
      {
        protocol: 'https',
        hostname: '*.dealersocket.com',
      },
      {
        protocol: 'https',
        hostname: 'inventory.dealersocket.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dealersocket.com',
      },
    ],
  },
  // Externalize ssh2-sftp-client and native modules for server-side only
  // These modules have native bindings that webpack cannot bundle
  serverExternalPackages: ['ssh2-sftp-client', 'ssh2', 'cpu-features'],
};

export default nextConfig;
