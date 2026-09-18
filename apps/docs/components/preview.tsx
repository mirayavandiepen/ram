"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

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
  className = "",
}: {
  children: ReactNode;
  resetKey?: string;
  replay?: boolean;
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
      className={`relative flex min-h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-surface px-6 py-10 ${className}`}
    >
      <div key={`${resetKey}:${run}:${seen}`} className="contents">
        {children}
      </div>
      {replay ? (
        <button
          type="button"
          aria-label="Replay"
          onClick={() => setRun((n) => n + 1)}
          className="absolute top-2 right-2 grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8A5 5 0 1 1 8 3h1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 1l2.5 2L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
      className={`${sizes[size]} ${weights[weight]} leading-none tracking-[-0.02em] whitespace-nowrap`}
    >
      {children}
    </p>
  );
}
