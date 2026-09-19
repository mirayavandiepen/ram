"use client";

import { Ram, type RamLabelPosition } from "@mirayavandiepen/ram";
import { useState } from "react";

import { Code } from "../code";
import { ExampleBrowser } from "../example-browser";
import { Sample } from "../preview";
import { Section } from "../section";

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
      <ExampleBrowser
        label="Label position"
        value={position}
        onChange={setPosition}
        options={POSITIONS}
        resetKey={position}
      >
        <Sample>
          built to{" "}
          <Ram delay={300} persistent labelPosition={position}>
            delight
          </Ram>
        </Sample>
      </ExampleBrowser>
      <Code label="tsx">{`<Ram labelPosition="${position}">delight</Ram>`}</Code>
    </Section>
  );
}
