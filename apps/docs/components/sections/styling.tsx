import { Ram } from "ram";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Section } from "../section";

const VARIABLES: [string, string][] = [
  ["--ram-color", "outline, handles and label. Defaults to currentColor."],
  ["--ram-line-width", "1px"],
  ["--ram-outline-opacity", "0.6"],
  ["--ram-handle-size", "6px"],
  ["--ram-inset", "4px, how far the outline sits outside the text"],
  ["--ram-label-background", "defaults to the frame colour"],
  ["--ram-label-color", "white on light schemes, near-black on dark"],
  ["--ram-label-font-size", "11px"],
  ["--ram-label-offset", "6px"],
];

export function Styling() {
  return (
    <Section
      id="styling"
      title="Styling"
      description="Ram inherits everything typographic from its parent. It sets no font size, family, weight or line height of its own, so it drops into any heading and follows it at every breakpoint."
    >
      <Preview>
        <div className="flex flex-col items-center gap-12">
          <Sample size="sm" weight="normal">
            built to{" "}
            <Ram delay={200} persistent>
              delight
            </Ram>
          </Sample>
          <Sample size="lg" weight="semibold">
            built to{" "}
            <Ram delay={500} persistent>
              delight
            </Ram>
          </Sample>
        </div>
      </Preview>
      <Code label="example.tsx">{`
<h1 className="text-5xl font-medium">
  built to <Ram>delight</Ram>
</h1>
`}</Code>
      <p className="text-muted text-[15px]">
        The chrome is tuned with CSS variables, set on the component or any
        ancestor.
      </p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-[13px]">
        {VARIABLES.map(([name, description]) => (
          <div key={name} className="contents">
            <dt className="text-foreground font-mono">{name}</dt>
            <dd className="text-muted">{description}</dd>
          </div>
        ))}
      </dl>
      <Preview>
        <Sample>
          built to{" "}
          <Ram
            delay={200}
            persistent
            style={
              {
                "--ram-color": "#0d99ff",
                "--ram-handle-size": "8px",
                "--ram-inset": "8px",
              } as React.CSSProperties
            }
          >
            delight
          </Ram>
        </Sample>
      </Preview>
      <Code label="example.tsx">{`
<Ram
  style={{
    "--ram-color": "#0d99ff",
    "--ram-handle-size": "8px",
    "--ram-inset": "8px",
  }}
>
  delight
</Ram>
`}</Code>
    </Section>
  );
}
