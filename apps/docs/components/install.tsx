"use client";

import { useState } from "react";

import { site } from "@/lib/site";

import { CopyButton } from "./copy-button";

const MANAGERS = [
  { name: "pnpm", command: `pnpm add ${site.pkg}` },
  { name: "npm", command: `npm install ${site.pkg}` },
  { name: "yarn", command: `yarn add ${site.pkg}` },
  { name: "bun", command: `bun add ${site.pkg}` },
] as const;

export function Install() {
  const [active, setActive] = useState<(typeof MANAGERS)[number]["name"]>("pnpm");
  const current = MANAGERS.find((m) => m.name === active) ?? MANAGERS[0];

  return (
    <div className="rounded-lg border border-border bg-code-bg">
      <div role="tablist" className="flex gap-1 border-b border-border px-2 pt-1.5">
        {MANAGERS.map((manager) => {
          const selected = manager.name === active;
          return (
            <button
              key={manager.name}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActive(manager.name)}
              className={[
                "-mb-px border-b px-2 pb-2 pt-1 text-[13px] transition-colors",
                selected
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted hover:text-foreground",
              ].join(" ")}
            >
              {manager.name}
            </button>
          );
        })}
      </div>
      <div className="relative">
        <pre className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-[1.7]">
          <code>{current.command}</code>
        </pre>
        <CopyButton text={current.command} className="absolute top-2 right-2" />
      </div>
    </div>
  );
}
