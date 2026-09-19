import Link from "next/link";

import { Brand } from "@/components/brand";
import { GitHubIcon } from "@/components/logos";
import { PRESS } from "@/components/press";
import { site } from "@/lib/site";

/**
 * The masthead. The name reads first at the leading edge, and the two ways
 * on from this page sit opposite it as pills of one height.
 *
 * Only the two: the theme control lives in the footer, with the other
 * site-wide settings, rather than competing with them up here.
 *
 * The three-dot page menu is not here on purpose: it copies and exports a
 * page's documentation, which this page does not have. It lives beside the
 * title of every documentation page instead.
 */
const PILL = `${PRESS} border-border bg-surface hover:bg-surface-hover text-foreground inline-flex h-8 shrink-0 items-center rounded-full border no-underline`;

export function SiteHeader() {
  return (
    // Wraps rather than squeezes: on a narrow screen the controls drop to a
    // row of their own under the tagline, aligned to the same leading edge as
    // the name, and the tagline keeps its line.
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pt-8 sm:pt-10">
      <Brand />
      <nav aria-label="Site" className="flex items-center gap-2">
        <Link href="/docs" className={`${PILL} px-3.5 text-[13px] font-medium`}>
          Documentation
        </Link>
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className={`${PILL} gap-1.5 px-3.5 text-[13px] font-medium`}
        >
          <GitHubIcon size={14} />
          GitHub
        </a>
      </nav>
    </header>
  );
}
