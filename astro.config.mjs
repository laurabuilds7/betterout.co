import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://betterout.co",
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
  build: { format: "directory" },
});
