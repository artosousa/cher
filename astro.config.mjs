import { defineConfig } from "astro/config"
import netlify from "@astrojs/netlify"
import react from '@astrojs/react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  output: "server", // Enable SSR
  adapter: netlify({
    assets: false, // Disable experimental feature
  }),
  integrations: [
    react(),
    tailwindcss({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
