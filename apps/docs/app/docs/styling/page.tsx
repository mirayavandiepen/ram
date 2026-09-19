import type { Metadata } from "next";

import { DocsPage } from "@/components/docs/page-shell";
import { CustomProperties, Typography } from "@/components/sections/styling";
import { NAV_ITEMS } from "@/lib/nav";
import { site } from "@/lib/site";

const item = NAV_ITEMS.find((entry) => entry.href === "/docs/styling")!;

export const metadata: Metadata = {
  title: item.label,
  description: item.summary,
};

export default function Page() {
  return (
    <DocsPage
      title="Styling"
      href={item.href}
      toc={[
        { id: "typography", label: "Typography is inherited" },
        { id: "custom-properties", label: "Custom properties" },
      ]}
      lede={
        <p>
          {site.name} ships no stylesheet. Type comes from whatever it is
          wrapped in, and the frame itself is drawn from a handful of custom
          properties you can override anywhere in the cascade.
        </p>
      }
    >
      <Typography />
      <CustomProperties />
    </DocsPage>
  );
}
