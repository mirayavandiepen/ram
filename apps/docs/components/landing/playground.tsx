"use client";

import Link from "next/link";
import { Ram } from "ram";
import { useState } from "react";

import { site } from "@/lib/site";

import { Code } from "../code";
import { Preview } from "../preview";
import { PRESS } from "../press";
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
 * drawn in `currentColor`, which is the point of it, so the swatch shows the
 * page's own text colour rather than a colour of its own.
 */
const COLORS = [
  { name: "Text", value: null, swatch: "var(--foreground)" },
  { name: "Blue", value: "#0d99ff", swatch: "#0d99ff" },
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
                        // The halo is the swatch's own colour, so selection
                        // is legible without a second hue entering the page.
                        style={{
                          borderColor: selected ? option.swatch : "transparent",
                        }}
                        className={`control grid size-7 place-items-center rounded-full border active:scale-[0.9] motion-reduce:active:scale-100 ${
                          selected ? "" : "hover:border-border"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          style={{ background: option.swatch }}
                          className="size-[13px] rounded-full"
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

      {/* Below the demo rather than above it: having played with the frame,
          the reader either wants the pages that explain it or the source. */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/docs"
          className={`bg-primary text-primary-foreground hover:bg-primary-hover flex h-9 items-center gap-1 rounded-full px-4 text-[14px] font-medium no-underline ${PRESS}`}
        >
          Documentation
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="opacity-60"
          >
            <path d="M6 3.5L10.5 8 6 12.5" />
          </svg>
        </Link>
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className={`border-border hover:bg-surface-hover flex h-9 items-center gap-1.5 rounded-full border px-4 text-[14px] font-medium no-underline ${PRESS}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </a>
      </div>
    </div>
  );
}
