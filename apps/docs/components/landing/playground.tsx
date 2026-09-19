"use client";

import { Ram } from "ram";
import { useState } from "react";

import { Code } from "../code";
import { Preview } from "../preview";
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

const DEFAULTS = {
  label: "top" as LabelMode,
  handles: "hollow" as HandleMode,
  motion: "tracking" as Motion,
  color: null as string | null,
};

export function Playground() {
  const [label, setLabel] = useState(DEFAULTS.label);
  const [handles, setHandles] = useState(DEFAULTS.handles);
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
    motion !== DEFAULTS.motion ||
    color !== DEFAULTS.color;

  const reset = () => {
    setLabel(DEFAULTS.label);
    setHandles(DEFAULTS.handles);
    setMotion(DEFAULTS.motion);
    setColor(DEFAULTS.color);
    bump();
  };

  const props = {
    label: label !== "off",
    labelPosition: label === "off" ? "top" : label,
    handles: handles !== "off",
    handleFill: handles === "solid" ? ("solid" as const) : ("hollow" as const),
    animation: motion,
    ...(color ? { color } : {}),
  } as const;

  const attributes = [
    label === "off" ? "label={false}" : null,
    label === "bottom" ? `labelPosition="bottom"` : null,
    handles === "off" ? "handles={false}" : null,
    handles === "solid" ? `handleFill="solid"` : null,
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
        <h1 className="whitespace-nowrap text-center text-[40px] font-medium leading-none tracking-[-0.035em] sm:text-[60px]">
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
              className={`control text-faint hover:text-foreground h-7 rounded-md px-2 text-[12px] ${
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
            <div className="px-3.5 py-2.5">
              <ControlRow label="Colour">
                <div
                  role="group"
                  aria-label="Colour"
                  className="flex items-center gap-1"
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
                        className="control group grid size-7 place-items-center rounded-full active:scale-[0.9] motion-reduce:active:scale-100"
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
