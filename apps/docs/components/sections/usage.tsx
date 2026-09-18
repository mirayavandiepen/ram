import { Ram } from "ram";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Section } from "../section";

export function Usage() {
  return (
    <Section id="usage" title="Usage" description="Wrap the text you want to frame.">
      <Preview>
        <Sample>
          built to <Ram delay={300}>delight</Ram>
        </Sample>
      </Preview>
      <Code>{`
import { Ram } from "ram";

export default function Example() {
  return (
    <h1>
      built to <Ram>delight</Ram>
    </h1>
  );
}
`}</Code>
    </Section>
  );
}
