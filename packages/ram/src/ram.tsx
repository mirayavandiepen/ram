import {
  type CSSProperties,
  type Dispatch,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  EASE_IN_OUT,
  EASE_OUT,
  type Tween,
  cubicBezier,
  keyframes,
  tween,
} from "./animate";
import {
  contentOverhang,
  countCharacters,
  prefersReducedMotion,
} from "./metrics";

export type RamSize = {
  /** Rendered width of the content, in px. */
  width: number;
  /** Height of the font's content area, in px. Taller than the line box for tight leading. */
  height: number;
};

export type RamLabelPosition =
  "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type RamHandleFill = "hollow" | "solid";

export type RamAnimation = "tracking" | "static";

export type RamTrigger = "mount" | "hover" | "click" | "manual";

export type RamProps = {
  /** The text to frame. Plain strings track most accurately, but any node works. */
  children: ReactNode;
  /** Milliseconds to wait before the frame appears, on every trigger. */
  delay?: number;
  /** Length of the tracking pass in milliseconds. */
  duration?: number;
  /** How long the frame holds its measurement before leaving, in milliseconds. */
  holdDuration?: number;
  /** Show the width × height label, or format it yourself. */
  label?: boolean | ((size: RamSize) => string);
  /** Where the label sits relative to the outline. */
  labelPosition?: RamLabelPosition;
  /** Draw the four corner handles. */
  handles?: boolean;
  /** Width and height of each corner handle, in px. */
  handleSize?: number;
  /** `hollow` rings each handle around the page colour, the way a design tool
   * draws one; `solid` fills it with the frame colour. */
  handleFill?: RamHandleFill;
  /** Thickness of the outline and of the handle rings, in px. */
  lineWidth?: number;
  /** `tracking` breathes the letter-spacing while the frame is up; `static` only fades. */
  animation?: RamAnimation;
  /** What starts the sequence. Defaults to `manual` when `active` is provided. */
  trigger?: RamTrigger;
  /** Controlled visibility. Setting this implies `trigger="manual"`. */
  active?: boolean;
  /** Keep the frame on the page instead of leaving after the hold. */
  persistent?: boolean;
  /** Colour of the outline, handles and label. Any CSS colour; selection blue by default. */
  color?: string;
  /** Colour of the text inside the label. Defaults to the page colour, so the
   * number reads out of the frame colour behind it. */
  labelColor?: string;
  /** Background of the label chip. Follows the frame colour by default. */
  labelBackground?: string;
  className?: string;
  style?: CSSProperties;
  /** The frame has started to appear. */
  onStart?: () => void;
  /** The frame has left, or, when persistent, has settled. */
  onComplete?: () => void;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Tracking, in em, as an offset from whatever the text already sets. Loose,
 * then well past tight, then back to exactly where it started.
 */
const TRACKING = [0, 0.026, -0.07, 0] as const;
const TRACKING_TIMES = [0, 0.3, 0.63, 1] as const;
const TRACKING_EASES = [EASE_IN_OUT, EASE_IN_OUT, EASE_OUT].map(cubicBezier);

const FADE_IN = 240;
/** The tracking pass starts this many ms before the fade finishes. */
const TRACKING_LEAD = 120;
const FADE_OUT = 200;

/** Sub-pixel churn is not a resize, and re-rendering on it would never settle. */
const RESIZE_EPSILON = 0.5;

const DEFAULT_INSET = 4;

type Measurement = RamSize & {
  /** How far the frame extends past the line box on each side. */
  bleed: number;
  /** Resolved `--ram-inset`, in px. */
  inset: number;
};

type Phase = "hidden" | "pending" | "entering" | "shown" | "leaving";

const formatSize = ({ width, height }: RamSize) =>
  `${Math.round(width)} × ${Math.round(height)}`;

/**
 * The centred label is placed at a whole-pixel origin and then pulled back by
 * half its own width, so an odd or fractional width lands it on a half pixel.
 * The padding is symmetric either way, but the glyphs are not: the browser
 * snaps them off that half pixel in one direction, and the chip reads as
 * tighter on its left. Rounding up to an even number of pixels keeps both
 * edges on the grid, at a cost of at most a pixel of width.
 */
const evenCeil = (n: number) => 2 * Math.ceil(n / 2);

const same = (a: Measurement | null, b: Measurement) =>
  a !== null &&
  Math.abs(a.width - b.width) < RESIZE_EPSILON &&
  Math.abs(a.height - b.height) < RESIZE_EPSILON &&
  a.inset === b.inset;

/**
 * Draws a design-tool selection frame around its children: a hairline outline,
 * four corner handles, and a live `width × height` label.
 *
 * The text is never pinned to a fixed width. Its box grows and shrinks with
 * the tracking, which is exactly what lets the outline and label follow it.
 * What is held constant is the width of the line: a compensating margin gives
 * back whatever the tracking took, so nothing else on the line moves.
 */
export function Ram({
  children,
  delay = 0,
  duration = 1400,
  holdDuration = 1200,
  label = true,
  labelPosition = "top",
  handles = true,
  handleSize,
  handleFill = "hollow",
  lineWidth,
  animation = "tracking",
  trigger: triggerProp,
  active,
  persistent = false,
  color,
  labelColor,
  labelBackground,
  className,
  style,
  onStart,
  onComplete,
}: RamProps) {
  const trigger: RamTrigger =
    triggerProp ?? (active === undefined ? "mount" : "manual");

  const rootRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const badgeTextRef = useRef<HTMLSpanElement>(null);

  const [measurement, setMeasurement] = useState<Measurement | null>(null);

  // Everything the sequence reads at call time rather than at mount time, so
  // a prop can change between two runs without tearing the effect down.
  const latest = useRef({
    delay,
    duration,
    holdDuration,
    label,
    animation,
    trigger,
    persistent,
    onStart,
    onComplete,
  });
  latest.current = {
    delay,
    duration,
    holdDuration,
    label,
    animation,
    trigger,
    persistent,
    onStart,
    onComplete,
  };

  const controller = useRef<ReturnType<typeof createController> | null>(null);
  if (controller.current === null) {
    controller.current = createController({
      rootRef,
      textRef,
      layerRef,
      badgeRef,
      badgeTextRef,
      latest,
      setMeasurement,
    });
  }
  const ctrl = controller.current;

  // An initial measurement so the label is positioned before anything shows.
  // The show itself re-measures, because a webfont can swap in between.
  useIsomorphicLayoutEffect(() => {
    ctrl.measure();
  }, [ctrl, children]);

  useEffect(() => {
    if (trigger !== "mount") return;
    ctrl.show();
    return () => ctrl.dispose();
  }, [ctrl, trigger]);

  useEffect(() => {
    if (trigger !== "manual") return;
    if (active) ctrl.show();
    else ctrl.hide();
  }, [ctrl, trigger, active]);

  useEffect(() => () => ctrl.dispose(), [ctrl]);

  const bleed = measurement?.bleed ?? 0;
  const labelText =
    measurement === null
      ? ""
      : typeof label === "function"
        ? label(measurement)
        : formatSize(measurement);

  // Every appearance prop is a shorthand for the custom property the
  // stylesheet already reads, so a prop and a `style` override are the same
  // mechanism and `style` wins by landing last.
  const vars: Record<string, string> = {};
  if (color !== undefined) vars["--ram-color"] = color;
  if (lineWidth !== undefined) vars["--ram-line-width"] = `${lineWidth}px`;
  if (handleSize !== undefined) vars["--ram-handle-size"] = `${handleSize}px`;
  if (labelColor !== undefined) vars["--ram-label-color"] = labelColor;
  if (labelBackground !== undefined) {
    vars["--ram-label-background"] = labelBackground;
  }

  const rootStyle: CSSProperties = {
    position: "relative",
    display: "inline-block",
    ...(vars as CSSProperties),
    ...style,
  };

  const interactions =
    trigger === "hover"
      ? { onPointerEnter: ctrl.show, onPointerLeave: ctrl.hide }
      : trigger === "click"
        ? { onClick: ctrl.toggle }
        : null;

  return (
    <span
      ref={rootRef}
      data-ram=""
      className={className}
      style={rootStyle}
      {...interactions}
    >
      <span ref={textRef} data-ram-text="">
        {children}
      </span>
      {/* Decoration throughout: out of the accessibility tree, takes no
          pointer, and never comes along when the text is selected. Always in
          the DOM so the sequence has an element to animate the moment it is
          triggered; invisible until then. */}
      <span
        ref={layerRef}
        aria-hidden="true"
        data-ram-layer=""
        style={{
          ...layerStyle,
          top: -bleed,
          bottom: -bleed,
        }}
      >
        <span data-ram-outline="" style={outlineStyle} />
        {handles
          ? HANDLE_STYLES[handleFill].map((handle, i) => (
              <span key={i} data-ram-handle="" style={handle} />
            ))
          : null}
        {label ? (
          <span
            ref={badgeRef}
            data-ram-label=""
            style={{
              ...badgeStyle,
              ...labelPlacement(labelPosition, measurement),
            }}
          >
            {/* The shell takes its background from the layer's colour via
                currentColor, so the text colour has to live one level down:
                on the same element it would resolve against itself. */}
            <span ref={badgeTextRef} style={badgeTextStyle}>
              {labelText}
            </span>
          </span>
        ) : null}
      </span>
    </span>
  );
}

type ControllerArgs = {
  rootRef: RefObject<HTMLSpanElement | null>;
  textRef: RefObject<HTMLSpanElement | null>;
  layerRef: RefObject<HTMLSpanElement | null>;
  badgeRef: RefObject<HTMLSpanElement | null>;
  badgeTextRef: RefObject<HTMLSpanElement | null>;
  latest: MutableRefObject<{
    delay: number;
    duration: number;
    holdDuration: number;
    label: RamProps["label"];
    animation: RamAnimation;
    trigger: RamTrigger;
    persistent: boolean;
    onStart?: () => void;
    onComplete?: () => void;
  }>;
  setMeasurement: Dispatch<SetStateAction<Measurement | null>>;
};

/**
 * The sequence, as imperative work against the DOM. Kept outside React state
 * because every frame of the tracking pass would otherwise be a re-render,
 * and the frame only needs React for its initial placement.
 */
function createController({
  rootRef,
  textRef,
  layerRef,
  badgeRef,
  badgeTextRef,
  latest,
  setMeasurement,
}: ControllerArgs) {
  let phase: Phase = "hidden";
  let observer: ResizeObserver | undefined;
  /**
   * The resting trailing letter-space, in px. See `applyTrail`.
   */
  let trail = 0;
  const tweens = new Set<Tween>();
  const timers = new Set<number>();

  const formatLabel = (size: RamSize) => {
    const { label } = latest.current;
    return typeof label === "function" ? label(size) : formatSize(size);
  };

  const measure = (): Measurement | null => {
    const root = rootRef.current;
    if (!root) return null;
    const rect = root.getBoundingClientRect();
    const computed = getComputedStyle(root);
    const bleed = contentOverhang(root, rect.height);
    const inset =
      Number.parseFloat(computed.getPropertyValue("--ram-inset")) ||
      DEFAULT_INSET;
    // Reads "normal" when nothing has set it, which parses to NaN.
    trail = Number.parseFloat(computed.letterSpacing) || 0;
    applyTrail(trail);
    const next: Measurement = {
      width: rect.width - trail,
      height: rect.height + bleed * 2,
      bleed,
      inset,
    };
    setMeasurement((previous) => (same(previous, next) ? previous : next));
    return next;
  };

  /**
   * letter-spacing lands after every character, the last one included, so the
   * element is one whole letter-space wider than the text inside it. Tracking
   * is usually negative in display type, which makes that trailing space
   * negative too: the box ends up narrower than the word, and the frame's
   * right edge crops into the final glyph while its left edge sits where it
   * should. The layer reads this back out, so the outline bounds the text
   * rather than the box, and the label reports the width of the word.
   */
  const applyTrail = (px: number) => {
    rootRef.current?.style.setProperty("--ram-trail", `${px}px`);
  };

  const clearWork = () => {
    for (const t of tweens) t.stop();
    tweens.clear();
    for (const t of timers) window.clearTimeout(t);
    timers.clear();
    observer?.disconnect();
    observer = undefined;
  };

  const run = (t: Tween) => {
    tweens.add(t);
    return t;
  };

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };

  const resetText = () => {
    const root = rootRef.current;
    if (root) {
      root.style.letterSpacing = "";
      root.style.marginRight = "";
      applyTrail(trail);
    }
  };

  const autoHides = () => {
    const { trigger, persistent } = latest.current;
    return !persistent && (trigger === "mount" || trigger === "click");
  };

  const enter = () => {
    const root = rootRef.current;
    const layer = layerRef.current;
    if (!root || !layer) {
      phase = "hidden";
      return;
    }
    phase = "entering";

    // Read now rather than at mount. A webfont can swap in between, and a
    // baseline taken against the fallback would have the label reporting a
    // number the word never had.
    const rest = measure();
    if (!rest) return;
    // The resting tracking, which `measure` has just read.
    const restSpacing = trail;
    const fontSize = Number.parseFloat(getComputedStyle(root).fontSize);

    // Freeze the label at its resting width. The number can lose a digit at
    // the tight extreme, and a chip that resizes around a centred origin
    // shifts by half a digit when it does. One layout read, taken here on the
    // beat rather than anywhere near the per-frame path.
    const badge = badgeRef.current;
    const badgeText = badgeTextRef.current;
    if (badge && badgeText) {
      badgeText.textContent = formatLabel(rest);
      badge.style.width = "";
      badge.style.width = `${evenCeil(badge.getBoundingClientRect().width)}px`;
    }

    layer.style.visibility = "visible";
    latest.current.onStart?.();

    const from = Number.parseFloat(layer.style.opacity) || 0;
    run(
      tween({
        duration: FADE_IN * (1 - from),
        ease: EASE_OUT,
        onUpdate: (p) => {
          layer.style.opacity = String(from + (1 - from) * p);
        },
      }),
    );

    const settle = () => {
      phase = "shown";
      // Only attached at rest. During the pass this would fire every frame,
      // and every frame would be a re-render. It fires once on connect, which
      // re-syncs the label against anything that moved while the sequence
      // ran, a late webfont swap being the one that actually happens.
      observer = new ResizeObserver(() => {
        const next = measure();
        if (next && badgeText) badgeText.textContent = formatLabel(next);
      });
      observer.observe(root);

      if (autoHides()) later(hide, latest.current.holdDuration);
      else latest.current.onComplete?.();
    };

    const tracks =
      latest.current.animation === "tracking" && !prefersReducedMotion();
    if (!tracks) {
      settle();
      return;
    }

    const count = countCharacters(textRef.current?.textContent ?? "");
    run(
      tween({
        delay: Math.max(0, FADE_IN - TRACKING_LEAD),
        duration: latest.current.duration,
        onUpdate: (p) => {
          const offsetPx =
            keyframes(TRACKING, TRACKING_TIMES, TRACKING_EASES, p) * fontSize;
          // letter-spacing lands after every character including the last, so
          // the width the text gains is the offset times the whole count.
          const delta = offsetPx * count;
          root.style.letterSpacing = `${restSpacing + offsetPx}px`;
          // Hand the delta straight back, so the line's total advance never
          // changes and nothing around the text moves.
          root.style.marginRight = `${-delta}px`;
          // The trailing space tracks with the rest of them, so the right
          // edge stays off the last glyph for the whole pass.
          applyTrail(restSpacing + offsetPx);
          // Predicted, never measured: no layout read on the per-frame path.
          if (badgeText) {
            badgeText.textContent = formatLabel({
              // One of the deltas went behind the last character rather than
              // between two of them, and the frame does not draw that one.
              width: rest.width + delta - offsetPx,
              height: rest.height,
            });
          }
        },
        onComplete: () => {
          // Back to the text's own tracking, and the compensation goes with
          // it. A frozen px value would leave the text mistracked at every
          // width but this one.
          resetText();
          settle();
        },
      }),
    );
  };

  const show = () => {
    if (phase === "pending" || phase === "entering" || phase === "shown") {
      return;
    }
    clearWork();
    const { delay } = latest.current;
    if (delay > 0) {
      phase = "pending";
      later(enter, delay);
    } else {
      enter();
    }
  };

  const hide = () => {
    if (phase === "hidden" || phase === "leaving") return;
    const wasPending = phase === "pending";
    clearWork();
    resetText();
    if (wasPending) {
      phase = "hidden";
      return;
    }
    const layer = layerRef.current;
    if (!layer) {
      phase = "hidden";
      return;
    }
    phase = "leaving";
    const from = Number.parseFloat(layer.style.opacity) || 0;
    run(
      tween({
        duration: FADE_OUT * from,
        ease: EASE_OUT,
        onUpdate: (p) => {
          layer.style.opacity = String(from * (1 - p));
        },
        onComplete: () => {
          layer.style.visibility = "hidden";
          if (badgeRef.current) badgeRef.current.style.width = "";
          phase = "hidden";
          latest.current.onComplete?.();
        },
      }),
    );
  };

  const toggle = () => {
    if (phase === "hidden" || phase === "leaving") show();
    else hide();
  };

  /** Everything off, instantly. For unmount and for strict-mode re-runs. */
  const dispose = () => {
    clearWork();
    resetText();
    const layer = layerRef.current;
    if (layer) {
      layer.style.opacity = "0";
      layer.style.visibility = "hidden";
    }
    if (badgeRef.current) badgeRef.current.style.width = "";
    phase = "hidden";
  };

  return { measure, show, hide, toggle, dispose };
}

