import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Vite does not put `.env` on `process.env` for app code. Load from `.env` + `process.env` here, then `vite.define` so `import.meta.env.*` works in `covers.ts` / `ListeningShelf.astro`.
function readDotEnv() {
  const p = resolve(process.cwd(), '.env');
  if (!existsSync(p)) return {};
  const out = /** @type {Record<string, string>} */ ({});
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 1) continue;
    const k = t.slice(0, i).trim();
    if (!k) continue;
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

const fileEnv = readDotEnv();

export default defineConfig({
  site: 'https://markharwood.info',
  integrations: [sitemap()],
  vite: {
    define: {
      'import.meta.env.LASTFM_API_KEY': JSON.stringify(
        process.env.LASTFM_API_KEY ?? fileEnv.LASTFM_API_KEY ?? ''
      ),
      'import.meta.env.LASTFM_USER': JSON.stringify(
        process.env.LASTFM_USER ?? fileEnv.LASTFM_USER ?? ''
      ),
    },
  },
});
