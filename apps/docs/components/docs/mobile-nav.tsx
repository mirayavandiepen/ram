"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { HIT_AREA, PRESS } from "@/components/press";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

import { NavList } from "./nav-list";

/**
 * The sidebar, below `lg`, as a bar that drops a sheet.
 *
 * The sheet stays mounted and becomes `inert` when closed, which is what buys
 * it an exit as well as an entrance without an animation library: an
 * unmounted element cannot fade, and `inert` keeps everything on its way out
 * of the tab order and out of the accessibility tree.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Navigating is the whole purpose of the sheet, so arriving somewhere is
  // reason enough to close it.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    // The page behind must not scroll under a sheet that covers it.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) panel.current?.querySelector("a")?.focus();
  }, [open]);

  return (
    <div className="lg:hidden">
      <header className="border-border bg-background/85 sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b px-4 backdrop-blur-md">
        {/* Only the name in the bar: the tagline belongs on a line of its
            own, and there is no room for one here. */}
        <Link
          href="/"
          className="text-foreground text-[15px] font-medium tracking-[-0.01em] no-underline"
        >
          {site.name}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={trigger}
            type="button"
            aria-label="Documentation menu"
            aria-expanded={open}
            aria-controls="docs-mobile-nav"
            onClick={() => setOpen((was) => !was)}
            className={`text-muted hover:text-foreground border-border grid size-8 place-items-center rounded-lg border ${HIT_AREA} ${PRESS}`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M4 4l8 8M12 4l-8 8" />
              ) : (
                <path d="M2.5 5h11M2.5 11h11" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-x-0 bottom-0 top-14 z-20 ${
          open ? "" : "pointer-events-none"
        }`}
        inert={!open}
      >
        {/* The scrim is a button so a tap anywhere outside the sheet closes
            it, which is what a pointer expects and what a keyboard gets from
            Escape instead. */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className={`ease-out-quart absolute inset-0 bg-[color-mix(in_oklab,var(--foreground)_12%,transparent)] transition-opacity duration-150 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          id="docs-mobile-nav"
          ref={panel}
          className={`border-border bg-surface ease-out-quart shadow-overlay absolute inset-x-0 top-0 max-h-full overflow-y-auto border-b p-4 transition-[opacity,translate] duration-150 motion-reduce:transition-[opacity] ${
            open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <NavList onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
