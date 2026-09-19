"use client";

import { type ReactNode, useId } from "react";

import type { Option } from "./segmented";
import { Preview } from "./preview";

/**
 * An example and the list of examples, on one surface.
 *
 * The switcher used to be a row of cells above the stage, and a row of cells
 * with one of them lit is a tab bar whatever it is called. Tabs carry a claim
 * this page cannot honour: that the thing below them is a different view of
 * the same subject. These are not views, they are settings — seven ways to
 * draw one frame — and they want a list, which is the shape a set of settings
 * has everywhere else.
 *
 * So the options stand in a column beside the frame rather than in a bar
 * above it. All of them are visible at once, none of them is a toolbar, and
 * the frame redraws an inch from the pointer that asked, which is the whole
 * reason to click down a list like this.
 *
 * Native radios, not buttons wearing radio roles. Arrow keys, the group's
 * single tab stop, and the announcement a screen reader makes on entering it
 * all come with the element; every one of them is a thing to get wrong by
 * hand, and none of them is what this page is about.
 *
 * The input is the only radio here, though — nothing draws a dot. A ring and
 * a bead beside every line is a lot of furniture for seven short words, and
 * it repeats in ink what the row already says by being filled in. The
 * sidebar three inches to the left marks the page you are on with a filled
 * row and no mark at all, so that is what a chosen row looks like here too:
 * same fill, same weight, same corner.
 */
export function ExampleBrowser<T extends string>({
  value,
  onChange,
  options,
  label,
  children,
  resetKey,
  replay = true,
  onReplay,
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly (T | Option<T>)[];
  /** Names the group. Read out on entering it, and never shown. */
  label: string;
  children: ReactNode;
  resetKey?: string;
  replay?: boolean;
  onReplay?: () => void;
}) {
  // Radios group by name, so two browsers on one page must not share one.
  const name = useId();

  return (
    <div className="border-border bg-surface overflow-hidden rounded-lg border sm:flex sm:items-stretch">
      {/* Below `sm` the list sits above the stage and the divider turns with
          it. A column of this width beside a stage leaves neither enough.

          Centred, because the column is as tall as whichever side is taller.
          A long list sets that height and centring changes nothing; a short
          one does not, and left at the top it leaves the leftover in a heap
          under the last row — three options put 8px above them and 48px
          below. The stage centres what it holds, so the list does too, and
          the two sides settle on the same middle. */}
      <div
        role="radiogroup"
        aria-label={label}
        className="border-border flex flex-col justify-center gap-0.5 border-b p-2 sm:w-[152px] sm:shrink-0 sm:border-b-0 sm:border-r"
      >
        {options.map((option) => {
          const item: Option<T> =
            typeof option === "string" ? { value: option } : option;
          const selected = item.value === value;
          return (
            <label
              key={item.value}
              className={`ease-out-quart flex h-8 cursor-pointer items-center rounded-[7px] px-2.5 text-[13px] transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-1px] has-[:focus-visible]:outline-[var(--foreground)] ${
                selected
                  ? // Weight as well as fill: hover lands on the same grey,
                    // and without it the row under the pointer and the row
                    // actually chosen are the same picture.
                    "bg-surface-hover text-foreground font-medium"
                  : "text-muted hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              {/* The input carries every behaviour and none of the paint. It
                  keeps its size and position so the focus ring it raises on
                  the row lands on the row, rather than at the page corner. */}
              <input
                type="radio"
                name={name}
                value={item.value}
                checked={selected}
                onChange={() => onChange(item.value)}
                className="absolute size-0 appearance-none opacity-0"
              />
              <span className="truncate">{item.label ?? item.value}</span>
            </label>
          );
        })}
      </div>

      <Preview
        framed={false}
        className="min-w-0 flex-1"
        resetKey={resetKey}
        replay={replay}
        onReplay={onReplay}
      >
        {children}
      </Preview>
    </div>
  );
}

export function SettingsBrowser({
  controls,
  children,
  resetKey,
  replay = true,
  onReplay,
}: {
  /** The rows, each one a `ControlRow` wrapped by `SettingRow` below. */
  controls: ReactNode;
  children: ReactNode;
  resetKey?: string;
  replay?: boolean;
  onReplay?: () => void;
}) {
  return (
    <div className="border-border bg-surface overflow-hidden rounded-lg border">
      <div className="divide-border border-border divide-y border-b">
        {controls}
      </div>
      <Preview
        framed={false}
        resetKey={resetKey}
        replay={replay}
        onReplay={onReplay}
      >
        {children}
      </Preview>
    </div>
  );
}

/** One setting on its own row, at the panel's own padding. */
export function SettingRow({ children }: { children: ReactNode }) {
  return <div className="px-3.5 py-2.5">{children}</div>;
}
