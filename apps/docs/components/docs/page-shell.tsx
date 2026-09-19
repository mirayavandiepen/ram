import type { ReactNode } from "react";

import { PageMenu } from "@/components/page-menu";

import { Pager } from "./pager";
import { Toc, type TocItem } from "./toc";

/**
 * The frame every documentation page is poured into: title, lede, the page
 * itself, and then where to go next. The contents column is capped at a
 * comfortable measure and the table of contents rides beside it from `xl`,
 * where there is room for a third column without squeezing the first.
 */
export function DocsPage({
  title,
  lede,
  href,
  toc = [],
  children,
}: {
  title: string;
  lede: ReactNode;
  /** This page's own path, which is what the pager locates itself by. */
  href: string;
  toc?: TocItem[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[952px] gap-12 px-6 pb-24 pt-12 sm:px-10 lg:pt-16">
      <article className="min-w-0 max-w-[720px] flex-1">
        <header>
          {/* The menu rides beside the title rather than in the sidebar: it
              acts on this page — copies it, opens it elsewhere — so it
              belongs with the page's own name, and it is reachable at every
              width from here. */}
          <div className="flex items-start justify-between gap-6">
            <h1 className="text-[32px] font-medium leading-tight tracking-[-0.03em] sm:text-[38px]">
              {title}
            </h1>
            <div className="pt-2">
              <PageMenu />
            </div>
          </div>
          {/* A div rather than a paragraph, so a page that needs a second
              sentence of its own can pass two. */}
          <div className="text-muted mt-3 max-w-[62ch] text-pretty text-[16px] leading-[1.6] [&>p+p]:mt-3">
            {lede}
          </div>
        </header>

        <div className="mt-14 flex flex-col gap-16">{children}</div>

        <Pager href={href} />
      </article>

      <Toc items={toc} />
    </div>
  );
}
