import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify/functions"; // Use the "functions" export for SSR

export default defineConfig({
  output: "server", // Enable SSR
  adapter: netlify(),
});
