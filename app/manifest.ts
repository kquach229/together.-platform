export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "together.",
    short_name: "together.",
    description: "Your greeting card platform",
    start_url: "https://togethercards.vercel.app/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
