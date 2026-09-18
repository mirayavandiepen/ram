import { Kerned } from "kerned";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Section } from "../section";

export function Usage() {
  return (
    <Section id="usage" title="Usage" description="Wrap the text you want to mark.">
      <Preview>
        <Sample>
          built to <Kerned delay={300}>delight</Kerned>
        </Sample>
      </Preview>
      <Code>{`
import { Kerned } from "kerned";

export default function Example() {
  return (
    <h1>
      built to <Kerned>delight</Kerned>
    </h1>
  );
}
`}</Code>
    </Section>
  );
}
