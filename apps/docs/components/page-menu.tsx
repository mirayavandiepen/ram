"use client";

import { useEffect, useRef, useState } from "react";

import { DOCS_MARKDOWN, MARKDOWN_PATH } from "@/lib/markdown";
import { site } from "@/lib/site";

import { HIT_AREA, PRESS } from "./press";

/**
 * What an assistant is asked to do with the link. The absolute URL is
 * deliberate: the model has to fetch the document itself, so a path relative
 * to whatever host is serving this page would be useless to it.
 */
const ASK = `Read ${site.url}${MARKDOWN_PATH} and answer my questions about ${site.name}, a React component for animated design-tool selection frames around text.`;

type Item =
  | { label: string; href: string; external?: boolean }
  | { label: string; onSelect: () => void };

const ITEM =
  "control hover:bg-surface-hover flex h-8 w-full items-center justify-between gap-6 rounded-[7px] px-2.5 text-left text-[13px] no-underline";

export function PageMenu() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const items = (): HTMLElement[] =>
    Array.from(panel.current?.querySelectorAll('[role="menuitem"]') ?? []);

  const close = ({ restoreFocus = false } = {}) => {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  };

  // Pointer down rather than click, so a press that starts outside dismisses
  // before it can activate whatever it landed on.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // The first item takes focus on open however the menu was opened. After a
  // click the browser's own heuristics keep the ring off, so a pointer never
  // sees a focus outline it did not ask for.
  useEffect(() => {
    if (open) items()[0]?.focus();
  }, [open]);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(DOCS_MARKDOWN);
      setCopied(true);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Denied permission, or a page served over plain http. The same
      // markdown is a page of its own, so fall through to it rather than
      // leaving a control that silently does nothing.
      window.open(MARKDOWN_PATH, "_blank", "noopener");
      close({ restoreFocus: true });
    }
  };

  const groups: Item[][] = [
    [
      { label: "GitHub", href: site.github, external: true },
      { label: "X (Twitter)", href: site.x, external: true },
      { label: "npm", href: site.npm, external: true },
    ],
    [
      { label: "Copy Markdown", onSelect: copy },
      { label: "View as Markdown", href: MARKDOWN_PATH, external: true },
    ],
    [
      {
        label: "Open in ChatGPT",
        href: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(ASK)}`,
        external: true,
      },
      {
        label: "Open in Claude",
        href: `https://claude.ai/new?q=${encodeURIComponent(ASK)}`,
        external: true,
      },
    ],
  ];

  /**
   * One handler for the trigger and the menu together, so Escape closes from
   * either and an arrow key opens the menu and walks it with the same key.
   *
   * Which item has focus is read off the document rather than tracked in
   * state: the items are the source of truth about their own order, and a
   * second copy of it would only be a thing to keep in step.
   */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (open && event.key === "Escape") {
      event.preventDefault();
      close({ restoreFocus: true });
      return;
    }
    if (open && event.key === "Tab") {
      close();
      return;
    }

    const all = items();
    const last = all.length - 1;
    const index = all.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === "ArrowDown"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowUp"
          ? index <= 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next === -1) return;
    event.preventDefault();
    // Closed, the items are inert and cannot take focus. Opening does it, in
    // the effect above.
    if (!open) setOpen(true);
    else all[next]?.focus();
  };

  return (
    // Lifted three pixels so the dots centre on the name beside them
    // rather than on the top of its line box.
    <div
      ref={root}
      onKeyDown={onKeyDown}
      className="relative -mt-[3px] shrink-0"
    >
      <button
        ref={trigger}
        type="button"
        aria-label="More"
        title="More"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((was) => !was)}
        className={`text-faint hover:bg-surface-hover grid size-7 place-items-center rounded-md ${HIT_AREA} ${PRESS} ${
          open ? "bg-surface-hover text-foreground" : "hover:text-foreground"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="3.5" cy="8" r="1.3" fill="currentColor" />
          <circle cx="8" cy="8" r="1.3" fill="currentColor" />
          <circle cx="12.5" cy="8" r="1.3" fill="currentColor" />
        </svg>
      </button>

      {/* Mounted in both states and made `inert` when closed, which is what
          buys the menu an exit as well as an entrance without an animation
          library: an unmounted element cannot fade. `inert` takes the whole
          subtree out of the tab order and out of the accessibility tree, so
          nothing on its way out is reachable behind the fade. */}
      <div
        ref={panel}
        role="menu"
        aria-label="More"
        inert={!open}
        className={`border-border bg-surface ease-out-quart shadow-overlay absolute right-0 top-[calc(100%+8px)] z-20 w-[212px] origin-top-right rounded-xl border p-1 transition-[opacity,scale,translate] duration-150 motion-reduce:transition-[opacity] ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.97] opacity-0"
        }`}
      >
        {groups.map((group, index) => (
          <div
            key={index}
            role="group"
            // The rule belongs to the group below it, so the menu does not
            // open with a line directly under the button that spawned it.
            className={index === 0 ? "" : "border-border mt-1 border-t pt-1"}
          >
            {group.map((item) => {
              const shared = { role: "menuitem", tabIndex: -1 } as const;

              return "href" in item ? (
                <a
                  key={item.label}
                  {...shared}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  onClick={() => close()}
                  className={ITEM}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  key={item.label}
                  {...shared}
                  type="button"
                  onClick={item.onSelect}
                  className={ITEM}
                >
                  <span>{item.label}</span>
                  {/* The check is the whole acknowledgement. Renaming the
                      control to "Copied" would say it too, but a control that
                      changes its own name is not a reliable announcement; the
                      status region below is. */}
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`ease-out-quart shrink-0 transition-opacity duration-150 ${
                      copied ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <path d="M3 8.5l3 3 7-7" />
                  </svg>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Markdown copied to clipboard" : ""}
      </span>
    </div>
  );
}
