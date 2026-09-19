"use client";

import { Ram } from "@mirayavandiepen/ram";
import { useState } from "react";

import { Code } from "../code";
import { Preview } from "../preview";
import { HIT_AREA, PRESS } from "../press";
import { ControlRow, Segmented } from "../segmented";

const LABELS = [
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "off", label: "Off" },
] as const;

const HANDLES = [
  { value: "hollow", label: "Hollow" },
  { value: "solid", label: "Solid" },
  { value: "off", label: "Off" },
] as const;

/** Thickness of the outline only. A handle ring stays hairline at every step,
 * the way a design tool draws one. */
const WIDTHS = [
  { value: "1", label: "1px" },
  { value: "2", label: "2px" },
  { value: "3", label: "3px" },
] as const;

const MOTIONS = [
  { value: "tracking", label: "Tracking" },
  { value: "static", label: "Static" },
] as const;

/**
 * The first swatch is the default and has no value: left alone the frame is
 * drawn in the component's own selection blue. "Text" hands it `currentColor`
 * instead, so the swatch shows the page's text colour rather than one of its
 * own.
 */
const COLORS = [
  { name: "Blue", value: null, swatch: "#0d99ff" },
  { name: "Text", value: "currentColor", swatch: "var(--foreground)" },
  { name: "Violet", value: "#7c3aed", swatch: "#7c3aed" },
  { name: "Pink", value: "#e5308c", swatch: "#e5308c" },
] as const;

type LabelMode = (typeof LABELS)[number]["value"];
type HandleMode = (typeof HANDLES)[number]["value"];
type Motion = (typeof MOTIONS)[number]["value"];
type Width = (typeof WIDTHS)[number]["value"];

const DEFAULTS = {
  label: "top" as LabelMode,
  handles: "hollow" as HandleMode,
  width: "1" as Width,
  motion: "tracking" as Motion,
  color: null as string | null,
};

