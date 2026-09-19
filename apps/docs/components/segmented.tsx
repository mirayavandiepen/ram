"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { PRESS } from "./press";

export type Option<T extends string> = { value: T; label?: string };

/**
 * The measurement has to land before the browser paints, or the control is
 * seen for a frame without its selection. On the server there is nothing to
 * measure and React warns about the layout variant, so it falls back there.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** The selected cell's box, in the track's own coordinates. */
type Thumb = { x: number; y: number; width: number; height: number };

/**
 * The one segmented control on the site: an inset track with the selected
 * cell raised out of it.
 *
 * Raised rather than filled. A filled cell is the louder of the two and reads
 * fine on its own, but these appear four to a panel on the landing page and
 * twice to a section here, and four dark slabs stacked in a column pull the
 * eye away from the thing they are meant to be adjusting.
 *
 * The raised cell is a single element that moves between the cells rather
 * than a style each cell paints on itself. Painted per cell, the selection
 * blinks out of one place and into another and the two readings are
 * unconnected; moved, it is one object the eye follows, which is what the
 * control actually means. The cells themselves only change colour.
 *
 * The track wraps rather than scrolls, because the label positions are six
 * options long and a row that runs off the edge hides the ones at the end.
 *
 * Only ever a row among several, each with a label to its left: on the
 * landing page, and in the timing panel on the animation page. The housing is
 * what separates this row's choices from the next row's, and stacked they
 * read as a settings panel.
 *
 * It is deliberately not the control for picking which example to show. A row
 * of cells with one of them lit is a tab bar whatever it is called, and tabs
 * claim the thing below them is another view of one subject. `ExampleBrowser`
 * has that job, and says what it means: a list.
 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  hideLabel = false,
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly (T | Option<T>)[];
  /** Names the row. Read out as the group's name, and shown beside the track. */
  label?: string;
  /**
   * Keeps the name for assistive technology and drops the visible copy of
   * it, for callers that have already labelled the row themselves.
   */
  hideLabel?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cells = useRef(new Map<T, HTMLButtonElement>());
  const [thumb, setThumb] = useState<Thumb | null>(null);

  const measure = useCallback(() => {
    const cell = cells.current.get(value);
    if (!cell) return;
    setThumb({
      x: cell.offsetLeft,
      y: cell.offsetTop,
      width: cell.offsetWidth,
      height: cell.offsetHeight,
    });
  }, [value]);

  /* The thumb is withheld until there is a box for it rather than rendered at
     the origin and moved: an element that has never been styled has nothing
     to transition from, which is how the opening render avoids sliding in
     from the track's left edge. */
  useIsomorphicLayoutEffect(measure, [measure]);

  /* Cell widths move with the font, the theme and the wrap, none of which
     this component is told about. Watching the track covers all three. */
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {label && !hideLabel ? (
        <span className="text-muted w-[72px] shrink-0 text-[13px]">
          {label}
        </span>
      ) : null}
      <div
        ref={trackRef}
        role="group"
        aria-label={label}
        // 6px cell + 3px of padding, so the housing's corner is concentric
        // with the corner of the cell in it.
        className="border-border bg-code-bg relative flex flex-wrap gap-0.5 rounded-[9px] border p-[3px]"
      >
        {thumb ? (
          /* A hairline and the faintest lift, so the selected cell reads as
             sitting on top of the track rather than as being painted a
             different colour.

             It answers a click, so it leaves at once and settles into the new
             cell rather than easing away from the old one. 200ms across a
             gap this short is already at the edge of feeling deliberate.
             Width rides along because the cells are words of different
             lengths, and a pill that jumps to its new width mid-slide reads
             as two objects again. */
          <span
            aria-hidden="true"
            style={{
              transform: `translate3d(${thumb.x}px, ${thumb.y}px, 0)`,
              width: thumb.width,
              height: thumb.height,
            }}
            className="bg-surface ease-out-quart pointer-events-none absolute left-0 top-0 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_var(--border)] transition-[transform,width] duration-200 motion-reduce:transition-none"
          />
        ) : null}
        {options.map((option) => {
          const item: Option<T> =
            typeof option === "string" ? { value: option } : option;
          const selected = item.value === value;
          return (
            <button
              key={item.value}
              ref={(node) => {
                if (node) cells.current.set(item.value, node);
                else cells.current.delete(item.value);
              }}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(item.value)}
              className={[
                // Above the thumb, so the label is never covered by it.
                "relative h-[26px] rounded-md px-2.5 text-[12.5px] leading-none",
                PRESS,
                selected
                  ? "text-foreground"
                  : "text-muted hover:text-foreground",
              ].join(" ")}
            >
              {item.label ?? item.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** A labelled row in the landing page's panel, where the label is not a column. */
export function ControlRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted shrink-0 text-[13px]">{label}</span>
      {children}
    </div>
  );
}
