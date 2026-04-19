import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = require("next-pwa")({
  dest: "public",

  disable: process.env.NODE_ENV === "development",

  buildExcludes: ["app-build-manifest.json"],
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withPWA(nextConfig);
