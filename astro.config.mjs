import { defineConfig } from "astro/config"
import netlify from "@astrojs/netlify/functions"// Use the "functions" export for SSR
import react from '@astrojs/react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  output: "server", // Enable SSR
  adapter: netlify(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
