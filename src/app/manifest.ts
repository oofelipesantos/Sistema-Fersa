import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fersa Support",
    short_name: "Fersa",
    description: "Technical after-sales support",
    start_url: "/",
    display: "standalone",
    background_color: "#f7fafc",
    theme_color: "#09233b",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" }
    ]
  };
}
