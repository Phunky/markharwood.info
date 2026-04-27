/**
 * Interactions for the listening shelf (hover stack, 30s preview, track label). Runs in the browser only.
 */
function peerNudgePx(distance: number): number {
  if (distance < 1) return 0;
  const v = 24 * 0.56 ** (distance - 1);
  return Math.max(0, Math.round(v));
}

const EDGE = 0.24;
const GUTTER = 8;
const PEEK_DELAY_MS = 55;
/** ~1 frame past peek: avoids noise on a very fast sweep without a long wait */
const AUDIO_DELAY_MS = 80;
const PEEK_CLASS = 'album-art--peek';

function installUnlockOnce(): void {
  const w = window as typeof window & { __listeningShelfUnlockPlaced?: boolean };
  if (w.__listeningShelfUnlockPlaced) return;
  w.__listeningShelfUnlockPlaced = true;
  document.addEventListener(
    'pointerdown',
    function () {
      const a = new Audio();
      a.muted = true;
      a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
      void a.play().then(function () {
        a.pause();
        a.muted = false;
      });
    },
    { once: true, capture: true }
  );
}

function bindShelf(wrap: Element): void {
  const root = wrap.querySelector('.listening-shelf-scroll');
  if (!root) return;
  const line = root.querySelector('.listening-track-line');
  const nowEl = root.querySelector('.listening-track-now');
  if (!line || !nowEl) return;
  const now = nowEl as HTMLElement;
  const arts = root.querySelectorAll<HTMLElement>('.album-art');
  let peekTimer: ReturnType<typeof setTimeout> | null = null;
  let audioTimer: ReturnType<typeof setTimeout> | null = null;
  let hovered: HTMLElement | null = null;
  const audio = new Audio();
  audio.preload = 'auto';
  let lastPreviewUrl = '';

  const stopPreview = () => {
    lastPreviewUrl = '';
    try {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    } catch {
      /* ignore */
    }
  };

  const startPreview = (el: Element) => {
    const url = el.getAttribute('data-preview-url') || '';
    if (!url) {
      stopPreview();
      return;
    }
    if (lastPreviewUrl === url) {
      audio.currentTime = 0;
      void audio.play().catch(() => {});
      return;
    }
    lastPreviewUrl = url;
    try {
      audio.pause();
    } catch {
      /* ignore */
    }
    audio.src = url;
    void audio.load();
    void audio.play().catch(function () {
      // Often blocked until pointer unlock runs
    });
  };

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
    const maxCenterW = Math.min(352, w - 2 * GUTTER);

    now.style.cssText = '';
    now.style.position = 'absolute';
    now.style.top = '0';
    now.style.left = '';
    now.style.right = 'auto';
    now.style.zIndex = '10';
    if (t < EDGE) {
      const left = Math.max(0, artRect.left - lineRect.left);
      now.style.left = `${left}px`;
      now.style.transform = 'none';
      now.style.maxWidth = `${Math.max(minCenterW, w - left - GUTTER)}px`;
      now.style.textAlign = 'left';
    } else if (t > 1 - EDGE) {
      const r = Math.max(0, lineRect.right - artRect.right);
      now.style.right = `${r}px`;
      now.style.left = 'auto';
      now.style.transform = 'none';
      const spaceLeft = artRect.right - lineRect.left - GUTTER;
      now.style.maxWidth = `${Math.max(minCenterW, spaceLeft)}px`;
      now.style.textAlign = 'right';
    } else {
      now.style.left = `${cx}px`;
      now.style.transform = 'translateX(-50%)';
      now.style.maxWidth = `${maxCenterW}px`;
      now.style.textAlign = 'center';
    }
  };

  const setNow = (el: HTMLElement) => {
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
    placeLabel(el);
    requestAnimationFrame(() => placeLabel(el));
    requestAnimationFrame(() => requestAnimationFrame(() => placeLabel(el)));
  };

  const clearNow = () => {
    hovered = null;
    now.textContent = '';
    now.setAttribute('hidden', '');
    now.style.cssText = '';
  };

  const setPeerShift = (hoverIndex: number) => {
    for (const el of arts) {
      const i = Number(el.getAttribute('data-index'));
      if (Number.isNaN(i)) continue;
      if (i === hoverIndex) {
        el.style.setProperty('--peer-shift', '0px');
        continue;
      }
      const d = Math.abs(i - hoverIndex);
      const px = peerNudgePx(d);
      const signed = i < hoverIndex ? -px : px;
      el.style.setProperty('--peer-shift', `${signed}px`);
    }
  };

  const clearPeerShift = () => {
    for (const el of arts) {
      el.style.removeProperty('--peer-shift');
    }
  };

  installUnlockOnce();

  for (const el of arts) {
    const art = el;
    art.addEventListener('mouseenter', () => {
      const i = Number(art.getAttribute('data-index'));
      if (peekTimer) clearTimeout(peekTimer);
      if (audioTimer) clearTimeout(audioTimer);
      audioTimer = null;
      peekTimer = setTimeout(() => {
        peekTimer = null;
        for (const a of arts) a.classList.remove(PEEK_CLASS);
        art.classList.add(PEEK_CLASS);
        if (!Number.isNaN(i)) setPeerShift(i);
        setNow(art);
      }, PEEK_DELAY_MS);
      audioTimer = setTimeout(() => {
        audioTimer = null;
        if (art.matches(':hover')) {
          startPreview(art);
        }
      }, AUDIO_DELAY_MS);
    });
    art.addEventListener('mouseleave', () => {
      stopPreview();
    });
    art.addEventListener('mousemove', () => {
      if (art.classList.contains(PEEK_CLASS)) placeLabel(art);
    });
    art.addEventListener('transitionend', (e) => {
      if (
        hovered === art &&
        art.classList.contains(PEEK_CLASS) &&
        (e.propertyName === 'transform' || e.propertyName === 'top')
      ) {
        placeLabel(art);
      }
    });
  }
  root.addEventListener('mouseleave', () => {
    if (peekTimer) clearTimeout(peekTimer);
    peekTimer = null;
    if (audioTimer) clearTimeout(audioTimer);
    audioTimer = null;
    for (const a of arts) a.classList.remove(PEEK_CLASS);
    clearPeerShift();
    clearNow();
    stopPreview();
  });
  window.addEventListener('resize', () => {
    if (hovered) placeLabel(hovered);
  });
}

export function initListeningShelves(): void {
  document.querySelectorAll('[data-listening-shelf]').forEach((wrap) => {
    try {
      bindShelf(wrap);
    } catch {
      /* ignore per-shelf failures */
    }
  });
}
