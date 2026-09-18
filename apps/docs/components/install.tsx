"use client";

import { useRef, useState } from "react";

import { site } from "@/lib/site";

import { CopyButton } from "./copy-button";
import { PRESS } from "./press";

const MANAGERS = [
  { name: "pnpm", command: `pnpm add ${site.pkg}` },
  { name: "npm", command: `npm install ${site.pkg}` },
  { name: "yarn", command: `yarn add ${site.pkg}` },
  { name: "bun", command: `bun add ${site.pkg}` },
] as const;

type Manager = (typeof MANAGERS)[number]["name"];

export function Install() {
  const [active, setActive] = useState<Manager>("pnpm");
  const current = MANAGERS.find((m) => m.name === active) ?? MANAGERS[0];
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  /**
   * Tabs move under the arrow keys, not Tab: within the set only the selected
   * tab is in the tab order, so Tab steps past the whole group to the panel.
   * Without this the roles announce a tab list that does not behave like one.
   */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = MANAGERS.findIndex((m) => m.name === active);
    const last = MANAGERS.length - 1;
    const next =
      event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next === -1) return;
    event.preventDefault();
    const manager = MANAGERS[next];
    if (!manager) return;
    setActive(manager.name);
    tabs.current[next]?.focus();
  };

  return (
    <div className="border-border bg-code-bg rounded-lg border">
      <div
        role="tablist"
        aria-label="Package manager"
        onKeyDown={onKeyDown}
        className="border-border flex gap-1 border-b px-2 pt-1.5"
      >
        {MANAGERS.map((manager, index) => {
          const selected = manager.name === active;
          return (
            <button
              key={manager.name}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              role="tab"
              type="button"
              id={`install-tab-${manager.name}`}
              aria-controls="install-panel"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(manager.name)}
              className={[
                "-mb-px border-b px-2 pb-2 pt-1 text-[13px]",
                PRESS,
                selected
                  ? "border-foreground text-foreground"
                  : "text-muted hover:text-foreground border-transparent",
              ].join(" ")}
            >
              {manager.name}
            </button>
          );
        })}
      </div>
      <div className="relative">
        {/* Focusable because it scrolls: a region a pointer can pan but a
 keyboard cannot reach is content behind a wall. */}
        <pre
          id="install-panel"
          role="tabpanel"
          aria-labelledby={`install-tab-${active}`}
          tabIndex={0}
          className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-[1.7]"
        >
          <code>{current.command}</code>
        </pre>
        <CopyButton text={current.command} className="absolute right-2 top-2" />
      </div>
    </div>
  );
}
