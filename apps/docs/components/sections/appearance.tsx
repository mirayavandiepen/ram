"use client";

import { Ram } from "ram";
import { useState } from "react";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Section } from "../section";
import { Segmented } from "../segmented";

const VARIANTS = {
  Default: { code: `<Ram>delight</Ram>`, props: {} },
  "No label": { code: `<Ram label={false}>delight</Ram>`, props: { label: false } },
  "No handles": {
    code: `<Ram handles={false}>delight</Ram>`,
    props: { handles: false },
  },
  "Outline only": {
    code: `<Ram label={false} handles={false}>\n  delight\n</Ram>`,
    props: { label: false, handles: false },
  },
  "Custom color": {
    code: `<Ram color="#7c3aed">delight</Ram>`,
    props: { color: "#7c3aed" },
  },
} as const;

type Variant = keyof typeof VARIANTS;

export function Appearance() {
  const [variant, setVariant] = useState<Variant>("Default");
  const current = VARIANTS[variant];

  return (
    <Section
      id="appearance"
      title="Appearance"
      description="Every part of the box is optional. Monochrome by default, in whatever colour the text already is."
    >
      <Segmented
        value={variant}
        onChange={setVariant}
        options={Object.keys(VARIANTS) as Variant[]}
      />
      <Preview resetKey={variant}>
        <Sample>
          built to{" "}
          <Ram delay={300} persistent {...current.props}>
            delight
          </Ram>
        </Sample>
      </Preview>
      <Code>{current.code}</Code>
    </Section>
  );
}
