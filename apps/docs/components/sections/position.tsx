"use client";

import { Ram, type RamLabelPosition } from "ram";
import { useState } from "react";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Section } from "../section";
import { Segmented } from "../segmented";

const POSITIONS: RamLabelPosition[] = [
  "top",
  "bottom",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

export function Position() {
  const [position, setPosition] = useState<RamLabelPosition>("top");

  return (
    <Section
      id="position"
      title="Label position"
      description="Centred positions stay pinned to the resting centre of the frame while the text breathes, so the number never slides."
    >
      <Segmented value={position} onChange={setPosition} options={POSITIONS} />
      <Preview resetKey={position}>
        <Sample>
          built to{" "}
          <Ram delay={300} persistent labelPosition={position}>
            delight
          </Ram>
        </Sample>
      </Preview>
      <Code>{`<Ram labelPosition="${position}">delight</Ram>`}</Code>
    </Section>
  );
}
