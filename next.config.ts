import type { NextConfig } from "next";
require("dotenv").config({ path: "./.env.local" });

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mock localStorage for server-side rendering
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }
    return config;
  },
  // Disable server-side rendering for client components
  experimental: {
    clientRouterFilter: true,
  },
};

export default nextConfig;
