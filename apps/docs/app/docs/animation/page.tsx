import type { Metadata } from "next";

import { DocsPage } from "@/components/docs/page-shell";
import { Animation } from "@/components/sections/animation";
import { Trigger } from "@/components/sections/trigger";
import { NAV_ITEMS } from "@/lib/nav";

const item = NAV_ITEMS.find((entry) => entry.href === "/docs/animation")!;

export const metadata: Metadata = {
  title: item.label,
  description: item.summary,
};

export default function Page() {
  return (
    <DocsPage
      title="Animation"
      href={item.href}
      toc={[
        { id: "timing", label: "Timing" },
        { id: "trigger", label: "Trigger" },
      ]}
      lede={
        <p>
          The frame fades in, runs a short letter-spacing pass, holds its
          measurement and leaves. Every stage of that is yours to set, and so is
          what starts it.
        </p>
      }
    >
      <Animation />
      <Trigger />
    </DocsPage>
  );
}
