import Link from "next/link";

import { Footer } from "@/components/footer";
import { Install } from "@/components/install";
import { Playground } from "@/components/landing/playground";
import { SiteHeader } from "@/components/landing/site-header";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * The page in reading order: see it, try it, install it, read on.
 *
 * Nothing here restates the documentation. The three claims that used to sit
 * between the command and the contents said what the Styling and
 * Accessibility pages already say at length, and a reader who wanted them was
 * one card away.
 *
 * Each destination appears once in the chrome and once in the flow, where the
 * decision to go there is actually made: documentation is a link in the
 * masthead for a reader who already knows they want it, and a section at the
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
