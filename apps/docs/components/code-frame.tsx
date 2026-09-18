import type { ReactNode } from "react";

/**
 * The bar across the top of a code block: what the snippet is on the left,
 * what you can do with it on the right.
 *
 * Giving the copy control a row of its own is the whole point. Floated over
 * the code it either sat on the first line or, at these widths, over nothing
 * at all, and it read as a stray glyph rather than part of the block.
 */
export function CodeFrame({
  kind,
  label,
  action,
  children,
}: {
  kind: "code" | "terminal";
  /** Shown at the left of the bar. Omit to leave the bar to the action alone. */
  label?: ReactNode;
  action: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="border-border bg-code-bg overflow-hidden rounded-lg border">
      <div className="border-border flex h-9 items-center justify-between gap-3 border-b pl-3 pr-1.5">
        {typeof label === "string" || label === undefined ? (
          <span className="text-faint flex min-w-0 items-center gap-1.5 font-mono text-[12px]">
            <KindIcon kind={kind} />
            <span className="truncate">{label}</span>
          </span>
        ) : (
          label
        )}
        {action}
      </div>
      {children}
    </div>
  );
}

function KindIcon({ kind }: { kind: "code" | "terminal" }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      // 1.5 against the 12px label: a hairline beside text reads as a smudge.
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {kind === "terminal" ? (
        <>
          <path d="M3 4.5L6 8l-3 3.5" />
          <path d="M8 11.5h5" />
        </>
      ) : (
        <>
          <path d="M5.5 5L2.5 8l3 3" />
          <path d="M10.5 5l3 3-3 3" />
        </>
      )}
    </svg>
  );
}
