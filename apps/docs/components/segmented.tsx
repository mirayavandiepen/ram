"use client";

import { PRESS } from "./press";

export type Option<T extends string> = { value: T; label?: string };

/**
 * The one segmented control on the site: an inset track with the selected
 * cell raised out of it.
 *
 * Raised rather than filled. A filled cell is the louder of the two and reads
 * fine on its own, but these appear four to a panel on the landing page and
 * twice to a section here, and four dark slabs stacked in a column pull the
 * eye away from the thing they are meant to be adjusting.
 *
 * The track wraps rather than scrolls, because the label positions are six
 * options long and a row that runs off the edge hides the ones at the end.
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
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {label && !hideLabel ? (
        <span className="text-muted w-[72px] shrink-0 text-[13px]">
          {label}
        </span>
      ) : null}
      <div
        role="group"
        aria-label={label}
        className="border-border bg-code-bg flex flex-wrap gap-0.5 rounded-[9px] border p-[3px]"
      >
        {options.map((option) => {
          const item: Option<T> =
            typeof option === "string" ? { value: option } : option;
          const selected = item.value === value;
          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(item.value)}
              className={[
                "h-[26px] rounded-md px-2.5 text-[12.5px] leading-none",
                PRESS,
                selected
                  ? // A hairline and the faintest lift, so the selected cell
                    // reads as sitting on top of the track rather than as
                    // being painted a different colour.
                    "bg-surface text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_var(--border)]"
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
