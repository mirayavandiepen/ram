import Link from "next/link";

import { Footer } from "@/components/footer";
import { Install } from "@/components/install";
import { Playground } from "@/components/landing/playground";
import { SiteHeader } from "@/components/landing/site-header";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * Each claim carries a small glyph: a package, a type specimen, and the
 * accessibility figure. Outline strokes at 1.5px, to match the medium weight
 * of the title they sit beside.
 */
const FACTS: {
  title: string;
  icon: React.ReactNode;
  body: React.ReactNode;
}[] = [
  {
    title: "Zero dependencies",
    icon: (
      <>
        <path d="M8 1.5 14 4.75v6.5L8 14.5 2 11.25v-6.5L8 1.5Z" />
        <path d="M2 4.75 8 8m0 0 6-3.25M8 8v6.5" />
      </>
    ),
    body: "One component, no runtime beyond React itself.",
  },
  {
    title: "Inherits your type",
    icon: (
      <>
        <path d="M2.5 4.5V2.5h11v2" />
        <path d="M8 2.5v11M5.5 13.5h5" />
      </>
    ),
    body: "No font size, family or weight of its own. It follows the heading it lands in.",
  },
  {
    title: "Quiet when asked",
    icon: (
      <>
        <circle cx="8" cy="2.75" r="1.25" />
        <path d="M2.5 6c3.7.9 7.3.9 11 0M8 6.5v3.25m0 0L5.75 14M8 9.75 10.25 14" />
      </>
    ),
    body: (
      <>
        <code className="text-foreground font-mono text-[12.5px]">
          prefers-reduced-motion
        </code>{" "}
        drops the tracking pass and keeps the frame.
      </>
    ),
  },
];

/**
 * The page in reading order: see it, try it, install it, know why, read on.
 *
 * Each destination appears once in the chrome and once in the flow, where the
 * decision to go there is actually made. The documentation is a link in the
 * header for a reader who already knows they want it, and a section at the
 * foot for one who has just finished playing with the frame.
 */
export default function Page() {
  return (
    <div className="mx-auto w-full max-w-[640px] px-6">
      <SiteHeader />

      <main>
        <Playground />

        <section className="mt-20">
          <h2 className="text-[17px] font-medium tracking-[-0.01em]">
            Installation
          </h2>
          <div className="mt-4">
            <Install />
          </div>
        </section>

        {/* Three claims, each of which the documentation goes on to make good
            on. Set as a plain list rather than cards: they are sentences, and
            a box around a sentence does not make it more true. */}
        <section
          aria-label="Why Ram"
          className="mt-20 grid gap-8 sm:grid-cols-3 sm:gap-6"
        >
          {FACTS.map((fact) => (
            <div key={fact.title}>
              <h3 className="flex items-center gap-2 text-[14px] font-medium">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="text-muted shrink-0"
                >
                  {fact.icon}
                </svg>
                {fact.title}
              </h3>
              <p className="text-muted mt-1.5 text-pretty text-[13.5px] leading-[1.6]">
                {fact.body}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <h2 className="text-[17px] font-medium tracking-[-0.01em]">
            Documentation
          </h2>
          <p className="text-muted mt-2 max-w-[56ch] text-pretty text-[15px]">
            Every prop, with a live example beside it.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-border bg-surface hover:bg-surface-hover control group block rounded-xl border p-4 no-underline"
              >
                <span className="flex items-center gap-1 text-[14px] font-medium">
                  {item.label}
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    // Nudges on hover. The card is already a link; this only
                    // says which way it goes.
                    className="text-faint ease-out-quart translate-x-0 transition-transform duration-150 group-hover:translate-x-0.5"
                  >
                    <path d="M6 3.5L10.5 8 6 12.5" />
                  </svg>
                </span>
                <span className="text-muted mt-1 block text-pretty text-[13px] leading-[1.6]">
                  {item.summary}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
