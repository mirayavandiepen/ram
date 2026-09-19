"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/**
 * Which heading the reader is currently under.
 *
 * Read off the geometry on scroll rather than from an IntersectionObserver:
 * an observer reports what is visible, and several headings are visible at
 * once on a wide screen, which leaves the question of which one counts
 * unanswered. The last heading to have crossed the line near the top of the
 * viewport is a single, stable answer, and the bottom of the page is special
 * cased because a short final section can never cross it.
 */
function useActiveHeading(ids: string[]) {
  const key = ids.join("|");
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const all = key.split("|").filter(Boolean);
    if (all.length === 0) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(all[all.length - 1] ?? "");
        return;
      }
      let current = all[0] ?? "";
      for (const id of all) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= 96) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  return active;
}

export function Toc({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items.map((item) => item.id));
  if (items.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-14 hidden w-[184px] shrink-0 self-start xl:block"
    >
      <p className="text-faint text-[12px] font-medium">On this page</p>
      {/* One rail behind the whole list with the current item's segment
          painted in, rather than a border per item: a single line reads as a
          progress indicator, twelve stacked ones read as a table. */}
      <ul className="border-border mt-3 flex flex-col border-l">
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id} className="-ml-px">
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={`control block border-l py-1.5 pl-3 text-[13px] no-underline ${
                  current
                    ? "border-foreground text-foreground"
                    : "text-muted hover:text-foreground border-transparent"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
