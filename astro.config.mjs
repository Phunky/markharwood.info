import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://markharwood.info',
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), prefetch(), sitemap()]
});
