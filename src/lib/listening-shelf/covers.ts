/**
 * `user.getrecenttracks` returns per-track album art; weekly charts often only include the generic Last.fm placeholder.
 */
const PLACEHOLDER_MARKERS = ['2a96cbd8b46e442fc41c2b86b821562f'];

const sizeOrder: Record<string, number> = {
  mega: 5,
  extralarge: 4,
  large: 3,
  medium: 2,
  small: 1,
};

function coverUrl(track: {
  image?: Array<{ size?: string; '#text'?: string }> | { size?: string; '#text'?: string };
}): string {
  const images = track?.image;
  if (!images) return '';
  const list = Array.isArray(images) ? images : [images];
  const sorted = [...list].sort(
    (a, b) => (sizeOrder[b?.size ?? ''] ?? 0) - (sizeOrder[a?.size ?? ''] ?? 0)
  );
  for (const im of sorted) {
    const url = im?.['#text'] ?? '';
    if (url) return url;
  }
  return '';
}

function artistName(track: { artist?: string | { '#text'?: string; name?: string } }): string {
  const a = track.artist;
  if (typeof a === 'string') return a;
  return a?.['#text'] ?? a?.name ?? '';
}

function albumName(track: Record<string, unknown>): string {
  const al = track.album as { '#text'?: string } | undefined;
  return al?.['#text'] ?? '';
}

function isPlaceholder(url: string): boolean {
  if (!url) return true;
  return PLACEHOLDER_MARKERS.some((m) => url.includes(m));
}

type ItunesHit = { artwork: string | null; preview: string | null };

async function itunesFromSearch(
  artist: string,
  track: string,
  album: string
): Promise<ItunesHit | null> {
  const term = [artist, track, album].filter(Boolean).join(' ').slice(0, 200);
  if (!term.trim()) return null;
  try {
    const u = new URL('https://itunes.apple.com/search');
    u.searchParams.set('term', term);
    u.searchParams.set('limit', '1');
    u.searchParams.set('entity', 'song');
    const res = await fetch(u.toString(), { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      results?: Array<{ artworkUrl100?: string; previewUrl?: string }>;
    };
    const r = data.results?.[0];
    if (!r) return null;
    const artwork = r.artworkUrl100
      ? r.artworkUrl100.replace(/100x100bb\.jpg/i, '600x600bb.jpg')
      : null;
    const preview =
      typeof r.previewUrl === 'string' && r.previewUrl.length > 0 ? r.previewUrl : null;
    return { artwork, preview };
  } catch {
    return null;
  }
}

export type ListeningCover = {
  src: string;
  alt: string;
  track: string;
  artist: string;
  previewUrl: string | null;
};

export type FetchListeningCoversOptions = {
  /** Last.fm user name */
  lastfmUser: string;
  /** If unset, uses `import.meta.env.LASTFM_API_KEY` (set in `.env`, wired in `astro.config.mjs`) */
  lastfmApiKey?: string;
  /** How many unique tracks to show (after de-dupe) */
  maxTracks?: number;
  /** How many recent items to pull from Last.fm (before de-dupe) */
  lastfmLimit?: number;
  /** Fetches iTunes for preview + placeholder replacement; if false, skips iTunes when art is already real */
  enablePreviews?: boolean;
  /** Max concurrent iTunes search requests (default 4) */
  itunesConcurrency?: number;
};

function lastFmUrl(user: string, apiKey: string, limit: number): string {
  return `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
    user
  )}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=${limit}`;
}

/** Run async work with a fixed concurrency cap (replaces N-wide Promise.all) */
async function mapPool<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  if (items.length === 0) return [];
  const n = Math.max(1, Math.min(limit, items.length));
  const results: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: n }, () => worker()));
  return results;
}

/**
 * Fetches unique recent tracks, enriches with iTunes (limited concurrency) when needed.
 * Server / build only — not for the browser.
 */
export async function fetchListeningCovers(options: FetchListeningCoversOptions): Promise<ListeningCover[]> {
  const {
    lastfmUser,
    lastfmApiKey: keyProp,
    maxTracks = 16,
    lastfmLimit = 24,
    enablePreviews = true,
    itunesConcurrency = 4,
  } = options;

  const lastfmApiKey = keyProp ?? import.meta.env.LASTFM_API_KEY ?? '';
  if (!lastfmApiKey) return [];

  let covers: ListeningCover[] = [];
  try {
    const res = await fetch(lastFmUrl(lastfmUser, lastfmApiKey, lastfmLimit));
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as {
      recenttracks?: { track?: unknown };
    };
    const raw = data?.recenttracks?.track;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

    const seen = new Set<string>();
    const unique: Record<string, unknown>[] = [];
    for (const item of list) {
      const t = item as Record<string, unknown>;
      const nm = (t.name as string | undefined) ?? '';
      const art = artistName(t as { artist?: string | { '#text'?: string; name?: string } });
      const key = `${art.toLowerCase()}|${nm.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(t);
      if (unique.length >= maxTracks) break;
    }

    const enriched = await mapPool(unique, itunesConcurrency, async (track) => {
      let src = coverUrl(
        track as { image?: Array<{ size?: string; '#text'?: string }> | { size?: string; '#text'?: string } }
      );
      const artist = artistName(
        track as { artist?: string | { '#text'?: string; name?: string } }
      );
      const name = (track.name as string | undefined) ?? '';
      const album = albumName(track);
      const alt = name ? `${name} — ${artist}` : artist;

      const needsItunes = enablePreviews || isPlaceholder(src);
      const itunes = needsItunes ? await itunesFromSearch(artist, name, album) : null;
      if (itunes) {
        if (isPlaceholder(src) && itunes.artwork) src = itunes.artwork;
      }
      const previewUrl = enablePreviews ? (itunes?.preview ?? null) : null;

      if (!src || isPlaceholder(src)) return null;
      return { src, alt, track: name, artist, previewUrl } satisfies ListeningCover;
    });

    covers = enriched.filter((c): c is ListeningCover => c !== null);
  } catch {
    covers = [];
  }
  return covers;
}
