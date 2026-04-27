/// <reference types="astro/client" />

/** Filled at build from `.env` via `astro.config.mjs` (`loadEnv` + `vite.define`) */
interface ImportMetaEnv {
  readonly LASTFM_API_KEY: string;
  readonly LASTFM_USER: string;
}
