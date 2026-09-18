import { site } from "@/lib/site";

import { Pronunciation } from "../pronunciation";
import { Section } from "../section";

export function Overview() {
  return (
    <Section id="overview" title="Overview">
      <p className="text-muted text-pretty text-[15px]">
        <span lang="sv" className="text-foreground">
          {site.name}
        </span>{" "}
        (Swedish for &ldquo;{site.meaning}&rdquo;, pronounced{" "}
        {/* Read out, the phonetic notation is noise, and the spelling right
            after it says the same thing in letters anyone can sound out. */}
        {/* The notation and the button that speaks it are one unit; left to
            wrap they end up on separate lines and the speaker reads as
            punctuation. */}
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
        {site.rhyme}&rdquo;) is a tiny React component for animated design-tool
        selection frames around text.
      </p>
      <p className="text-muted text-pretty text-[15px]">
        Wrap your text and {site.name} handles the measurement, selection
        outline, corner handles and animation.
      </p>
    </Section>
  );
}
