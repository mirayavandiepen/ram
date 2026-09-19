import { Brand } from "@/components/brand";
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
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
