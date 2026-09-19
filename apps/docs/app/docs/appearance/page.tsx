import type { Metadata } from "next";

import { DocsPage } from "@/components/docs/page-shell";
import { Appearance } from "@/components/sections/appearance";
import { Label } from "@/components/sections/label";
import { Position } from "@/components/sections/position";
import { NAV_ITEMS } from "@/lib/nav";

const item = NAV_ITEMS.find((entry) => entry.href === "/docs/appearance")!;

export const metadata: Metadata = {
  title: item.label,
  description: item.summary,
};

export default function Page() {
  return (
    <DocsPage
      title="Appearance"
      href={item.href}
      toc={[
        { id: "parts", label: "Parts of the frame" },
        { id: "label", label: "Measurement label" },
        { id: "position", label: "Label position" },
      ]}
      lede={
        <p>
          A frame is an outline, four corner handles and a measurement label.
          Each part is optional, and all of them are drawn in the text&rsquo;s
          own colour until you say otherwise.
        </p>
      }
    >
      <Appearance />
      <Label />
      <Position />
    </DocsPage>
  );
}
