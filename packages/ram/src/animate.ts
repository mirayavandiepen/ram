/**
 * A very small tween runner. The whole library animates two things, an
 * opacity and a letter-spacing offset, so pulling in an animation library for
 * it would cost consumers more bytes than everything else here combined.
 */

export type Easing = readonly [number, number, number, number];

export const EASE_OUT: Easing = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: Easing = [0.65, 0, 0.35, 1];

type EasingFn = (t: number) => number;

const LINEAR: EasingFn = (t) => t;

/** Cubic bezier solved for y at a given x with Newton–Raphson. */
export function cubicBezier([x1, y1, x2, y2]: Easing): EasingFn {
  if (x1 === y1 && x2 === y2) return LINEAR;

  const a = (p1: number, p2: number) => 1 - 3 * p2 + 3 * p1;
  const b = (p1: number, p2: number) => 3 * p2 - 6 * p1;
  const c = (p1: number) => 3 * p1;
  const at = (t: number, p1: number, p2: number) =>
    ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t;
  const slope = (t: number, p1: number, p2: number) =>
    3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1);

  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = slope(t, x1, x2);
      if (s === 0) break;
      t -= (at(t, x1, x2) - x) / s;
    }
    return at(t, y1, y2);
  };
}

export type Tween = { stop: () => void };

type TweenOptions = {
  duration: number;
  delay?: number;
  ease?: Easing;
  /** Receives eased progress, 0 to 1. */
  onUpdate: (progress: number) => void;
  onComplete?: () => void;
};

export function tween({
  duration,
  delay = 0,
  ease,
  onUpdate,
  onComplete,
}: TweenOptions): Tween {
  const easing = ease ? cubicBezier(ease) : LINEAR;
  let frame = 0;
  let timer = 0;
  let stopped = false;

  const run = () => {
    const start = performance.now();
    const step = (now: number) => {
      if (stopped) return;
      const p = duration <= 0 ? 1 : Math.min(1, (now - start) / duration);
      onUpdate(easing(p));
      if (p < 1) {
        frame = requestAnimationFrame(step);
      } else {
        stopped = true;
        onComplete?.();
      }
    };
    frame = requestAnimationFrame(step);
  };

  if (delay > 0) timer = window.setTimeout(run, delay);
  else run();

  return {
    stop() {
      stopped = true;
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    },
  };
}

/**
 * Piecewise interpolation through `values` at normalised `times`, with one
 * easing per segment. Mirrors the keyframe shape of most animation libraries so
 * the tracking curve reads the same way it would there.
 */
export function keyframes(
  values: readonly number[],
  times: readonly number[],
  eases: readonly EasingFn[],
  progress: number,
): number {
  const last = values.length - 1;
  if (progress <= 0) return values[0] ?? 0;
  if (progress >= 1) return values[last] ?? 0;
  for (let i = 0; i < last; i++) {
    const t0 = times[i] ?? 0;
    const t1 = times[i + 1] ?? 1;
    if (progress <= t1) {
      const local = t1 === t0 ? 1 : (progress - t0) / (t1 - t0);
      const eased = (eases[i] ?? LINEAR)(local);
      const v0 = values[i] ?? 0;
      const v1 = values[i + 1] ?? 0;
      return v0 + (v1 - v0) * eased;
    }
  }
  return values[last] ?? 0;
}
