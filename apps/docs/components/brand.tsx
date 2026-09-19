import Link from "next/link";

import { site } from "@/lib/site";

/**
 * The name and what the thing is. It reads as the masthead on the landing
 * page and as the head of the sidebar in the docs, which is the same job in
 * two places, so it is one component rather than two that drift.
 */
export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group block min-w-0 no-underline">
      <span className="text-foreground block text-[17px] font-medium leading-tight tracking-[-0.01em]">
        {site.name}
      </span>
      <span className="text-muted mt-1 block text-pretty text-[13.5px] leading-snug">
        {site.tagline}
      </span>
    </Link>
  );
}
