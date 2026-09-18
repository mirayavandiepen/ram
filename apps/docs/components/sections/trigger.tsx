"use client";

import { Kerned } from "kerned";
import { useState } from "react";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Section } from "../section";
import { Segmented } from "../segmented";

const TRIGGERS = ["mount", "hover", "click", "controlled"] as const;
type Trigger = (typeof TRIGGERS)[number];

const CODE: Record<Trigger, string> = {
  mount: `<Kerned trigger="mount">delight</Kerned>`,
  hover: `<Kerned trigger="hover">hover me</Kerned>`,
  click: `<Kerned trigger="click">click me</Kerned>`,
  controlled: `const [active, setActive] = useState(false);

<Kerned active={active}>delight</Kerned>
<button onClick={() => setActive((a) => !a)}>Toggle</button>`,
};

export function Trigger() {
  const [trigger, setTrigger] = useState<Trigger>("mount");
  const [active, setActive] = useState(false);

  return (
    <Section
      id="trigger"
      title="Trigger"
      description="Decide when the sequence plays. On mount is the default; hover and click need nothing else wired up, and a controlled box follows a boolean."
    >
      <Segmented
        value={trigger}
        onChange={(next) => {
          setTrigger(next);
          setActive(false);
        }}
        options={TRIGGERS}
      />
      <Preview resetKey={trigger} replay={trigger === "mount"}>
        {trigger === "mount" ? (
          <Sample>
            built to <Kerned delay={300}>delight</Kerned>
          </Sample>
        ) : trigger === "hover" ? (
          <Sample>
            built to <Kerned trigger="hover">hover me</Kerned>
          </Sample>
        ) : trigger === "click" ? (
          <Sample>
            built to{" "}
            <Kerned trigger="click" style={{ cursor: "pointer" }}>
              click me
            </Kerned>
          </Sample>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <Sample>
              built to <Kerned active={active}>delight</Kerned>
            </Sample>
            <button
              type="button"
              onClick={() => setActive((a) => !a)}
              className="h-7 rounded-full border border-border bg-surface px-3 text-[13px] leading-none transition-colors hover:bg-surface-hover"
            >
              {active ? "Hide" : "Show"}
            </button>
          </div>
        )}
      </Preview>
      <Code>{CODE[trigger]}</Code>
    </Section>
  );
}
