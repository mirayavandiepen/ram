import type { ReferenceRow } from "@/lib/reference";

/**
 * The reference tables: props on one page, CSS variables on another, both
 * read the same way.
 *
 * Two things are deliberately absent. The names and defaults are colour and
 * type alone, with no filled chip behind them: a seventeen-row table with two
 * boxes per row is thirty-four small rectangles, and they compete with the
 * sentence that is the thing actually being read. And a prop with no default
 * leaves its cell empty rather than drawing a dash, because a column of
 * placeholders reads as content.
 *
 * The description gets a line of its own across the full width instead of
 * sharing the type's narrow column. A wider measure means far fewer of the
 * two- and three-word orphan lines that make a table tiring to read.
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

  // Source order is name, type, default, description. Placement is explicit
  // because auto-placement would put the type where the default belongs, and
  // because the type only earns a column of its own once there is room.
  const grid = typed
    ? "grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-2 px-4 sm:grid-cols-[112px_minmax(0,1fr)_auto]"
    : "grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-2 px-4";
  const typeCell = typed
    ? "col-span-2 col-start-1 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1"
    : "";
  const defaultCell = typed
    ? "col-start-2 row-start-1 text-right sm:col-start-3"
    : "col-start-2 row-start-1 text-right";
  const descriptionCell = typed
    ? "col-span-2 col-start-1 row-start-3 sm:col-span-3 sm:row-start-2"
    : "col-span-2 col-start-1 row-start-2";

  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <div
        aria-hidden="true"
        className={`${grid} border-border bg-code-bg text-muted h-10 items-center border-b text-[12px]`}
      >
        <span>{nameLabel}</span>
        {typed ? <span className="hidden sm:block">Type</span> : null}
        <span className="text-right">Default</span>
      </div>
      <dl className="divide-border divide-y">
        {rows.map((row) => (
          <div key={row.name} className={`${grid} items-baseline py-4`}>
            <dt className="text-accent font-mono text-[13px]">{row.name}</dt>
            {row.type ? (
              <dd
                className={`${typeCell} text-muted min-w-0 break-words font-mono text-[13px]`}
              >
                {row.type}
              </dd>
            ) : null}
            {/* The column heading is decorative, so the word a screen reader
                needs travels with the value itself. */}
            {row.default ? (
              <dd className={`${defaultCell} font-mono text-[13px]`}>
                <span className="sr-only">Default: </span>
                {row.default}
              </dd>
            ) : null}
            <dd
              className={`${descriptionCell} max-w-[68ch] text-pretty text-[14px] leading-[1.65]`}
            >
              {row.description}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
