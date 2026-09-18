"use client";

import { Kerned, type KernedLabelPosition } from "kerned";
import { useState } from "react";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Section } from "../section";
import { Segmented } from "../segmented";

const POSITIONS: KernedLabelPosition[] = [
  "top",
  "bottom",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

export function Position() {
  const [position, setPosition] = useState<KernedLabelPosition>("top");

  return (
    <Section
      id="position"
      title="Label position"
      description="Centred positions stay pinned to the resting centre of the box while the text breathes, so the number never slides."
    >
      <Segmented value={position} onChange={setPosition} options={POSITIONS} />
      <Preview resetKey={position}>
        <Sample>
          built to{" "}
          <Kerned delay={300} persistent labelPosition={position}>
            delight
          </Kerned>
        </Sample>
      </Preview>
      <Code>{`<Kerned labelPosition="${position}">delight</Kerned>`}</Code>
    </Section>
  );
}