/**
 * The blue every design tool draws a selection in. A frame that borrowed the
 * text's own colour read as an underline with corners; in the tool's colour
 * it reads as what it is, a selection, on top of type of any colour.
 */
const DEFAULT_COLOR = "#0d99ff";

const HANDLE_SIZE = "var(--ram-handle-size, 6px)";
/** Each handle is pulled back by half its size so it straddles the corner. */
const HANDLE_OFFSET = `calc(${HANDLE_SIZE} / -2)`;

const LABEL_OFFSET = "var(--ram-label-offset, 6px)";

const layerStyle: CSSProperties = {
  position: "absolute",
  left: "calc(var(--ram-inset, 4px) * -1)",
  // `--ram-trail` is the trailing letter-space the element carries and the
  // text does not. Giving it back here is what makes the gap on the right
  // match the gap on the left.
  right: "calc(var(--ram-inset, 4px) * -1 + var(--ram-trail, 0px))",
  color: `var(--ram-color, ${DEFAULT_COLOR})`,
  pointerEvents: "none",
  userSelect: "none",
  opacity: 0,
  visibility: "hidden",
  // The tracking being animated is an inline style on the root, and
  // letter-spacing inherits. Without this the label would be handed the
  // text's tracking in px, which crushes it at the tight extreme.
  letterSpacing: "normal",
  fontStyle: "normal",
  textTransform: "none",
  textDecoration: "none",
};

