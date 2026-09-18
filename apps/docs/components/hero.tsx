"use client";

import { Ram } from "ram";
import { useState } from "react";

import { site } from "@/lib/site";

import { PRESS } from "./press";

export function Hero() {
  const [run, setRun] = useState(0);

  return (
    <header className="flex flex-col items-center pb-28 pt-40 text-center sm:pt-48">
      <h1 className="whitespace-nowrap text-[44px] font-medium leading-none tracking-[-0.035em] sm:text-[64px]">
        built to{" "}
        <Ram key={run} delay={run === 0 ? 700 : 150}>
          delight
        </Ram>
      </h1>

      <p className="mt-16 text-[17px] font-medium tracking-[-0.01em]">
        {site.name}
      </p>
      <p className="text-muted mt-1 text-[15px]">{site.tagline}</p>

      <div className="mt-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className={`bg-primary text-primary-foreground hover:bg-primary-hover h-9 rounded-full px-4 text-[14px] font-medium ${PRESS}`}
        >
          Render
        </button>
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className={`border-border hover:bg-surface-hover flex h-9 items-center gap-1.5 rounded-full border px-4 text-[14px] font-medium ${PRESS}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </a>
      </div>

      {/* Part of the same cluster as the two buttons rather than a stranded
          third thing, and underlined so it reads as the link it is beside two
          controls that are not. Thickness and position come from the font's
          own metrics, so the rule sits where the typeface intends it. */}
      <a
        href="#installation"
        className="text-muted decoration-faint ease-out-quart hover:text-foreground hover:decoration-foreground mt-5 text-[13px] underline decoration-from-font underline-offset-[3px] transition-colors duration-150"
      >
        Documentation
      </a>
    </header>
  );
}
