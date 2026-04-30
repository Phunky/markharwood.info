/**
 * Listening shelf UX: horizontal row + hover/peek at ≥768px; stacked deck below (`mobile-stack.ts`).
 */
import { bindMobileStack } from './mobile-stack';
import { createPreviewController, installPreviewUnlockOnce } from './preview-audio';
import type { ListeningShelfConfig } from './config';

/** Row layout expects track line outside the shelf; stack overlay anchors it inside. */
export function placeTrackLineForViewport(wrap: Element, stacked: boolean): void {
  const scroll = wrap.querySelector('.listening-shelf-scroll');
  const shelf = scroll?.querySelector('.listening-shelf');
  const line = scroll?.querySelector('.listening-track-line');
  if (!scroll || !shelf || !line) return;
  if (stacked) {
    shelf.appendChild(line);
    return;
  }
  const nextAfterShelf = shelf.nextSibling;
  if (nextAfterShelf === line) return;
  scroll.insertBefore(line, nextAfterShelf);
}

const EDGE = 0.24;
const GUTTER = 8;
const PEEK_CLASS = 'album-art--peek';

function dataIndex(el: HTMLElement): number {
  const v = el.getAttribute('data-index');
  const n = v == null ? NaN : parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}

/** Resolved CSS step between tile anchors (fallback: half resolved --tile). */
function readShelfStepPx(shelf: HTMLElement): number {
  const cs = getComputedStyle(shelf);
  const stepRaw = cs.getPropertyValue('--step').trim();
  let n = parseFloat(stepRaw);
  if (Number.isFinite(n) && n > 0) {
    return n;
  }
  const tileRaw = cs.getPropertyValue('--tile').trim();
  n = parseFloat(tileRaw);
  if (Number.isFinite(n) && n > 0) {
    return n * 0.5;
  }
  return 48;
}

function setPeerShift(
  hoveredArt: HTMLElement,
  allArts: Iterable<HTMLElement>,
  config: ListeningShelfConfig
): void {
  const shelf = hoveredArt.closest('.listening-shelf');
  if (!(shelf instanceof HTMLElement)) {
    return;
  }
  const stepPx = readShelfStepPx(shelf);
  const h = dataIndex(hoveredArt);
  const peers = [...allArts];
  const count = peers.length;
  const last = count - 1;

  for (const el of peers) {
    const i = dataIndex(el);
    if (i === h) {
      el.style.removeProperty('--peer-shift');
      continue;
    }
    /* First and last cover stay pinned; only interior indices move */
    if (i === 0 || i === last) {
      el.style.removeProperty('--peer-shift');
      continue;
    }
    const gaps = Math.abs(h - i);
    const shiftPx = Math.round((config.hover.peerSeparation * stepPx) / gaps);
    if (shiftPx < 1) {
      el.style.removeProperty('--peer-shift');
    } else {
      const dir = i < h ? -1 : 1;
      el.style.setProperty('--peer-shift', `${dir * shiftPx}px`);
    }
  }
}

function setShelfLayoutClass(wrap: Element, layout: 'fan' | 'row' | 'stack'): void {
  const shelf = wrap.querySelector('.listening-shelf');
  if (!shelf) return;
  shelf.classList.toggle('listening-shelf--fan', layout === 'fan');
  shelf.classList.toggle('listening-shelf--row', layout === 'row');
  shelf.classList.toggle('listening-shelf--stack', layout === 'stack');
}

