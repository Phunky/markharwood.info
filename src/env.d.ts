/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Last.fm API key (bundled for client-side scrobble fetch — treat as public) */
  readonly PUBLIC_LASTFM_API_KEY?: string;
  /** Default Last.fm profile for `user.getrecenttracks` */
  readonly PUBLIC_LASTFM_USER?: string;
}
