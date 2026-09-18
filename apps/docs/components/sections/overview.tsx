import { site } from "@/lib/site";

import { Pronunciation } from "../pronunciation";
import { Section } from "../section";

export function Overview() {
  return (
    <Section id="overview" title="Overview">
      <p className="text-[15px] text-muted">
        <span className="text-foreground">{site.name}</span> (Swedish for
        &ldquo;{site.meaning}&rdquo;, pronounced{" "}
        <code className="rounded-[4px] border border-border bg-code-bg px-[5px] py-[1px] font-mono text-[13px] text-foreground">
          {site.pronunciation}
        </code>
        <Pronunciation />) is a tiny React component for animated design-tool
        selection frames around text.
      </p>
      <p className="text-[15px] text-muted">
        Wrap your text and {site.name} handles the measurement, selection
        outline, corner handles and animation.
      </p>
    </Section>
  );
}
