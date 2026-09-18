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
import { contentOverhang, countCharacters, prefersReducedMotion } from "./metrics";

export type KernedSize = {
  /** Rendered width of the content, in px. */
  width: number;
  /** Height of the font's content area, in px. Taller than the line box for tight leading. */
  height: number;
};

export type KernedLabelPosition =
  | "top"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type KernedAnimation = "tracking" | "static";

export type KernedTrigger = "mount" | "hover" | "click" | "manual";

export type KernedProps = {
  /** The text to mark. Plain strings track most accurately, but any node works. */
  children: ReactNode;
  /** Milliseconds to wait before the box appears, on every trigger. */
  delay?: number;
  /** Length of the tracking pass in milliseconds. */
  duration?: number;
  /** How long the box holds its measurement before leaving, in milliseconds. */
  holdDuration?: number;
  /** Show the width × height label, or format it yourself. */
  label?: boolean | ((size: KernedSize) => string);
  /** Where the label sits relative to the outline. */
  labelPosition?: KernedLabelPosition;
  /** Draw the four corner handles. */
  handles?: boolean;
  /** `tracking` breathes the letter-spacing while the box is up; `static` only fades. */
  animation?: KernedAnimation;
  /** What starts the sequence. Defaults to `manual` when `active` is provided. */
  trigger?: KernedTrigger;
  /** Controlled visibility. Setting this implies `trigger="manual"`. */
  active?: boolean;
  /** Keep the box on the page instead of leaving after the hold. */
  persistent?: boolean;
  /** Colour of the outline, handles and label. Any CSS colour. */
  color?: string;
  className?: string;
  style?: CSSProperties;
  /** The box has started to appear. */
  onStart?: () => void;
  /** The box has left, or, when persistent, has settled. */
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
const FADE_OUT = 320;

/** Sub-pixel churn is not a resize, and re-rendering on it would never settle. */
const RESIZE_EPSILON = 0.5;

const DEFAULT_INSET = 4;

type Measurement = KernedSize & {
  /** How far the box extends past the line box on each side. */
  bleed: number;
  /** Resolved `--kerned-inset`, in px. */
  inset: number;
};

type Phase = "hidden" | "pending" | "entering" | "shown" | "leaving";

const formatSize = ({ width, height }: KernedSize) =>
  `${Math.round(width)} × ${Math.round(height)}`;

const same = (a: Measurement | null, b: Measurement) =>
  a !== null &&
  Math.abs(a.width - b.width) < RESIZE_EPSILON &&
  Math.abs(a.height - b.height) < RESIZE_EPSILON &&
  a.inset === b.inset;

/**
 * Draws a design-tool selection box around its children: a hairline outline,
 * four corner handles, and a live `width × height` label.
 *
 * The text is never pinned to a fixed width. Its box grows and shrinks with
 * the tracking, which is exactly what lets the outline and label follow it.
 * What is held constant is the width of the line: a compensating margin gives
 * back whatever the tracking took, so nothing else on the line moves.
 */
export function Kerned({
  children,
  delay = 0,
  duration = 1400,
  holdDuration = 1200,
  label = true,
  labelPosition = "top",
  handles = true,
  animation = "tracking",
  trigger: triggerProp,
  active,
  persistent = false,
  color,
  className,
  style,
  onStart,
  onComplete,
}: KernedProps) {
  const trigger: KernedTrigger =
    triggerProp ?? (active === undefined ? "mount" : "manual");

  const rootRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

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

  const rootStyle: CSSProperties = {
    position: "relative",
    display: "inline-block",
    ...(color !== undefined
      ? ({ "--kerned-color": color } as CSSProperties)
      : null),
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
      data-kerned=""
      className={className}
      style={rootStyle}
      {...interactions}
    >
      <span ref={textRef} data-kerned-text="">
        {children}
      </span>
      {/* Decoration throughout: out of the accessibility tree, takes no
          pointer, and never comes along when the text is selected. Always in
          the DOM so the sequence has an element to animate the moment it is
          triggered; invisible until then. */}
      <span
        ref={layerRef}
        aria-hidden="true"
        data-kerned-layer=""
        style={{
          ...layerStyle,
          top: -bleed,
          bottom: -bleed,
        }}
      >
        <span data-kerned-outline="" style={outlineStyle} />
        {handles
          ? HANDLE_STYLES.map((handle, i) => (
              <span key={i} data-kerned-handle="" style={handle} />
            ))
          : null}
        {label ? (
          <span
            ref={badgeRef}
            data-kerned-label=""
            style={{
              ...badgeStyle,
              ...labelPlacement(labelPosition, measurement),
            }}
          >
            {labelText}
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
  latest: MutableRefObject<{
    delay: number;
    duration: number;
    holdDuration: number;
    label: KernedProps["label"];
    animation: KernedAnimation;
    trigger: KernedTrigger;
    persistent: boolean;
    onStart?: () => void;
    onComplete?: () => void;
  }>;
  setMeasurement: Dispatch<SetStateAction<Measurement | null>>;
};

/**
 * The sequence, as imperative work against the DOM. Kept outside React state
 * because every frame of the tracking pass would otherwise be a re-render,
 * and the box only needs React for its initial placement.
 */
function createController({
  rootRef,
  textRef,
  layerRef,
  badgeRef,
  latest,
  setMeasurement,
}: ControllerArgs) {
  let phase: Phase = "hidden";
  let observer: ResizeObserver | undefined;
  const tweens = new Set<Tween>();
  const timers = new Set<number>();

  const formatLabel = (size: KernedSize) => {
    const { label } = latest.current;
    return typeof label === "function" ? label(size) : formatSize(size);
  };

  const measure = (): Measurement | null => {
    const root = rootRef.current;
    if (!root) return null;
    const rect = root.getBoundingClientRect();
    const bleed = contentOverhang(root, rect.height);
    const inset =
      Number.parseFloat(
        getComputedStyle(root).getPropertyValue("--kerned-inset"),
      ) || DEFAULT_INSET;
    const next: Measurement = {
      width: rect.width,
      height: rect.height + bleed * 2,
      bleed,
      inset,
    };
    setMeasurement((previous) => (same(previous, next) ? previous : next));
    return next;
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
    const computed = getComputedStyle(root);
    // Reads "normal" when nothing has set it, which parses to NaN.
    const restSpacing = Number.parseFloat(computed.letterSpacing) || 0;
    const fontSize = Number.parseFloat(computed.fontSize);

    // Freeze the label at its resting width. The number can lose a digit at
    // the tight extreme, and a chip that resizes around a centred origin
    // shifts by half a digit when it does. One layout read, taken here on the
    // beat rather than anywhere near the per-frame path.
    const badge = badgeRef.current;
    if (badge) {
      badge.textContent = formatLabel(rest);
      badge.style.width = "";
      badge.style.width = `${badge.getBoundingClientRect().width}px`;
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
        if (next && badge) badge.textContent = formatLabel(next);
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
          // Predicted, never measured: no layout read on the per-frame path.
          if (badge) {
            badge.textContent = formatLabel({
              width: rest.width + delta,
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

const HANDLE_SIZE = "var(--kerned-handle-size, 6px)";
/** Each handle is pulled back by half its size so it straddles the corner. */
const HANDLE_OFFSET = `calc(${HANDLE_SIZE} / -2)`;

const LABEL_OFFSET = "var(--kerned-label-offset, 6px)";

const layerStyle: CSSProperties = {
  position: "absolute",
  left: "calc(var(--kerned-inset, 4px) * -1)",
  right: "calc(var(--kerned-inset, 4px) * -1)",
  color: "var(--kerned-color, currentColor)",
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
  border: "var(--kerned-line-width, 1px) solid currentColor",
  opacity: "var(--kerned-outline-opacity, 0.6)",
};

/** Solid, and the only part of the box at full strength: these are what you would grab. */
const handleStyle: CSSProperties = {
  position: "absolute",
  width: HANDLE_SIZE,
  height: HANDLE_SIZE,
  background: "currentColor",
};
const HANDLE_STYLES: CSSProperties[] = [
  { ...handleStyle, top: HANDLE_OFFSET, left: HANDLE_OFFSET },
  { ...handleStyle, top: HANDLE_OFFSET, right: HANDLE_OFFSET },
  { ...handleStyle, bottom: HANDLE_OFFSET, left: HANDLE_OFFSET },
  { ...handleStyle, bottom: HANDLE_OFFSET, right: HANDLE_OFFSET },
];

const badgeStyle: CSSProperties = {
  position: "absolute",
  boxSizing: "border-box",
  padding: "1px 5px",
  borderRadius: 3,
  background: "var(--kerned-label-background, currentColor)",
  color: "var(--kerned-label-color, light-dark(#fff, #111))",
  fontSize: "var(--kerned-label-font-size, 11px)",
  fontWeight: 500,
  lineHeight: 1.3,
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
  textAlign: "center",
};

/**
 * Centred positions are pinned to the outline's resting centre in px rather
 * than to `50%`. A percentage resolves against the layer, which is as wide as
 * the text currently is, so the label would slide back and forth for the
 * whole pass. The measurement is taken at rest and holds still while the box
 * breathes.
 */
function labelPlacement(
  position: KernedLabelPosition,
  measurement: Measurement | null,
): CSSProperties {
  const vertical: CSSProperties = position.startsWith("top")
    ? { bottom: "100%", marginBottom: LABEL_OFFSET }
    : { top: "100%", marginTop: LABEL_OFFSET };

  if (position.endsWith("-left")) return { ...vertical, left: 0 };
  if (position.endsWith("-right")) return { ...vertical, right: 0 };

  const centre =
    measurement === null ? "50%" : (measurement.width + measurement.inset * 2) / 2;
  return { ...vertical, left: centre, transform: "translateX(-50%)" };
}
