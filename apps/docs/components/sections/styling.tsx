import { Ram } from "ram";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { type ReferenceRow, Reference } from "../reference";
import { Section } from "../section";

const VARIABLES: ReferenceRow[] = [
  {
    name: "--ram-color",
    default: "currentColor",
    description: "Colour of the outline, handles and label.",
  },
  {
    name: "--ram-line-width",
    default: "1px",
    description: "Thickness of the outline.",
  },
  {
    name: "--ram-outline-opacity",
    default: "0.6",
    description:
      "How far the outline is held below full strength. The handles stay solid.",
  },
  {
    name: "--ram-handle-size",
    default: "6px",
    description: "Width and height of each corner handle.",
  },
  {
    name: "--ram-inset",
    default: "4px",
    description: "How far the outline sits outside the text.",
  },
  {
    name: "--ram-label-background",
    default: "currentColor",
    description: "Background of the label, which follows the frame colour.",
  },
  {
    name: "--ram-label-color",
    default: "light-dark(#fff, #111)",
    description: "Label text: white on light schemes, near-black on dark.",
  },
  {
    name: "--ram-label-font-size",
    default: "11px",
    description: "Label text size.",
  },
  {
    name: "--ram-label-offset",
    default: "6px",
    description: "Gap between the label and the outline.",
  },
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
      <Reference nameLabel="Variable" rows={VARIABLES} />
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