export function Playground() {
  const [label, setLabel] = useState(DEFAULTS.label);
  const [handles, setHandles] = useState(DEFAULTS.handles);
  const [width, setWidth] = useState(DEFAULTS.width);
  const [motion, setMotion] = useState(DEFAULTS.motion);
  const [color, setColor] = useState(DEFAULTS.color);

  /**
   * Counts interactions rather than tracking them. It restarts the frame on
   * every change, and it is also what tells the opening render from the rest:
   * the first frame waits for the page to settle, every later one answers the
   * control that asked for it.
   */
  const [runs, setRuns] = useState(0);
  const bump = () => setRuns((n) => n + 1);

  const dirty =
    label !== DEFAULTS.label ||
    handles !== DEFAULTS.handles ||
    width !== DEFAULTS.width ||
    motion !== DEFAULTS.motion ||
    color !== DEFAULTS.color;

  const reset = () => {
    setLabel(DEFAULTS.label);
    setHandles(DEFAULTS.handles);
    setWidth(DEFAULTS.width);
    setMotion(DEFAULTS.motion);
    setColor(DEFAULTS.color);
    bump();
  };

  const props = {
    label: label !== "off",
    labelPosition: label === "off" ? "top" : label,
    handles: handles !== "off",
    handleFill: handles === "solid" ? ("solid" as const) : ("hollow" as const),
    lineWidth: Number(width),
    animation: motion,
    ...(color ? { color } : {}),
  } as const;

  const attributes = [
    label === "off" ? "label={false}" : null,
    label === "bottom" ? `labelPosition="bottom"` : null,
    handles === "off" ? "handles={false}" : null,
    handles === "solid" ? `handleFill="solid"` : null,
    width !== DEFAULTS.width ? `lineWidth={${width}}` : null,
    motion === "static" ? `animation="static"` : null,
    color ? `color="${color}"` : null,
  ].filter(Boolean) as string[];

  const code =
    attributes.length === 0
      ? `<Ram>delight</Ram>`
      : attributes.length === 1
        ? `<Ram ${attributes[0]}>delight</Ram>`
        : `<Ram\n${attributes.map((a) => `  ${a}`).join("\n")}\n>\n  delight\n</Ram>`;

  return (
    <div>
      {/* The specimen sits on the same bordered stage every example in the
          documentation uses, with the same replay in the same corner. It is
          the page's one standing frame, and persistent because a frame that
          measures the word and then leaves takes the thing the reader came
          to look at with it. */}
      <Preview
        className="mt-16 min-h-[220px] sm:min-h-[280px]"
        resetKey={`${JSON.stringify(props)}:${runs}`}
        onReplay={bump}
      >
        {/* Set in steps rather than left to wrap: the line is the specimen,
              so it has to stay one line. At 40px it measures 257px and the
              stage has 224px to give at 320px wide, and `overflow-hidden`
              takes the difference off the right-hand handles. */}
        <h1 className="whitespace-nowrap text-center text-[32px] font-medium leading-none tracking-[-0.035em] min-[380px]:text-[40px] sm:text-[60px]">
          built to{" "}
          <Ram delay={runs === 0 ? 700 : 150} persistent {...props}>
            delight
          </Ram>
        </h1>
      </Preview>

      <div className="mt-3 flex flex-col gap-3">
        <div className="border-border bg-surface overflow-hidden rounded-xl border">
          <div className="border-border flex h-10 items-center justify-between border-b pl-3.5 pr-2">
            <span className="text-faint text-[12px] font-medium tracking-[0.01em]">
              Customize
            </span>
            {/* Present only once there is something to undo. Mounted either
                way so its appearance does not shift the row beside it. */}
            <button
              type="button"
              onClick={reset}
              tabIndex={dirty ? 0 : -1}
              aria-hidden={!dirty}
              className={`${HIT_AREA} ${PRESS} text-faint hover:text-foreground h-7 rounded-md px-2 text-[12px] ${
                dirty ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              Reset
            </button>
          </div>

          <div className="flex flex-col divide-y divide-[var(--border)]">
            <div className="px-3.5 py-2.5">
              <ControlRow label="Label">
                <Segmented
                  hideLabel
                  label="Label"
                  value={label}
                  onChange={(next) => {
                    setLabel(next);
                    bump();
                  }}
                  options={LABELS}
                />
              </ControlRow>
            </div>
            <div className="px-3.5 py-2.5">
              <ControlRow label="Handles">
                <Segmented
                  hideLabel
                  label="Handles"
                  value={handles}
                  onChange={(next) => {
                    setHandles(next);
                    bump();
                  }}
                  options={HANDLES}
                />
              </ControlRow>
            </div>
            <div className="px-3.5 py-2.5">
              <ControlRow label="Thickness">
                <Segmented
                  hideLabel
                  label="Thickness"
                  value={width}
                  onChange={(next) => {
                    setWidth(next);
                    bump();
                  }}
                  options={WIDTHS}
                />
              </ControlRow>
            </div>
            <div className="px-3.5 py-2.5">
              <ControlRow label="Motion">
                <Segmented
                  hideLabel
                  label="Motion"
                  value={motion}
                  onChange={(next) => {
                    setMotion(next);
                    bump();
                  }}
                  options={MOTIONS}
                />
              </ControlRow>
            </div>
            {/* Less vertical padding than its neighbours, so the row still
                measures the same: a 40px target around the dots is taller
                than a segmented track, and the panel reads as an even stack
                only if the difference comes back out of the padding. */}
            <div className="px-3.5 py-2">
              <ControlRow label="Colour">
                <div
                  role="group"
                  aria-label="Colour"
                  // Butted together rather than spaced: each target is a
                  // 40px square around a 14px dot, and a gap would push the
                  // row wider than the narrowest panel can hold.
                  // Pulled right by the 13px of padding between the last
                  // dot and the edge of its target, so the swatches end on
                  // the same line as the segmented tracks above them rather
                  // than stopping short of it.
                  className="-mr-[13px] flex items-center"
                >
                  {COLORS.map((option) => {
                    const selected = option.value === color;
                    return (
                      <button
                        key={option.name}
                        type="button"
                        aria-pressed={selected}
                        aria-label={option.name}
                        title={option.name}
                        onClick={() => {
                          setColor(option.value);
                          bump();
                        }}
                        className={`${PRESS} group grid size-10 place-items-center rounded-full`}
                      >
                        {/* The ring is the swatch's own colour, drawn a hair
                            off the dot the way a design tool marks the
                            active swatch: a 2px breath of page, then a
                            1px line. Hover shows the same ring in the
                            hairline grey. */}
                        <span
                          aria-hidden="true"
                          style={{
                            background: option.swatch,
                            boxShadow: selected
                              ? `0 0 0 2px var(--background), 0 0 0 3px ${option.swatch}`
                              : undefined,
                          }}
                          className={`ease-out-quart size-3.5 rounded-full transition-[box-shadow] duration-150 ${
                            selected
                              ? ""
                              : "group-hover:shadow-[0_0_0_2px_var(--background),0_0_0_3px_var(--border-strong)]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </ControlRow>
            </div>
          </div>
        </div>

        <Code label="tsx">{code}</Code>
      </div>
    </div>
  );
}
