"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type TocItem = { id: string; label: string };

/**
 * The line near the top of the viewport a heading has to cross to count as
 * read past. It matches the `scroll-mt-24` every section carries, with a
 * pixel of tolerance, so a heading the reader has just jumped to lands
 * exactly on the line instead of a hair above or below it.
 */
const FOLD = 97;

/**
 * Which heading the reader is currently under.
 *
 * Read off the geometry on scroll rather than from an IntersectionObserver:
 * an observer reports what is visible, and several headings are visible at
 * once on a wide screen, which leaves the question of which one counts
 * unanswered. The last heading to have crossed the line near the top of the
 * viewport is a single, stable answer.
 *
 * Two things complicate that. The end of the page cannot be scrolled past,
 * so a short final section would never cross the line; there the answer is
 * the last heading above the middle of the screen, which reaches the final
 * section without stealing the highlight from one that still fills the
 * viewport. And a click is an explicit answer of its own: while the page is
 * travelling to a heading the reader named, geometry is ignored, until the
 * reader scrolls again and takes the question back.
 */
function useActiveHeading(ids: string[]) {
  const key = ids.join("|");
  const [active, setActive] = useState(ids[0] ?? "");
  const lockedRef = useRef(false);

  useEffect(() => {
    const all = key.split("|").filter(Boolean);
    if (all.length === 0) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      if (lockedRef.current) return;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      const line = atBottom ? window.innerHeight / 2 : FOLD;

      let current = all[0] ?? "";
      for (const id of all) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    /* Any scroll the reader starts themselves hands the question back to
       geometry. A smooth scroll from a click fires `scroll` but none of
       these, which is what keeps the clicked item lit on the way there. */
    const release = () => {
      lockedRef.current = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        /^(Arrow|Page)/.test(event.key) ||
        event.key === " " ||
        event.key === "Home" ||
        event.key === "End"
      )
        release();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [key]);

  /** Honour a clicked link until the reader scrolls of their own accord. */
  const lockTo = useCallback((id: string) => {
    lockedRef.current = true;
    setActive(id);
  }, []);

  return [active, lockTo] as const;
}

/**
 * Where the lit segment of the rail sits, in pixels down the list. Measured
 * from the items themselves rather than assumed from a row height, so a
 * label that wraps to two lines is still marked exactly.
 */
function useMarker(active: string, count: number) {
  const listRef = useRef<HTMLUListElement>(null);
  const [marker, setMarker] = useState<{ top: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const item = list.querySelector<HTMLElement>(
        `[data-id="${CSS.escape(active)}"]`,
      );
      if (!item) return;
      setMarker({ top: item.offsetTop, height: item.offsetHeight });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active, count]);

  return [listRef, marker] as const;
}

export function Toc({ items }: { items: TocItem[] }) {
  const [active, lockTo] = useActiveHeading(items.map((item) => item.id));
  const [listRef, marker] = useMarker(active, items.length);
  /* The marker is placed before it is shown, so the first paint does not
     look like it slid in from the top of the list: it appears where it
     belongs, and only then starts travelling. */
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!marker || settled) return;
    const frame = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(frame);
  }, [marker, settled]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-14 hidden w-[184px] shrink-0 self-start xl:block"
    >
      <p className="text-faint text-[12px] font-medium">On this page</p>
      {/* One rail behind the whole list with the current item's segment
          painted in, rather than a border per item: a single line reads as a
          progress indicator, twelve stacked ones read as a table. The lit
          segment is one element that travels, so moving between items is a
          slide down the rail rather than one line blinking out and another
          blinking on. */}
      <div className="relative mt-3">
        <div aria-hidden className="bg-border absolute inset-y-0 left-0 w-px" />
        {marker ? (
          <div
            aria-hidden
            className="bg-foreground absolute left-0 top-0 w-px motion-reduce:transition-none"
            style={{
              transform: `translateY(${marker.top}px)`,
              height: marker.height,
              opacity: settled ? 1 : 0,
              transitionProperty: "transform, height, opacity",
              transitionDuration: settled ? "260ms" : "0ms",
              transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
            }}
          />
        ) : null}
        <ul ref={listRef} className="flex flex-col">
          {items.map((item) => {
            const current = item.id === active;
            return (
              <li key={item.id} data-id={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => lockTo(item.id)}
                  aria-current={current ? "location" : undefined}
                  className={`control block py-1.5 pl-3 text-[13px] no-underline transition-colors duration-150 ${
                    current
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
