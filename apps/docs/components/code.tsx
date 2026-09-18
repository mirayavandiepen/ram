import { highlight } from "@/lib/highlight";

import { CopyButton } from "./copy-button";

export function Code({ children }: { children: string }) {
  const source = children.trim();
  return (
    <div className="border-border bg-code-bg relative rounded-lg border">
      {/* Focusable because it scrolls horizontally on narrow viewports, and a
          pan-only region is unreachable without a pointer. */}
      <pre
        tabIndex={0}
        className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-[1.7]"
      >
        <code>{highlight(source)}</code>
      </pre>
      <CopyButton text={source} className="absolute right-2 top-2" />
    </div>
  );
}
