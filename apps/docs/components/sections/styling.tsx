import { Ram } from "ram";

import { CSS_VARIABLES } from "@/lib/reference";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Reference } from "../reference";
import { Section } from "../section";

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
      <Reference nameLabel="Variable" rows={CSS_VARIABLES} />
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