/**
 * The outline is a child rather than a border on the layer itself, so the
 * handles and label measure from the stroke instead of a padding box already
 * inset by its width. Held below full strength so the guide stays subordinate
 * to the text it is measuring.
 */
const outlineStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  border: "var(--ram-line-width, 1px) solid currentColor",
  opacity: "var(--ram-outline-opacity, 0.6)",
};

/**
 * The only part of the frame at full strength: these are what you would grab.
 * Hollow by default, which is how every design tool draws a handle — the ring
 * reads as a grabbable corner, and the pale centre keeps the mark legible on
 * top of the text it is sitting over.
 */
const handleBase: CSSProperties = {
  position: "absolute",
  boxSizing: "border-box",
  width: HANDLE_SIZE,
  height: HANDLE_SIZE,
};

const handleStyles: Record<RamHandleFill, CSSProperties> = {
  hollow: {
    ...handleBase,
    background: "var(--ram-handle-fill, light-dark(#fff, #111))",
    border: "var(--ram-line-width, 1px) solid currentColor",
  },
  solid: { ...handleBase, background: "currentColor" },
};

const corners = (handle: CSSProperties): CSSProperties[] => [
  { ...handle, top: HANDLE_OFFSET, left: HANDLE_OFFSET },
  { ...handle, top: HANDLE_OFFSET, right: HANDLE_OFFSET },
  { ...handle, bottom: HANDLE_OFFSET, left: HANDLE_OFFSET },
  { ...handle, bottom: HANDLE_OFFSET, right: HANDLE_OFFSET },
];

