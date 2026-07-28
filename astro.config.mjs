import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://sshlg.me",
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
  integrations: [sitemap()],
});
