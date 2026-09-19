import type { Metadata } from "next";

import { DocsPage } from "@/components/docs/page-shell";
import { InlineCode } from "@/components/inline-code";
import { NAV_ITEMS } from "@/lib/nav";
import { site } from "@/lib/site";

const item = NAV_ITEMS.find((entry) => entry.href === "/docs/accessibility")!;

export const metadata: Metadata = {
  title: item.label,
  description: item.summary,
};

const NOTES = [
  "The outline, handles and label are decorative and hidden from assistive technology.",
  "The wrapped text stays ordinary text: selectable, searchable, and read exactly as written.",
  `${site.name} adds no headings, landmarks or roles, so the semantics of the surrounding markup are unchanged.`,
];

export default function Page() {
  return (
    <DocsPage
      title="Accessibility"
      href={item.href}
      lede={
        <p>
          The frame is decoration around text that has to keep working without
          it. Nothing {site.name} draws reaches the accessibility tree, and
          nothing it animates is required to read the word.
        </p>
      }
    >
      <ul className="text-muted marker:text-faint flex list-disc flex-col gap-2.5 text-pretty pl-5 text-[15px] leading-[1.6]">
        {NOTES.map((note) => (
          <li key={note}>{note}</li>
        ))}
        <li>
          <InlineCode>prefers-reduced-motion</InlineCode> drops the tracking
          pass. The frame still fades in and out, so the measurement is still
          shown; it simply arrives without the letter-spacing sweep.
        </li>
      </ul>
    </DocsPage>
  );
}
