export type ListeningShelfLayout = 'auto' | 'fan' | 'row' | 'stack';

export type ListeningShelfVisualConfig = {
  tileSize: string;
  overlap: number;
  gap: string;
  stackTileSize: string;
  labelMaxWidth: string;
};

export type ListeningShelfHoverConfig = {
  peekDelayMs: number;
  settleMs: number;
  scale: number;
  rotationDeg: number;
  peerSeparation: number;
};

export type ListeningShelfAudioConfig = {
  delayMs: number;
  volume: number;
};

export type ListeningShelfStackConfig = {
  maxVisible: number;
  moveCancelPx: number;
  throwDistanceRatio: number;
  rotationDeg: number;
};

export type ListeningShelfConfig = {
  maxTracks: number;
  lastfmLimit: number;
  itunesConcurrency: number;
  layout: ListeningShelfLayout;
  breakpoint: string;
  visual: ListeningShelfVisualConfig;
  hover: ListeningShelfHoverConfig;
  audio: ListeningShelfAudioConfig;
  stack: ListeningShelfStackConfig;
};

type PartialNested<T> = {
  [K in keyof T]?: T[K] extends object ? PartialNested<T[K]> : T[K];
};

export type ListeningShelfConfigInput = PartialNested<ListeningShelfConfig>;

export const LISTENING_SHELF_DEFAULTS: ListeningShelfConfig = {
  maxTracks: 12,
  lastfmLimit: 12,
  itunesConcurrency: 12,
  layout: 'auto',
  breakpoint: '768px',
  visual: {
    tileSize: 'min(8rem, calc(200cqi / (var(--count) + 1)))',
    overlap: 0.5,
    gap: '2rem',
    stackTileSize: 'min(17rem, min(94cqi, min(92vw, 22rem)))',
    labelMaxWidth: '16rem',
  },
  hover: {
    peekDelayMs: 55,
    settleMs: 400,
    scale: 1.28,
    rotationDeg: 8,
    peerSeparation: 0.88,
  },
  audio: {
    delayMs: 80,
    volume: 0.4,
  },
  stack: {
    maxVisible: 6,
    moveCancelPx: 14,
    throwDistanceRatio: 1,
    rotationDeg: 10,
  },
};

function positiveNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
}

function nonNegativeNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

function nonEmptyString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function layout(value: unknown, fallback: ListeningShelfLayout): ListeningShelfLayout {
  return value === 'auto' || value === 'fan' || value === 'row' || value === 'stack'
    ? value
    : fallback;
}

export function resolveListeningShelfConfig(
  input: ListeningShelfConfigInput = {}
): ListeningShelfConfig {
  const defaults = LISTENING_SHELF_DEFAULTS;
  return {
    maxTracks: positiveNumber(input.maxTracks, defaults.maxTracks),
    lastfmLimit: positiveNumber(input.lastfmLimit, defaults.lastfmLimit),
    itunesConcurrency: positiveNumber(input.itunesConcurrency, defaults.itunesConcurrency),
    layout: layout(input.layout, defaults.layout),
    breakpoint: nonEmptyString(input.breakpoint, defaults.breakpoint),
    visual: {
      tileSize: nonEmptyString(input.visual?.tileSize, defaults.visual.tileSize),
      overlap: positiveNumber(input.visual?.overlap, defaults.visual.overlap),
      gap: nonEmptyString(input.visual?.gap, defaults.visual.gap),
      stackTileSize: nonEmptyString(input.visual?.stackTileSize, defaults.visual.stackTileSize),
      labelMaxWidth: nonEmptyString(input.visual?.labelMaxWidth, defaults.visual.labelMaxWidth),
    },
    hover: {
      peekDelayMs: nonNegativeNumber(input.hover?.peekDelayMs, defaults.hover.peekDelayMs),
      settleMs: nonNegativeNumber(input.hover?.settleMs, defaults.hover.settleMs),
      scale: positiveNumber(input.hover?.scale, defaults.hover.scale),
      rotationDeg: nonNegativeNumber(input.hover?.rotationDeg, defaults.hover.rotationDeg),
      peerSeparation: nonNegativeNumber(input.hover?.peerSeparation, defaults.hover.peerSeparation),
    },
    audio: {
      delayMs: nonNegativeNumber(input.audio?.delayMs, defaults.audio.delayMs),
      volume: Math.min(1, nonNegativeNumber(input.audio?.volume, defaults.audio.volume)),
    },
    stack: {
      maxVisible: Math.max(1, Math.round(positiveNumber(input.stack?.maxVisible, defaults.stack.maxVisible))),
      moveCancelPx: nonNegativeNumber(input.stack?.moveCancelPx, defaults.stack.moveCancelPx),
      throwDistanceRatio: positiveNumber(
        input.stack?.throwDistanceRatio,
        defaults.stack.throwDistanceRatio
      ),
      rotationDeg: nonNegativeNumber(input.stack?.rotationDeg, defaults.stack.rotationDeg),
    },
  };
}
