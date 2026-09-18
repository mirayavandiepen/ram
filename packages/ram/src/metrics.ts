/**
 * One canvas for the life of the page. Measuring runs on every show and every
 * resize, and building a fresh 2D context each time to read two numbers that
 * only depend on the font is waste. `undefined` is not yet attempted, `null`
 * is attempted and unavailable.
 */
let metricsContext: CanvasRenderingContext2D | null | undefined;

/**
 * How much room the line box gave up, in px per side.
 *
 * Display leading usually runs tighter than the glyphs need, so a box drawn
 * flush to the line box cuts the tail off a g. CSS centres the font's content
 * area inside the line box, which makes the shortfall symmetric, so half the
 * difference is exactly the amount to bleed by on each side. Asking the font
 * rather than hard-coding a number means the consumer's leading can be
 * anything without cropping the word.
 *
 * Returns 0 where metrics are unavailable, which draws the flush box rather
 * than guessing at one.
 */
export function contentOverhang(element: HTMLElement, lineBox: number): number {
  if (metricsContext === undefined) {
    metricsContext = document.createElement("canvas").getContext("2d");
  }
  const context = metricsContext;
  if (!context) return 0;

  const style = getComputedStyle(element);
  context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  // Ascent and descent are properties of the font, not of the string.
  const metrics = context.measureText("x");
  const content =
    (metrics.fontBoundingBoxAscent ?? 0) +
    (metrics.fontBoundingBoxDescent ?? 0);

  return Math.max(0, (content - lineBox) / 2);
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Code points, not UTF-16 units, so an emoji counts once. */
export function countCharacters(text: string): number {
  let n = 0;
  for (const _ of text) n++;
  return n;
}
