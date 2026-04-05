import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    // Tells Turbopack to let the runtime handle these directly
    serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
    turbo: {
      resolveAlias: {
        // Explicitly map your custom output path for Turbopack
        "../generated/prisma/client": "./generated/prisma/client",
      },
    },
  },
};

export default nextConfig;
