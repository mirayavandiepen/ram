"use client";

import { Ram } from "ram";
import { useState } from "react";

import { Code } from "../code";
import { Preview, Sample } from "../preview";
import { Section } from "../section";
import { Segmented } from "../segmented";

const MODES = ["Default", "Static", "Persistent"] as const;
type Mode = (typeof MODES)[number];

const DELAYS = ["0", "400", "1000"] as const;
const DURATIONS = ["800", "1400", "2400"] as const;
const HOLDS = ["600", "1200", "2400"] as const;

export function Animation() {
  const [mode, setMode] = useState<Mode>("Default");
  const [delay, setDelay] = useState<(typeof DELAYS)[number]>("0");
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>("1400");
  const [hold, setHold] = useState<(typeof HOLDS)[number]>("1200");

  const props = {
    animation: mode === "Static" ? ("static" as const) : ("tracking" as const),
    persistent: mode === "Persistent",
    delay: Number(delay),
    duration: Number(duration),
    holdDuration: Number(hold),
  };

  const attrs = [
    mode === "Static" ? `animation="static"` : null,
    mode === "Persistent" ? `persistent` : null,
    delay !== "0" ? `delay={${delay}}` : null,
    duration !== "1400" ? `duration={${duration}}` : null,
    hold !== "1200" && mode !== "Persistent" ? `holdDuration={${hold}}` : null,
  ].filter(Boolean);

  const code =
    attrs.length === 0
      ? `<Ram>delight</Ram>`
      : attrs.length === 1
        ? `<Ram ${attrs[0]}>delight</Ram>`
        : `<Ram\n${attrs.map((a) => `  ${a}`).join("\n")}\n>\n  delight\n</Ram>`;

  return (
    <Section
      id="animation"
      title="Animation"
      description="Control how the frame enters, moves and leaves. The tracking pass loosens the letter-spacing, tightens past where it started, and settles back, without ever moving the text around it."
    >
      <div className="flex flex-col gap-2">
        <Segmented
          label="Mode"
          value={mode}
          onChange={setMode}
          options={MODES}
        />
        <Segmented
          label="delay"
          value={delay}
          onChange={setDelay}
          options={DELAYS.map((v) => ({ value: v, label: `${v} ms` }))}
        />
        <Segmented
          label="duration"
          value={duration}
          onChange={setDuration}
          options={DURATIONS.map((v) => ({ value: v, label: `${v} ms` }))}
        />
        <Segmented
          label="hold"
          value={hold}
          onChange={setHold}
          options={HOLDS.map((v) => ({ value: v, label: `${v} ms` }))}
        />
      </div>
      <Preview resetKey={JSON.stringify(props)}>
        <Sample>
          built to <Ram {...props}>delight</Ram>
        </Sample>
      </Preview>
      <Code>{code}</Code>
    </Section>
  );
}
