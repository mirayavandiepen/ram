import { Brand } from "@/components/brand";
import { GitHubIcon } from "@/components/logos";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

import { NavList } from "./nav-list";

/**
 * Pinned for the height of the viewport and scrolling on its own, so a long
 * page never carries the navigation off the screen with it. Hidden below
 * `lg`, where `MobileNav` takes over.
 */
export function Sidebar() {
  return (
    <aside className="border-border sticky top-0 hidden h-svh w-[248px] shrink-0 flex-col border-r lg:flex">
      <div className="px-5 pb-6 pt-7">
        <Brand />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
        <NavList />
      </div>

      <div className="border-border flex items-center justify-between border-t px-4 py-3">
        <ThemeToggle />
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          title="GitHub"
          className="control text-faint hover:text-foreground hover:bg-surface-hover grid size-7 place-items-center rounded-full"
        >
          <GitHubIcon />
        </a>
      </div>
    </aside>
  );
}
