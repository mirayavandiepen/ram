import { highlight } from "@/lib/highlight";

import { CodeFrame } from "./code-frame";
import { CopyButton } from "./copy-button";

export function Code({
  children,
  label = "tsx",
}: {
  children: string;
  /** Names the snippet in the bar: a filename where there is one, else the language. */
  label?: string;
}) {
  const source = children.trim();
  return (
    <CodeFrame kind="code" label={label} action={<CopyButton text={source} />}>
      {/* Focusable because it scrolls horizontally on narrow viewports, and a
          pan-only region is unreachable without a pointer. */}
      <pre
        tabIndex={0}
        className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.7]"
      >
        <code>{highlight(source)}</code>
      </pre>
    </CodeFrame>
  );
}
