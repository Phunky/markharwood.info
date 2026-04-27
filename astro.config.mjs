import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Use `PUBLIC_*` in `.env` for client-visible values (see Vite). The listening shelf reads
// `PUBLIC_LASTFM_API_KEY` / `PUBLIC_LASTFM_USER` in the browser at runtime.
export default defineConfig({
  site: 'https://markharwood.info',
  integrations: [sitemap()],
});
