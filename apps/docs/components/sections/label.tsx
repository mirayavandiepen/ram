"use client";

import { Ram, type RamSize } from "ram";
import { useState } from "react";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Section } from "../section";
import { Segmented } from "../segmented";

const OPTIONS = ["Show", "Hide", "Custom"] as const;
type Option = (typeof OPTIONS)[number];

const widthOnly = ({ width }: RamSize) => `w ${Math.round(width)}`;

const CODE: Record<Option, string> = {
  Show: `<Ram label>delight</Ram>`,
  Hide: `<Ram label={false}>delight</Ram>`,
  Custom: `<Ram label={({ width }) => \`w \${Math.round(width)}\`}>
  delight
</Ram>`,
};

export function Label() {
  const [option, setOption] = useState<Option>("Show");
  const label = option === "Show" ? true : option === "Hide" ? false : widthOnly;

  return (
    <Section
      id="label"
      title="Measurement label"
      description="The label reports the rendered width and height of the text, in CSS pixels. It always corresponds to what is actually on the page, and re-measures if the text ever resizes."
    >
      <Segmented value={option} onChange={setOption} options={OPTIONS} />
      <Preview resetKey={option}>
        <Sample>
          built to{" "}
          <Ram delay={300} persistent label={label}>
            delight
          </Ram>
        </Sample>
      </Preview>
      <Code>{CODE[option]}</Code>
    </Section>
  );
}
