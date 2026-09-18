import { Kerned } from "kerned";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Section } from "../section";

const VARIABLES: [string, string][] = [
  ["--kerned-color", "outline, handles and label. Defaults to currentColor."],
  ["--kerned-line-width", "1px"],
  ["--kerned-outline-opacity", "0.6"],
  ["--kerned-handle-size", "6px"],
  ["--kerned-inset", "4px, how far the outline sits outside the text"],
  ["--kerned-label-background", "defaults to the marker colour"],
  ["--kerned-label-color", "white on light schemes, near-black on dark"],
  ["--kerned-label-font-size", "11px"],
  ["--kerned-label-offset", "6px"],
];

export function Styling() {
  return (
    <Section
      id="styling"
      title="Styling"
      description="Kerned inherits everything typographic from its parent. It sets no font size, family, weight or line height of its own, so it drops into any heading and follows it at every breakpoint."
    >
      <Preview>
        <div className="flex flex-col items-center gap-12">
          <Sample size="sm" weight="normal">
            built to <Kerned delay={200} persistent>delight</Kerned>
          </Sample>
          <Sample size="lg" weight="semibold">
            built to <Kerned delay={500} persistent>delight</Kerned>
          </Sample>
        </div>
      </Preview>
      <Code>{`
<h1 className="text-5xl font-medium">
  built to <Kerned>delight</Kerned>
</h1>
`}</Code>
      <p className="text-[15px] text-muted">
        The chrome is tuned with CSS variables, set on the component or any
        ancestor.
      </p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-[13px]">
        {VARIABLES.map(([name, description]) => (
          <div key={name} className="contents">
            <dt className="font-mono text-foreground">{name}</dt>
            <dd className="text-muted">{description}</dd>
          </div>
        ))}
      </dl>
      <Preview>
        <Sample>
          built to{" "}
          <Kerned
            delay={200}
            persistent
            style={
              {
                "--kerned-color": "#0d99ff",
                "--kerned-handle-size": "8px",
                "--kerned-inset": "8px",
              } as React.CSSProperties
            }
          >
            delight
          </Kerned>
        </Sample>
      </Preview>
      <Code>{`
<Kerned
  style={{
    "--kerned-color": "#0d99ff",
    "--kerned-handle-size": "8px",
    "--kerned-inset": "8px",
  }}
>
  delight
</Kerned>
`}</Code>
    </Section>
  );
}
