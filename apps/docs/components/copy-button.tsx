"use client";

import { useEffect, useRef, useState } from "react";

import { HIT_AREA, PRESS } from "./press";

/**
 * Both icons stay mounted and cross-fade. Swapping one for the other would
 * pop, and with no animation library on the page a transition on two stacked
 * layers is the whole implementation.
 */
const ICON_TRANSITION =
  "absolute transition-[opacity,transform,filter] duration-200 ease-out-quart motion-reduce:transition-[opacity] motion-reduce:duration-150";

export function CopyButton({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setFailed(false);
      setCopied(true);
    } catch {
      // Denied permission, or a page served over plain http. Saying so beats
      // a button that silently does nothing.
      setCopied(false);
      setFailed(true);
    }
    timer.current = window.setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        // A fixed name, because renaming a control is not a reliable way to
        // announce that something happened. The status region below is.
        aria-label="Copy to clipboard"
        className={`text-faint hover:bg-surface-hover hover:text-foreground relative grid size-7 shrink-0 place-items-center rounded-md ${HIT_AREA} ${PRESS} ${className}`}
      >
        <span className="relative grid size-[14px] place-items-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={`${ICON_TRANSITION} ${
              copied
                ? "scale-100 opacity-100 blur-0"
                : "scale-[0.25] opacity-0 blur-[4px]"
            }`}
          >
            <path
              d="M3 8.5l3 3 7-7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={`${ICON_TRANSITION} ${
              copied
                ? "scale-[0.25] opacity-0 blur-[4px]"
                : "scale-100 opacity-100 blur-0"
            }`}
          >
            <rect
              x="5.5"
              y="5.5"
              width="8"
              height="8"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <path
              d="M10.5 5.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5"
              stroke="currentColor"
              strokeWidth="1.25"
            />
          </svg>
        </span>
      </button>
      {/* Rendered empty and updated in place, which is the shape a polite
 region has to have to announce reliably more than once. */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied
          ? "Copied to clipboard"
          : failed
            ? "Unable to copy. Select the command and copy it manually."
            : ""}
      </span>
    </>
  );
}
