"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { ABSOLUTE_HIT_AREA, PRESS } from "./press";

/**
 * A bordered stage for a live example. The children are remounted to replay
 * the frame: on a change of `resetKey`, on the replay button, and once when
 * the stage first scrolls into view. Without that last one every example below
 * the fold would have played and left before the reader ever reached it.
 *
 * Remounting rather than rendering late means the sample text is on the page
 * the whole time and never pops in. React swaps identical markup, so the only
 * thing the remount actually restarts is the frame's own timeline.
 */
export function Preview({
  children,
  resetKey = "",
  replay = true,
  onReplay,
  framed = true,
  className = "",
}: {
  children: ReactNode;
  resetKey?: string;
  replay?: boolean;
  /**
   * Hands the replay back to the owner, for a stage whose example is built
   * from state the stage cannot see. The owner is then responsible for
   * changing `resetKey`; the button stops keeping a count of its own, because
   * two counters for one remount is one too many.
   */
  onReplay?: () => void;
  /**
   * Draws its own border and corners. A stage sharing a surface with the
   * control that drives it has them drawn by that surface instead, and a
   * second border inside the first is the line that makes a panel look
   * assembled rather than made.
   */
  framed?: boolean;
  className?: string;
}) {
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setSeen(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, [seen]);

  return (
    <div
      ref={stageRef}
      className={`bg-surface relative flex min-h-[168px] items-center justify-center overflow-hidden px-6 py-10 ${
        framed ? "border-border rounded-lg border" : ""
      } ${className}`}
    >
      <div key={`${resetKey}:${run}:${seen}`} className="contents">
        {children}
      </div>
      {replay ? (
        <button
          type="button"
          aria-label="Replay"
          // Named as well as labelled: the icon is the only thing on the
          // stage that is not the example, and a reader who hovers it should
          // not have to guess what it does.
          title="Replay"
          onClick={() => (onReplay ? onReplay() : setRun((n) => n + 1))}
          className={`text-faint hover:bg-surface-hover hover:text-foreground absolute right-2 top-2 grid size-7 place-items-center rounded-md ${ABSOLUTE_HIT_AREA} ${PRESS}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M13 8A5 5 0 1 1 8 3h1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M8 1l2.5 2L8 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

/** The sample line every example marks up. */
export function Sample({
  children,
  size = "md",
  weight = "medium",
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "semibold";
}) {
  const sizes = {
    sm: "text-[22px]",
    md: "text-[32px]",
    lg: "text-[40px]",
  };
  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
  };
  return (
    <p
      className={`${sizes[size]} ${weights[weight]} whitespace-nowrap leading-none tracking-[-0.02em]`}
    >
      {children}
    </p>
  );
}
