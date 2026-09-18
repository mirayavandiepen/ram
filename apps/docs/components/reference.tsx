import type { ReactNode } from "react";

export type ReferenceRow = {
  name: string;
  /** Omit on every row to drop the type column entirely. */
  type?: string;
  /** The value used when the prop is left out. Omit when there is none. */
  default?: string;
  description: ReactNode;
};

/**
 * The reference tables: props on one page, CSS variables on another, both
 * read the same way.
 *
 * The defaults live in a column of their own rather than trailing each
 * sentence. Seventeen descriptions all ending in "Defaults to x" buries the
 * one thing the reader is usually scanning for, and the answer is a value,
 * not prose.
 *
 * Below `sm` there is no room for three columns, so the type and the
 * description drop to a second row underneath and the name keeps the default
 * beside it. The grid placement is explicit for exactly that reason: source
 * order is name, type, default, and auto-placement would put the type where
 * the default belongs.
 */
export function Reference({
  nameLabel,
  rows,
}: {
  /** Names the first column: what these entries are. */
  nameLabel: string;
  rows: ReferenceRow[];
}) {
  const typed = rows.some((row) => row.type);
  const grid = typed
    ? "grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 px-3.5 sm:grid-cols-[116px_minmax(0,1fr)_auto] sm:gap-x-5"
    : "grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 px-3.5";
  // Without a type column there is no third track to move the body into, so
  // it stays on its own row at every width.
  const body = typed
    ? "col-span-2 col-start-1 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1"
    : "col-span-2 col-start-1 row-start-2";

  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <div
        aria-hidden="true"
        className={`${grid} border-border bg-code-bg text-muted h-9 items-center border-b text-[12px] font-medium`}
      >
        <span>{nameLabel}</span>
        {typed ? <span className="hidden sm:block">Type</span> : null}
        <span className="text-right">Default</span>
      </div>
      <dl className="divide-border divide-y">
        {rows.map((row) => (
          <div key={row.name} className={`${grid} items-start py-3`}>
            <dt>
              <code className="bg-accent-soft text-accent inline-block rounded px-1.5 py-0.5 font-mono text-[12.5px] leading-5">
                {row.name}
              </code>
            </dt>
            <dd className={`${body} min-w-0`}>
              {row.type ? (
                <code className="text-muted block break-words py-0.5 font-mono text-[12.5px] leading-5">
                  {row.type}
                </code>
              ) : null}
              <p
                className={`text-pretty text-[13.5px] leading-[1.55] ${
                  row.type ? "mt-1" : "mt-1.5"
                }`}
              >
                {row.description}
              </p>
            </dd>
            <dd
              className={`col-start-2 row-start-1 text-right ${
                typed ? "sm:col-start-3" : ""
              }`}
            >
              {/* The column heading is decorative, so the word a screen
                  reader needs travels with the value itself. */}
              {row.default ? (
                <code className="bg-surface-hover text-foreground inline-block rounded px-1.5 py-0.5 font-mono text-[12.5px] leading-5">
                  <span className="sr-only">Default: </span>
                  {row.default}
                </code>
              ) : (
                <span className="text-faint inline-block py-0.5 text-[12.5px] leading-5">
                  <span className="sr-only">No default</span>
                  <span aria-hidden="true">&mdash;</span>
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
