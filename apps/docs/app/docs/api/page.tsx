import type { Metadata } from "next";

import { DocsPage } from "@/components/docs/page-shell";
import { Reference } from "@/components/reference";
import { NAV_ITEMS } from "@/lib/nav";
import { PROPS } from "@/lib/reference";
import { site } from "@/lib/site";

const item = NAV_ITEMS.find((entry) => entry.href === "/docs/api")!;

export const metadata: Metadata = {
  title: item.label,
  description: item.summary,
};

export default function Page() {
  return (
    <DocsPage
      title="API"
      href={item.href}
      lede={
        <p>
          Every prop{" "}
          <code className="text-foreground font-mono text-[14px]">
            &lt;{site.name} /&gt;
          </code>{" "}
          takes. Only{" "}
          <code className="text-foreground font-mono text-[14px]">
            children
          </code>{" "}
          is required; everything else has a default that looks like the
          examples throughout these pages.
        </p>
      }
    >
      {/* No section wrapper: the page has one thing on it and the title
          already names it, so a second heading saying "Props" would be the
          same word twice. */}
      <Reference nameLabel="Prop" rows={PROPS} />
    </DocsPage>
  );
}