const HANDLE_STYLES: Record<RamHandleFill, CSSProperties[]> = {
  hollow: corners(handleStyles.hollow),
  solid: corners(handleStyles.solid),
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  display: "block",
  boxSizing: "border-box",
  padding: "1px 5px",
  borderRadius: 3,
  background: "var(--ram-label-background, currentColor)",
  fontSize: "var(--ram-label-font-size, 11px)",
  fontWeight: 500,
  lineHeight: 1.3,
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
  textAlign: "center",
};

const badgeTextStyle: CSSProperties = {
  display: "block",
  color: "var(--ram-label-color, light-dark(#fff, #111))",
};

/**
 * Centred positions are pinned to the outline's resting centre in px rather
 * than to `50%`. A percentage resolves against the layer, which is as wide as
 * the text currently is, so the label would slide back and forth for the
 * whole pass. The measurement is taken at rest and holds still while the frame
 * breathes.
 */
function labelPlacement(
  position: RamLabelPosition,
  measurement: Measurement | null,
): CSSProperties {
  const vertical: CSSProperties = position.startsWith("top")
    ? { bottom: "100%", marginBottom: LABEL_OFFSET }
    : { top: "100%", marginTop: LABEL_OFFSET };

  if (position.endsWith("-left")) return { ...vertical, left: 0 };
  if (position.endsWith("-right")) return { ...vertical, right: 0 };

  const centre =
    measurement === null
      ? "50%"
      : Math.round((measurement.width + measurement.inset * 2) / 2);
  return { ...vertical, left: centre, transform: "translateX(-50%)" };
}
