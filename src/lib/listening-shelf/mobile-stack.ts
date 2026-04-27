import { createPreviewController, installPreviewUnlockOnce } from './preview-audio';

const SWIPE_PX = 44;
const HOLD_MS = 320;
const MOVE_CANCEL_PX = 14;
/** How many cards are fanned in the pile at once (deeper in the list stay hidden until you swipe). */
const MAX_IN_PILE = 6;

/**
 * 1 @ ~300px shelf width; scales offsets so a wider box uses the space instead of a small central clump.
 */
function spreadForShelfWidth(px: number): number {
  if (px < 1) return 1;
  return Math.min(1.32, Math.max(0.9, px / 300));
}

/**
 * Messy, fully opaque spread. `depth` is 0 = front, up to `MAX_IN_PILE - 1` for visible layers.
 */
function messyPileStyle(i: number, depth: number, spread: number) {
  const wobbleR = 5.5 * Math.sin(i * 1.91 + 0.4) + 1.4 * Math.sin((i + 3) * 0.7);
  const wobbleX = 15 * Math.sin(i * 2.07) + 13 * Math.cos((i + 2) * 0.88);
  const fan = depth * (i % 2 === 0 ? 2.8 : -2.5);
  const rot = wobbleR + fan * (0.88 + 0.14 * (spread - 0.9));
  const depthStagger = depth * 7 * Math.sin((i + 1) * 0.55 + depth * 0.2);
  const tx =
    (wobbleX + depth * 4.2 * Math.sin((i + depth) * 0.6) + depthStagger) * spread;
  const ty = (depth * 24 + 0.75 * depth * depth) * (0.94 * spread);
  const scale = Math.max(0.64, 1 - 0.035 * depth);
  return { rot, tx, ty, scale };
}

/**
 * Stacked deck + swipe + hold-to-preview for narrow viewports. Returns cleanup.
 */
export function bindMobileStack(wrap: Element): () => void {
  const root = wrap.querySelector('.listening-shelf-scroll');
  if (!root) return () => {};
  const shelf = root.querySelector('.listening-shelf');
  const line = root.querySelector('.listening-track-line');
  const nowEl = root.querySelector('.listening-track-now');
  if (!shelf || !line || !nowEl) return () => {};
  const now = nowEl as HTMLElement;

  const arts = [...root.querySelectorAll<HTMLElement>('.album-art')];
  const n = arts.length;
  if (n === 0) return () => {};
  for (const el of arts) {
    el.removeAttribute('style');
    el.classList.remove('album-art--peek', 'album-art--stack-top');
  }

  const ac = new AbortController();
  const { signal } = ac;

  installPreviewUnlockOnce();
  const preview = createPreviewController();

  shelf.classList.add('listening-shelf--stack');

  let active = 0;
  let holdTimer: number | null = null;
  let previewStartedByHold = false;
  let ptrDown = false;
  let startX = 0;
  let startY = 0;
  let moved = false;

  const updateLabel = () => {
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
    now.removeAttribute('hidden');
  };

  const applyPile = (animate = true) => {
    const tDur = animate ? '0.55s' : '0s';
    const ease = 'cubic-bezier(0.22, 0.9, 0.28, 1.02)';
    const spread = spreadForShelfWidth(shelf.getBoundingClientRect().width);

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
      const { rot, tx, ty, scale } = messyPileStyle(i, depth, spread);
      const zIndex = 50 + MAX_IN_PILE - depth;
      el.classList.toggle('album-art--stack-top', depth === 0);
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('pointer-events', depth === 0 ? 'auto' : 'none', 'important');
      el.style.setProperty('z-index', String(zIndex), 'important');
      el.style.setProperty('left', '50%', 'important');
      el.style.setProperty('opacity', '1', 'important');
      const tf = `translateX(calc(-50% + ${tx.toFixed(1)}px)) translateY(${ty.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      el.style.setProperty('transform', tf, 'important');
      el.style.setProperty('filter', 'none', 'important');
      el.style.setProperty('transition', `transform ${tDur} ${ease}`, 'important');
    }
  };

  const clearHoldTimer = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    ptrDown = true;
    startX = e.clientX;
    startY = e.clientY;
    moved = false;
    previewStartedByHold = false;
    clearHoldTimer();
    const art = (e.target as Element).closest('.album-art') as HTMLElement | null;
    if (art && art === arts[active]) {
      holdTimer = window.setTimeout(() => {
        holdTimer = null;
        if (!ptrDown || moved) return;
        preview.start(art);
        previewStartedByHold = true;
      }, HOLD_MS);
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!ptrDown) return;
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);
    if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) {
      moved = true;
      clearHoldTimer();
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!ptrDown) return;
    ptrDown = false;
    clearHoldTimer();

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (moved) {
      if (previewStartedByHold) {
        preview.stop();
        previewStartedByHold = false;
      }
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_PX) {
        if (dx < 0) {
          active = (active + 1) % n;
        } else {
          active = (active - 1 + n) % n;
        }
        applyPile(true);
        updateLabel();
      }
    } else if (previewStartedByHold) {
      preview.stop();
      previewStartedByHold = false;
    }
    moved = false;
  };

  const onPointerCancel = () => {
    ptrDown = false;
    clearHoldTimer();
    if (previewStartedByHold) {
      preview.stop();
      previewStartedByHold = false;
    }
  };

  updateLabel();
  applyPile(false);
  requestAnimationFrame(() => applyPile(true));

  shelf.addEventListener('pointerdown', onPointerDown, { signal, passive: true });
  shelf.addEventListener('pointermove', onPointerMove, { signal, passive: true });
  shelf.addEventListener('pointerup', onPointerUp, { signal, passive: true });
  shelf.addEventListener('pointercancel', onPointerCancel, { signal, passive: true });
  window.addEventListener('resize', () => applyPile(true), { signal, passive: true });

  return () => {
    ac.abort();
    preview.stop();
    shelf.classList.remove('listening-shelf--stack');
    for (const el of arts) {
      el.classList.remove('album-art--stack-top');
      el.removeAttribute('style');
    }
    now.textContent = '';
    now.setAttribute('hidden', '');
    now.removeAttribute('style');
  };
}
