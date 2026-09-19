import Link from "next/link";

import { Footer } from "@/components/footer";
import { Brand } from "@/components/brand";
import { Install } from "@/components/install";
import { PageMenu } from "@/components/page-menu";
import { Playground } from "@/components/landing/playground";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_ITEMS } from "@/lib/nav";
import { site } from "@/lib/site";

const FACTS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Zero dependencies",
    body: "One component, no runtime beyond React itself.",
  },
  {
    title: "Inherits your type",
    body: "No font size, family or weight of its own. It follows the heading it lands in.",
  },
  {
    title: "Quiet when asked",
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

export default function Page() {
  return (
    <>
      <div className="fixed right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <main className="mx-auto w-full max-w-[640px] px-6">
        <header className="flex items-start justify-between gap-6 pt-20 sm:pt-24">
          <Brand />
          <PageMenu />
        </header>

        <Playground />

        <section className="mt-24">
          <h2 className="text-[17px] font-medium tracking-[-0.01em]">
            Installation
          </h2>
          <p className="text-muted mt-2 max-w-[56ch] text-pretty text-[15px]">
            {site.name} ships as ESM and CJS, typed, with React 18 and 19 as
            peer dependencies.
          </p>
          <div className="mt-5">
            <Install />
          </div>
        </section>

        {/* Three claims, each of which the documentation goes on to make good
            on. Set as a plain list rather than cards: they are sentences, and
            a box around a sentence does not make it more true. */}
        <section className="border-border mt-20 grid gap-8 border-t pt-10 sm:grid-cols-3 sm:gap-6">
          {FACTS.map((fact) => (
            <div key={fact.title}>
              <h3 className="text-[14px] font-medium">{fact.title}</h3>
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

        <Footer />
      </main>
    </>
  );
}
