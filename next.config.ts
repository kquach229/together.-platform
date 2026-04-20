import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = require("next-pwa")({
  dest: "public",

  disable: process.env.NODE_ENV === "development",

  buildExcludes: ["app-build-manifest.json"],
});

console.log("PWA CONFIG LOADED"); // 👈 add this

const nextConfig: NextConfig = {
  turbopack: {},
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
