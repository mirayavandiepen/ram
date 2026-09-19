"use client";

import { Ram } from "ram";
import { useState } from "react";

import { Code } from "../code";
import { ExampleBrowser } from "../example-browser";
import { Sample } from "../preview";
import { PRESS } from "../press";
import { Section } from "../section";

const TRIGGERS = ["mount", "hover", "click", "controlled"] as const;
type Trigger = (typeof TRIGGERS)[number];

const CODE: Record<Trigger, string> = {
  mount: `<Ram trigger="mount">delight</Ram>`,
  hover: `<Ram trigger="hover">hover me</Ram>`,
  click: `<Ram trigger="click">click me</Ram>`,
  controlled: `const [active, setActive] = useState(false);

<Ram active={active}>delight</Ram>
<button onClick={() => setActive((a) => !a)}>Toggle</button>`,
};

export function Trigger() {
  const [trigger, setTrigger] = useState<Trigger>("mount");
  const [active, setActive] = useState(false);

  return (
    <Section
      id="trigger"
      title="Trigger"
      description="Decide when the sequence plays. On mount is the default; hover and click need nothing else wired up, and a controlled frame follows a boolean."
    >
      <ExampleBrowser
        label="Trigger"
        value={trigger}
        onChange={(next) => {
          setTrigger(next);
          setActive(false);
        }}
        options={TRIGGERS}
        resetKey={trigger}
        replay={trigger === "mount"}
      >
        {trigger === "mount" ? (
          <Sample>
            built to <Ram delay={300}>delight</Ram>
          </Sample>
        ) : trigger === "hover" ? (
          <Sample>
            built to <Ram trigger="hover">hover me</Ram>
          </Sample>
        ) : trigger === "click" ? (
          <Sample>
            built to{" "}
            <Ram trigger="click" style={{ cursor: "pointer" }}>
              click me
            </Ram>
          </Sample>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <Sample>
              built to <Ram active={active}>delight</Ram>
            </Sample>
            <button
              type="button"
              onClick={() => setActive((a) => !a)}
              className={`border-border bg-surface hover:bg-surface-hover h-7 rounded-full border px-3 text-[13px] leading-none ${PRESS}`}
            >
              {active ? "Hide" : "Show"}
            </button>
          </div>
        )}
      </ExampleBrowser>
      <Code label="tsx">{CODE[trigger]}</Code>
    </Section>
  );
}
