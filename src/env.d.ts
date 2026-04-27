/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Last.fm API key (bundled for client-side scrobble fetch — treat as public) */
  readonly PUBLIC_LASTFM_API_KEY?: string;
  /** Default Last.fm profile for `user.getrecenttracks` */
  readonly PUBLIC_LASTFM_USER?: string;
  /** ISO date of last git commit touching `src/pages/now.astro` (set in CI/Docker when `.git` is absent) */
  readonly PUBLIC_NOW_LAST_UPDATED?: string;
  /** ISO date of last git commit touching `src/pages/uses.astro` (set in CI/Docker when `.git` is absent) */
  readonly PUBLIC_USES_LAST_UPDATED?: string;
}
