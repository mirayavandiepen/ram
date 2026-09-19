"use client";

import { Ram } from "@mirayavandiepen/ram";
import { useState } from "react";

import { Code } from "../code";
import { ExampleBrowser } from "../example-browser";
import { Sample } from "../preview";
import { Section } from "../section";

const VARIANTS = {
  Default: { code: `<Ram>delight</Ram>`, props: {} },
  "No label": {
    code: `<Ram label={false}>delight</Ram>`,
    props: { label: false },
  },
  "No handles": {
    code: `<Ram handles={false}>delight</Ram>`,
    props: { handles: false },
  },
  "Solid handles": {
    code: `<Ram handleFill="solid">delight</Ram>`,
    props: { handleFill: "solid" },
  },
  "White handles": {
    code: `<Ram handleBackground="#fff">delight</Ram>`,
    props: { handleBackground: "#fff" },
  },
  Thicker: {
    code: `<Ram lineWidth={3} handleSize={8} handleLineWidth={2}>\n  delight\n</Ram>`,
    props: { lineWidth: 3, handleSize: 8, handleLineWidth: 2 },
  },
  "Outline only": {
    code: `<Ram label={false} handles={false}>\n  delight\n</Ram>`,
    props: { label: false, handles: false },
  },
  "Custom color": {
    code: `<Ram color="#7c3aed">delight</Ram>`,
    props: { color: "#7c3aed" },
  },
  "Custom label": {
    code: `<Ram labelBackground="#111" labelColor="#fff">\n  delight\n</Ram>`,
    props: { labelBackground: "#111", labelColor: "#fff" },
  },
} as const;

type Variant = keyof typeof VARIANTS;

export function Appearance() {
  const [variant, setVariant] = useState<Variant>("Default");
  const current = VARIANTS[variant];

  return (
    <Section
      id="parts"
      title="Parts of the frame"
      description="Every part of the frame is optional. Drawn in selection blue by default, or in any colour you name — outline, handles and label each take one of their own."
    >
      <ExampleBrowser
        label="Variant"
        value={variant}
        onChange={setVariant}
        options={Object.keys(VARIANTS) as Variant[]}
        resetKey={variant}
      >
        <Sample>
          built to{" "}
          <Ram delay={300} persistent {...current.props}>
            delight
          </Ram>
        </Sample>
      </ExampleBrowser>
      <Code label="tsx">{current.code}</Code>
    </Section>
  );
}
