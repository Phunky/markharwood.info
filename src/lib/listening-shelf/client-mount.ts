import { bindListeningShelf } from './attach-behavior';
import { LISTENING_SHELF_DEFAULTS } from './config';
import { fetchListeningCovers, type ListeningCover } from './covers';

const listeningShelfTeardowns = new WeakMap<Element, () => void>();

function logListeningShelfError(message: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.warn(`[ListeningShelf] ${message}`, error);
  }
}

function buildShelfScroll(covers: ListeningCover[]): HTMLElement {
  const scroll = document.createElement('div');
  scroll.className = 'listening-shelf-scroll';

  const shelf = document.createElement('div');
  shelf.className = 'listening-shelf';
  shelf.style.setProperty('--count', String(covers.length));

  covers.forEach((cover, i) => {
    const art = document.createElement('div');
    art.className = 'album-art';
    art.setAttribute('data-index', String(i));
    art.setAttribute('data-track', cover.track || 'Unknown track');
    art.setAttribute('data-artist', cover.artist || 'Unknown artist');
    if (cover.previewUrl) {
      art.setAttribute('data-preview-url', cover.previewUrl);
    }
    art.style.setProperty('--i', String(i));
    const face = document.createElement('div');
    face.className = 'album-art-face';
    const img = document.createElement('img');
    img.src = cover.src;
    img.alt = cover.alt;
    img.draggable = false;
    img.loading = i === 0 ? 'eager' : 'lazy';
    img.decoding = 'async';
    face.appendChild(img);
    art.appendChild(face);
    shelf.appendChild(art);
  });

  const line = document.createElement('div');
  line.className = 'listening-track-line';
  const now = document.createElement('div');
  now.className = 'listening-track-now';
  now.setAttribute('role', 'status');
  now.setAttribute('aria-live', 'polite');
  now.setAttribute('hidden', '');
  line.appendChild(now);
  shelf.appendChild(line);
  scroll.appendChild(shelf);

  return scroll;
}

function parseIntAttr(el: Element, name: string, fallback: number): number {
  const v = el.getAttribute(name);
  if (v == null || v === '') return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Fetches recent tracks in the browser and injects the shelf, then wires hover/ preview behavior.
 * Call once when the DOM (and `data-listening-shelf` root) is ready.
 */
export async function mountListeningShelves(): Promise<void> {
  const roots = document.querySelectorAll<HTMLElement>('[data-listening-shelf]');

  for (const wrap of roots) {
    if (wrap.dataset.shelfMounted === '1') continue;

    const status = wrap.querySelector<HTMLElement>('[data-shelf-status]');
    const whenEmpty = wrap.getAttribute('data-when-empty') || 'hide';
    const lastfmUser = wrap.getAttribute('data-lastfm-user') || 'irPhunky';
    const maxTracks = parseIntAttr(wrap, 'data-max-tracks', LISTENING_SHELF_DEFAULTS.maxTracks);
    const lastfmLimit = parseIntAttr(wrap, 'data-lastfm-limit', LISTENING_SHELF_DEFAULTS.lastfmLimit);
    const itunesConcurrency = parseIntAttr(
      wrap,
      'data-itunes-concurrency',
      LISTENING_SHELF_DEFAULTS.itunesConcurrency
    );
    const enablePreviews = wrap.getAttribute('data-enable-previews') !== 'false';

    const key = (import.meta.env.PUBLIC_LASTFM_API_KEY as string) || '';
    if (!key) {
      if (status) status.remove();
      if (whenEmpty === 'message') {
        const p = document.createElement('p');
        p.className = 'text-gray-600';
        p.textContent = 'No recent tracks right now.';
        wrap.appendChild(p);
        wrap.dataset.shelfMounted = '1';
      } else {
        wrap.remove();
      }
      continue;
    }

    let covers: Awaited<ReturnType<typeof fetchListeningCovers>> = [];
    try {
      covers = await fetchListeningCovers({
        lastfmUser,
        lastfmApiKey: key,
        maxTracks,
        lastfmLimit,
        enablePreviews,
        itunesConcurrency,
      });
    } catch (error) {
      logListeningShelfError('Unable to fetch recent tracks.', error);
      covers = [];
    }

    if (status) status.remove();

    if (covers.length === 0) {
      if (whenEmpty === 'message') {
        const p = document.createElement('p');
        p.className = 'text-gray-600';
        p.textContent = 'No recent tracks right now.';
        wrap.appendChild(p);
      } else {
        wrap.remove();
      }
      wrap.dataset.shelfMounted = '1';
      continue;
    }

    const scroll = buildShelfScroll(covers);
    wrap.appendChild(scroll);
    wrap.dataset.shelfMounted = '1';
    try {
      listeningShelfTeardowns.set(wrap, bindListeningShelf(wrap));
    } catch (error) {
      logListeningShelfError('Unable to bind shelf interactions.', error);
    }
  }
}

export function unmountListeningShelves(): void {
  document.querySelectorAll<HTMLElement>('[data-listening-shelf]').forEach((wrap) => {
    listeningShelfTeardowns.get(wrap)?.();
    listeningShelfTeardowns.delete(wrap);
    delete wrap.dataset.shelfMounted;
  });
}
