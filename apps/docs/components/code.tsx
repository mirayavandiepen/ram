import { highlight } from "@/lib/highlight";

import { CopyButton } from "./copy-button";

export function Code({ children }: { children: string }) {
  const source = children.trim();
  return (
    <div className="relative rounded-lg border border-border bg-code-bg">
      <pre className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-[1.7]">
        <code>{highlight(source)}</code>
      </pre>
      <CopyButton text={source} className="absolute top-2 right-2" />
    </div>
  );
}
