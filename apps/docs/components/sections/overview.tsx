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
        <code className="border-border bg-code-bg text-foreground rounded-[4px] border px-[5px] py-[1px] font-mono text-[13px]">
          {site.pronunciation}
        </code>
        <Pronunciation />) is a tiny React component for animated design-tool
        selection frames around text.
      </p>
      <p className="text-muted text-pretty text-[15px]">
        Wrap your text and {site.name} handles the measurement, selection
        outline, corner handles and animation.
      </p>
    </Section>
  );
}
