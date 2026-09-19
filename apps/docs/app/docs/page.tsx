import type { Metadata } from "next";

import { DocsPage } from "@/components/docs/page-shell";
import { Install } from "@/components/install";
import { Pronunciation } from "@/components/pronunciation";
import { Section } from "@/components/section";
import { Usage } from "@/components/sections/usage";
import { NAV_ITEMS } from "@/lib/nav";
import { site } from "@/lib/site";

const item = NAV_ITEMS[0]!;

export const metadata: Metadata = {
  title: item.label,
  description: item.summary,
};

export default function Page() {
  return (
    <DocsPage
      title="Getting started"
      href={item.href}
      toc={[
        { id: "installation", label: "Installation" },
        { id: "usage", label: "Usage" },
      ]}
      lede={
        <>
          <p>
            <span lang="sv" className="text-foreground">
              {site.name}
            </span>{" "}
            (Swedish for &ldquo;{site.meaning}&rdquo;, pronounced{" "}
            {/* Read out, the phonetic notation is noise, and the spelling
                right after it says the same thing in letters anyone can
                sound out. The notation and the button that speaks it are one
                unit; left to wrap they end up on separate lines and the
                speaker reads as punctuation. */}
            <span className="inline-flex items-center gap-1 whitespace-nowrap align-middle">
              <code
                aria-hidden="true"
                className="border-border bg-code-bg text-foreground flex h-6 items-center rounded-[4px] border px-1.5 font-mono text-[13px]"
              >
                {site.ipa}
              </code>
              <Pronunciation />
            </span>
            , like &ldquo;{site.pronunciation}&rdquo;, rhyming with &ldquo;
            {site.rhyme}&rdquo;) is a tiny React component for animated
            design-tool selection frames around text.
          </p>
          <p>
            Wrap your text and {site.name} handles the measurement, selection
            outline, corner handles and animation.
          </p>
        </>
      }
    >
      <Section
        id="installation"
        title="Installation"
        description={`${site.name} ships as ESM and CJS, typed, with React 18 and 19 as peer dependencies and nothing else.`}
      >
        <Install />
      </Section>
      <Usage />
    </DocsPage>
  );
}