function bindHoverLayout(
  wrap: Element,
  config: ListeningShelfConfig,
  layout: 'fan' | 'row'
): () => void {
  const ac = new AbortController();
  const { signal } = ac;

  const root = wrap.querySelector('.listening-shelf-scroll');
  if (!root) {
    return () => {};
  }
  const line = root.querySelector('.listening-track-line');
  const nowEl = root.querySelector('.listening-track-now');
  if (!line || !nowEl) {
    return () => {};
  }
  const now = nowEl as HTMLElement;
  const arts = root.querySelectorAll<HTMLElement>('.album-art');
  let peekTimer: number | null = null;
  let audioTimer: number | null = null;
  let labelSettleTimer: number | null = null;
  let hovered: HTMLElement | null = null;

  installPreviewUnlockOnce();
  const preview = createPreviewController(config.audio.volume);
  const usesPeerShift = layout === 'fan';

  const placeLabel = (art: HTMLElement) => {
    if (!art || now.hasAttribute('hidden')) return;
    const lineRect = line.getBoundingClientRect();
    const vis = art.querySelector('img') || art;
    const artRect = vis.getBoundingClientRect();
    const w = lineRect.width;
    if (w < 1) return;
    const cx = artRect.left - lineRect.left + artRect.width * 0.5;
    const t = cx / w;
    const minCenterW = 120;
    const maxCenterW = Math.max(minCenterW, w - 2 * GUTTER);

    now.style.setProperty('position', 'absolute');
    now.style.setProperty('top', '0');
    now.style.setProperty('z-index', '10');
    now.style.removeProperty('left');
    now.style.removeProperty('right');
    now.style.removeProperty('transform');
    now.style.removeProperty('max-width');
    now.style.removeProperty('text-align');
    if (t < EDGE) {
      const left = Math.max(0, artRect.left - lineRect.left);
      now.style.setProperty('left', `${left}px`);
      now.style.setProperty('transform', 'none');
      now.style.setProperty(
        'max-width',
        `min(${config.visual.labelMaxWidth}, ${Math.max(minCenterW, w - left - GUTTER)}px)`
      );
      now.style.setProperty('text-align', 'left');
    } else if (t > 1 - EDGE) {
      const r = Math.max(0, lineRect.right - artRect.right);
      now.style.setProperty('right', `${r}px`);
      now.style.setProperty('left', 'auto');
      now.style.setProperty('transform', 'none');
      const spaceLeft = artRect.right - lineRect.left - GUTTER;
      now.style.setProperty(
        'max-width',
        `min(${config.visual.labelMaxWidth}, ${Math.max(minCenterW, spaceLeft)}px)`
      );
      now.style.setProperty('text-align', 'right');
    } else {
      now.style.setProperty('left', `${cx}px`);
      now.style.setProperty('transform', 'translateX(-50%)');
      now.style.setProperty(
        'max-width',
        `min(${config.visual.labelMaxWidth}, ${maxCenterW}px)`
      );
      now.style.setProperty('text-align', 'center');
    }
  };

  const setNow = (el: HTMLElement) => {
    if (labelSettleTimer) {
      clearTimeout(labelSettleTimer);
      labelSettleTimer = null;
    }
    hovered = el;
    const track = el.getAttribute('data-track') || '';
    const artist = el.getAttribute('data-artist') || '';
    now.textContent = '';
    const te = document.createElement('span');
    te.className = 'listening-track-title';
    te.textContent = track || 'Unknown track';
    const ar = document.createElement('span');
    ar.className = 'listening-track-artist';
    ar.textContent = artist || 'Unknown artist';
    now.append(te, ar);
    now.removeAttribute('hidden');
    now.style.setProperty('opacity', '0');
    const showLabel = () => {
      requestAnimationFrame(() => {
        if (hovered !== el || !el.classList.contains(PEEK_CLASS)) return;
        placeLabel(el);
        now.style.removeProperty('opacity');
      });
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showLabel();
    } else {
      labelSettleTimer = window.setTimeout(() => {
        labelSettleTimer = null;
        showLabel();
      }, config.hover.settleMs);
    }
  };

  const clearNow = () => {
    if (labelSettleTimer) {
      clearTimeout(labelSettleTimer);
      labelSettleTimer = null;
    }
    hovered = null;
    now.textContent = '';
    now.setAttribute('hidden', '');
    now.style.cssText = '';
  };

  const clearPeerShift = () => {
    for (const el of arts) {
      el.style.removeProperty('--peer-shift');
    }
  };

  for (const el of arts) {
    const art = el;
    art.addEventListener(
      'mouseenter',
      () => {
        if (peekTimer) clearTimeout(peekTimer);
        if (audioTimer) clearTimeout(audioTimer);
        audioTimer = null;
        peekTimer = window.setTimeout(() => {
          peekTimer = null;
          for (const a of arts) a.classList.remove(PEEK_CLASS);
          art.classList.add(PEEK_CLASS);
          if (usesPeerShift) {
            setPeerShift(art, arts, config);
          }
          setNow(art);
          requestAnimationFrame(() => {
            if (hovered === art && art.classList.contains(PEEK_CLASS)) {
              placeLabel(art);
            }
          });
        }, config.hover.peekDelayMs);
        audioTimer = window.setTimeout(() => {
          audioTimer = null;
          if (art.matches(':hover')) {
            preview.start(art);
          }
        }, config.audio.delayMs);
      },
      { signal }
    );
    art.addEventListener('mouseleave', () => preview.stop(), { signal });
    art.addEventListener(
      'mousemove',
      () => {
        if (art.classList.contains(PEEK_CLASS)) placeLabel(art);
      },
      { signal }
    );
  }
  root.addEventListener(
    'mouseleave',
    () => {
      if (peekTimer) clearTimeout(peekTimer);
      peekTimer = null;
      if (audioTimer) clearTimeout(audioTimer);
      audioTimer = null;
      for (const a of arts) a.classList.remove(PEEK_CLASS);
      clearPeerShift();
      clearNow();
      preview.stop();
    },
    { signal }
  );
  const onWinResize = () => {
    if (hovered && hovered.classList.contains(PEEK_CLASS)) {
      if (usesPeerShift) {
        setPeerShift(hovered, arts, config);
      }
      placeLabel(hovered);
    }
  };
  window.addEventListener('resize', onWinResize, { signal });

  return () => {
    for (const a of arts) {
      a.classList.remove(PEEK_CLASS);
      a.style.removeProperty('--peer-shift');
    }
    clearNow();
    preview.stop();
    ac.abort();
  };
}

function breakpointQuery(breakpoint: string): string {
  const value = breakpoint.trim();
  return value.startsWith('(') ? value : `(min-width: ${value})`;
}

function bindResolvedLayout(
  wrap: Element,
  config: ListeningShelfConfig,
  layout: 'fan' | 'row' | 'stack'
): () => void {
  setShelfLayoutClass(wrap, layout);
  if (layout === 'stack') {
    placeTrackLineForViewport(wrap, true);
    return bindMobileStack(wrap, config);
  }
  placeTrackLineForViewport(wrap, false);
  return bindHoverLayout(wrap, config, layout);
}

export function bindListeningShelf(wrap: Element, config: ListeningShelfConfig): () => void {
  if (config.layout !== 'auto') {
    return bindResolvedLayout(wrap, config, config.layout);
  }

  const mq = window.matchMedia(breakpointQuery(config.breakpoint));
  let destroy: (() => void) | undefined;

  const run = () => {
    destroy?.();
    destroy = undefined;
    if (mq.matches) {
      destroy = bindResolvedLayout(wrap, config, 'fan');
    } else {
      destroy = bindResolvedLayout(wrap, config, 'stack');
    }
  };

  run();
  mq.addEventListener('change', run);

  return () => {
    mq.removeEventListener('change', run);
    destroy?.();
    destroy = undefined;
  };
}
