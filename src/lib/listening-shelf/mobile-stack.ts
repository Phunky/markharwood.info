import { createPreviewController, installPreviewUnlockOnce } from './preview-audio';

/** Movement past this marks an intentional gesture (not hold jitter cleanup). */
const MOVE_CANCEL_PX = 14;
/** How many cards are stacked at once (deeper in the list stay hidden until you advance). */
const MAX_IN_PILE = 6;
/** Drag → release distance past this (px) cycles the top card (see CodePen shuffle deck). */
const THROW_DISTANCE_RATIO = 1;

/** Inline props set in `applyPile` (incl. `!important`); must not nuke --i / z-index from `buildShelfScroll` or desktop returns broken. */
const MOBILE_PILE_STYLE_PROPS = [
  'visibility',
  'pointer-events',
  'z-index',
  'opacity',
  'filter',
  'transform',
  'transition',
  'left',
] as const;

function stripMobilePileInlineStyles(el: HTMLElement) {
  for (const p of MOBILE_PILE_STYLE_PROPS) {
    el.style.removeProperty(p);
  }
}

function reapplyBaseAlbumArtFromDataIndex(el: HTMLElement) {
  const raw = el.getAttribute('data-index');
  if (raw == null) return;
  const i = parseInt(raw, 10);
  if (Number.isNaN(i)) return;
  el.style.setProperty('--i', String(i));
  el.style.removeProperty('z-index');
}

function prepareArtForMobileStack(el: HTMLElement) {
  el.classList.remove('album-art--peek', 'album-art--stack-top');
  el.style.removeProperty('--peer-shift');
  stripMobilePileInlineStyles(el);
  reapplyBaseAlbumArtFromDataIndex(el);
  el.querySelectorAll('img').forEach((img) => {
    img.setAttribute('draggable', 'false');
  });
}

function resetArtForDesktopRow(el: HTMLElement) {
  el.classList.remove('album-art--peek', 'album-art--stack-top');
  stripMobilePileInlineStyles(el);
  reapplyBaseAlbumArtFromDataIndex(el);
}

/** Stable “random” tilt per card index (CodePen uses roughly −10°…10°). */
function stackRotationDegrees(i: number): number {
  const s = Math.imul(i, 1103515245) + 12345;
  const u = ((s >>> 0) % 10001) / 10000;
  return -10 + u * 20;
}

