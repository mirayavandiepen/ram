import Link from "next/link";

import { navNeighbours } from "@/lib/nav";

/**
 * Where to go next, derived from the navigation order rather than declared
 * per page, so it cannot disagree with the sidebar.
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
      className="border-border mt-20 flex gap-3 border-t pt-8"
    >
      {previous ? (
        <Link
          href={previous.href}
          rel="prev"
          className="border-border bg-surface hover:bg-surface-hover control group mr-auto flex min-w-0 flex-col items-start rounded-xl border px-4 py-3 no-underline"
        >
          <span className="text-faint text-[12px]">Previous</span>
          <span className="mt-0.5 truncate text-[14px] font-medium">
            {previous.label}
          </span>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={next.href}
          rel="next"
          className="border-border bg-surface hover:bg-surface-hover control group ml-auto flex min-w-0 flex-col items-end rounded-xl border px-4 py-3 text-right no-underline"
        >
          <span className="text-faint text-[12px]">Next</span>
          <span className="mt-0.5 truncate text-[14px] font-medium">
            {next.label}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
