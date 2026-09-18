"use client";

import { Kerned } from "kerned";
import { useState } from "react";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Section } from "../section";
import { Segmented } from "../segmented";

const VARIANTS = {
  Default: { code: `<Kerned>delight</Kerned>`, props: {} },
  "No label": { code: `<Kerned label={false}>delight</Kerned>`, props: { label: false } },
  "No handles": {
    code: `<Kerned handles={false}>delight</Kerned>`,
    props: { handles: false },
  },
  "Outline only": {
    code: `<Kerned label={false} handles={false}>\n  delight\n</Kerned>`,
    props: { label: false, handles: false },
  },
  "Custom color": {
    code: `<Kerned color="#7c3aed">delight</Kerned>`,
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
          <Kerned delay={300} persistent {...current.props}>
            delight
          </Kerned>
        </Sample>
      </Preview>
      <Code>{current.code}</Code>
    </Section>
  );
}