function useHoverDeckPreview(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Stacked deck (shuffle drag + throw). Title/artist overlay + preview only on hover (fine pointer) or touch.
 */
export function bindMobileStack(wrap: Element): () => void {
  const root = wrap.querySelector('.listening-shelf-scroll');
  if (!root) return () => {};
  const shelf = root.querySelector('.listening-shelf');
  const line = root.querySelector('.listening-track-line');
  const nowEl = root.querySelector('.listening-track-now');
  if (!shelf || !line || !nowEl) return () => {};
  const lineEl = line as HTMLElement;
  const now = nowEl as HTMLElement;

  const arts = [...root.querySelectorAll<HTMLElement>('.album-art')];
  const n = arts.length;
  if (n === 0) return () => {};
  for (const el of arts) {
    prepareArtForMobileStack(el);
  }

  const ac = new AbortController();
  const { signal } = ac;

  installPreviewUnlockOnce();
  const preview = createPreviewController();

  shelf.classList.add('listening-shelf--stack');

  let active = 0;
  let hoverAc: AbortController | null = null;
  let ptrDown = false;
  let startX = 0;
  let startY = 0;
  let moved = false;
  let dragging = false;
  let dragDx = 0;
  let dragDy = 0;
  let dragPointerId: number | null = null;
  let labelSyncedForActive = -1;

  const pileEase = 'cubic-bezier(0.22, 0.9, 0.28, 1.02)';

  function fillNowFromActive() {
    const art = arts[active];
    if (!art) return;
    const track = art.getAttribute('data-track') || '';
    const ar = art.getAttribute('data-artist') || '';
    now.textContent = '';
    const t = document.createElement('span');
    t.className = 'listening-track-title';
    t.textContent = track || 'Unknown track';
    const a = document.createElement('span');
    a.className = 'listening-track-artist';
    a.textContent = ar || 'Unknown artist';
    now.append(t, a);
  }

  function applyTrackLinePosition(tDur: string, ease: string) {
    if (now.hasAttribute('hidden')) {
      lineEl.style.removeProperty('transform');
      lineEl.style.removeProperty('transition');
      return;
    }
    const tiltDeg = stackRotationDegrees(active);
    lineEl.style.setProperty(
      'transform',
      `translateX(calc(-50% + ${dragDx.toFixed(1)}px)) translateY(calc(-50% + ${dragDy.toFixed(1)}px)) rotate(${tiltDeg.toFixed(2)}deg)`,
      'important'
    );
    lineEl.style.setProperty('transition', dragging ? 'none' : `transform ${tDur} ${ease}`, 'important');
  }

  function revealTrackLine() {
    fillNowFromActive();
    labelSyncedForActive = active;
    now.removeAttribute('hidden');
    applyTrackLinePosition('0.22s', pileEase);
  }

  function concealTrackLine() {
    now.textContent = '';
    now.setAttribute('hidden', '');
    lineEl.style.removeProperty('transform');
    lineEl.style.removeProperty('transition');
    labelSyncedForActive = -1;
  }

  /** Preview + overlay visible only while hover (desktop) / touch (pointer gesture). */
  function endPointerGestureRestoreHover() {
    preview.stop();
    requestAnimationFrame(() => {
      const top = arts[active];
      if (top?.matches(':hover')) {
        revealTrackLine();
        preview.start(top);
      } else {
        concealTrackLine();
      }
    });
  }

  function reconnectHoverInteractions() {
    hoverAc?.abort();
    hoverAc = null;
    if (!useHoverDeckPreview()) return;
    hoverAc = new AbortController();
    const hSig = hoverAc.signal;
    const top = arts[active];
    if (!top) return;
    top.addEventListener(
      'mouseenter',
      () => {
        revealTrackLine();
        preview.start(top);
      },
      { signal: hSig }
    );
    top.addEventListener(
      'mouseleave',
      () => {
        if (!ptrDown) {
          preview.stop();
          concealTrackLine();
        }
      },
      { signal: hSig }
    );
  }

  const applyPile = (animate = true) => {
    const tDur = animate && !dragging ? '0.22s' : '0s';
    const ease = pileEase;

    for (let i = 0; i < n; i++) {
      const el = arts[i]!;
      const depth = (i - active + n) % n;
      if (depth >= MAX_IN_PILE) {
        el.classList.remove('album-art--stack-top');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.style.setProperty('z-index', '0', 'important');
        el.style.setProperty('opacity', '1', 'important');
        el.style.setProperty('filter', 'none', 'important');
        el.style.setProperty('transform', 'translateX(-50%) scale(0.01)', 'important');
        el.style.setProperty('transition', `transform ${tDur} ${ease}, visibility 0.15s linear`, 'important');
        continue;
      }
      const rot = stackRotationDegrees(i);
      const zIndex = 50 + MAX_IN_PILE - depth;
      el.classList.toggle('album-art--stack-top', depth === 0);
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('pointer-events', depth === 0 ? 'auto' : 'none', 'important');
      el.style.setProperty('z-index', String(zIndex), 'important');
      el.style.setProperty('left', '50%', 'important');
      el.style.setProperty('opacity', '1', 'important');
      const pullX = depth === 0 ? dragDx : 0;
      const pullY = depth === 0 ? dragDy : 0;
      const tf = `translateX(calc(-50% + ${pullX.toFixed(1)}px)) translateY(${pullY.toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`;
      el.style.setProperty('transform', tf, 'important');
      el.style.setProperty('filter', 'none', 'important');
      el.style.setProperty('transition', `transform ${tDur} ${ease}`, 'important');
    }
    if (!now.hasAttribute('hidden')) {
      if (labelSyncedForActive !== active) {
        labelSyncedForActive = active;
        fillNowFromActive();
      }
      applyTrackLinePosition(tDur, ease);
    }
    reconnectHoverInteractions();
  };

  const releaseCaptureIfAny = (e: PointerEvent) => {
    const art = arts[active];
    if (art?.hasPointerCapture?.(e.pointerId)) {
      try {
        art.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    const art = (e.target as Element).closest('.album-art') as HTMLElement | null;
    if (!art || art !== arts[active]) return;
    if (e.button !== 0) return;
    e.preventDefault();

    ptrDown = true;
    startX = e.clientX;
    startY = e.clientY;
    moved = false;
    dragging = false;
    dragDx = 0;
    dragDy = 0;
    dragPointerId = e.pointerId;
    try {
      art.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    revealTrackLine();
    preview.start(art);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!ptrDown || e.pointerId !== dragPointerId) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const dist0 = Math.hypot(dx, dy);

    if (dist0 >= MOVE_CANCEL_PX || Math.abs(dx) > MOVE_CANCEL_PX || Math.abs(dy) > MOVE_CANCEL_PX) {
      if (!moved) {
        moved = true;
      }
    }
    if (dist0 < 1.5) return;

    if (!dragging) {
      dragging = true;
    }
    dragDx = dx;
    dragDy = dy;
    applyPile(false);
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!ptrDown || e.pointerId !== dragPointerId) return;
    ptrDown = false;
    dragPointerId = null;
    releaseCaptureIfAny(e);

    if (dragging) {
      dragging = false;
      const art = arts[active];
      const dist = Math.hypot(dragDx, dragDy);
      const w = art?.getBoundingClientRect().width ?? 1;
      if (dist > w * THROW_DISTANCE_RATIO) {
        active = (active + 1) % n;
      }
      dragDx = 0;
      dragDy = 0;
      applyPile(true);
    }

    endPointerGestureRestoreHover();

    moved = false;
  };

  const onPointerCancel = (e: PointerEvent) => {
    if (!ptrDown || e.pointerId !== dragPointerId) return;
    ptrDown = false;
    dragPointerId = null;
    releaseCaptureIfAny(e);
    if (dragging) {
      dragging = false;
      dragDx = 0;
      dragDy = 0;
      applyPile(true);
    }
    endPointerGestureRestoreHover();
    moved = false;
  };

  concealTrackLine();
  applyPile(false);
  requestAnimationFrame(() => applyPile(true));

  shelf.addEventListener('pointerdown', onPointerDown, { signal, passive: false });
  shelf.addEventListener('pointermove', onPointerMove, { signal, passive: true });
  shelf.addEventListener('pointerup', onPointerUp, { signal, passive: true });
  shelf.addEventListener('pointercancel', onPointerCancel, { signal, passive: true });
  window.addEventListener('resize', () => applyPile(true), { signal, passive: true });

  return () => {
    hoverAc?.abort();
    ac.abort();
    preview.stop();
    shelf.classList.remove('listening-shelf--stack');
    for (const el of arts) {
      resetArtForDesktopRow(el);
    }
    now.textContent = '';
    now.setAttribute('hidden', '');
    now.removeAttribute('style');
    lineEl.removeAttribute('style');
  };
}
