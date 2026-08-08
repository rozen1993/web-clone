import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Geist",
      cssVariable: "--font-geist-sans",
      weights: ["100 900"],
      styles: ["normal"],
    },
    {
      provider: fontProviders.google(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      weights: ["100 900"],
      styles: ["normal"],
    },
  ],
  // Astro 7 defaults to "jsx", which collapses multiline text and removes
  // line breaks around elements. Lossless `true` preserves visual rendering,
  // which is essential for pixel-perfect website cloning.
  compressHTML: true,
});
