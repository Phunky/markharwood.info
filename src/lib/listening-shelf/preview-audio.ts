/** One unlock trick for iOS: first pointer gesture can start unmuted audio later. */
export function installPreviewUnlockOnce(): void {
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

const PREVIEW_VOLUME = 0.4;

export function createPreviewController(): {
  start: (el: Element) => void;
  stop: () => void;
} {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.volume = PREVIEW_VOLUME;
  let lastPreviewUrl = '';
  return {
    start: (el: Element) => {
      const url = el.getAttribute('data-preview-url') || '';
      if (!url) {
        lastPreviewUrl = '';
        try {
          audio.pause();
          audio.removeAttribute('src');
          audio.load();
        } catch {
          /* ignore */
        }
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
        // Often blocked until pointer unlock
      });
    },
    stop: () => {
      lastPreviewUrl = '';
      try {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      } catch {
        /* ignore */
      }
    },
  };
}
