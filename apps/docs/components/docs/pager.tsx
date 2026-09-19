import Link from "next/link";

import { navNeighbours } from "@/lib/nav";

import { HIT_AREA, PRESS } from "../press";

/**
 * Where to go next, derived from the navigation order rather than declared
 * per page, so it cannot disagree with the sidebar.
 *
 * A link, not a card. Boxed, these were two bordered rectangles marooned in
 * the white below the last example, and the border drew more of the eye than
 * the page name inside it — the heaviest thing on the page was the way out of
 * it. What the reader needs is the name and which way it lies, so that is all
 * that is drawn: the arrow carries the direction the eyebrow used to spell
 * out, and the rule above the row is the only line left.
 *
 * The two links are placed by their own alignment instead of a
 * `justify-between`, so a page with only a next link still finds it on the
 * right where a reader looks for it.
 */
export function Pager({ href }: { href: string }) {
  const { previous, next } = navNeighbours(href);
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Pagination"
      className="border-border mt-20 flex gap-6 border-t pt-6"
    >
      {previous ? (
        <Link
          href={previous.href}
          rel="prev"
          // Pulled out by its own padding so the name sits on the column's
          // leading edge, level with every paragraph above it, while the
          // target still reaches past the text on all four sides.
          className={`${HIT_AREA} ${PRESS} text-muted hover:text-foreground group -ml-2 mr-auto flex min-w-0 items-center gap-1.5 rounded-lg px-2 py-2.5 no-underline`}
        >
          <Chevron className="group-hover:-translate-x-0.5" />
          {/* The arrow says which way; the word is for a reader who is not
              being shown it. */}
          <span className="sr-only">Previous page: </span>
          <span className="truncate text-[14px] font-medium">
            {previous.label}
          </span>
        </Link>
      ) : null}

      {next ? (
        <Link
          href={next.href}
          rel="next"
          className={`${HIT_AREA} ${PRESS} text-muted hover:text-foreground group -mr-2 ml-auto flex min-w-0 items-center gap-1.5 rounded-lg px-2 py-2.5 no-underline`}
        >
          <span className="sr-only">Next page: </span>
          <span className="truncate text-[14px] font-medium">{next.label}</span>
          <Chevron className="rotate-180 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </nav>
  );
}

/**
 * Points left as drawn, and is turned for the other direction rather than
 * drawn twice. 1.5 against the medium label beside it: a hairline next to
 * text of this weight reads as a smudge.
 */
function Chevron({ className = "" }: { className?: string }) {
  return (
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
      className={`ease-out-quart shrink-0 transition-transform duration-150 ${className}`}
    >
      <path d="M10 3.5L5.5 8l4.5 4.5" />
    </svg>
  );
}
