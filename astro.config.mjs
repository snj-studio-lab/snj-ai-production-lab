import { defineConfig } from "astro/config";
import { build as buildStaticSite } from "./scripts/build.mjs";

export default defineConfig({
  site: "https://snj-studio-lab.github.io",
  base: "/snj-ai-production-lab",
  trailingSlash: "always",
  integrations: [
    {
      name: "snj-static-export",
      hooks: {
        "astro:build:done": async () => {
          await buildStaticSite();
        }
      }
    }
  ]
});
