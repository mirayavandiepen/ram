import { Section } from "../section";

const PROPS: [name: string, type: string, description: string][] = [
  ["children", "ReactNode", "The text to frame. Required."],
  [
    "delay",
    "number",
    "Milliseconds to wait before the frame appears. Defaults to 0.",
  ],
  [
    "duration",
    "number",
    "Length of the tracking pass in milliseconds. Defaults to 1400.",
  ],
  [
    "holdDuration",
    "number",
    "How long the frame holds before leaving, in milliseconds. Defaults to 1200.",
  ],
  [
    "label",
    "boolean | (size) => string",
    "Show the width × height label, or format it yourself. Defaults to true.",
  ],
  [
    "labelPosition",
    `"top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right"`,
    `Where the label sits. Defaults to "top".`,
  ],
  ["handles", "boolean", "Draw the four corner handles. Defaults to true."],
  [
    "animation",
    `"tracking" | "static"`,
    `Whether the letter-spacing breathes while the frame is up. Defaults to "tracking".`,
  ],
  [
    "trigger",
    `"mount" | "hover" | "click" | "manual"`,
    `What starts the sequence. Defaults to "mount", or "manual" when active is set.`,
  ],
  ["active", "boolean", 'Controlled visibility. Implies trigger="manual".'],
  [
    "persistent",
    "boolean",
    "Keep the frame on the page instead of leaving after the hold.",
  ],
  [
    "color",
    "string",
    "Colour of the outline, handles and label. Any CSS colour.",
  ],
  ["className", "string", "Applied to the wrapping span."],
  [
    "style",
    "CSSProperties",
    "Applied to the wrapping span. A good place for CSS variables.",
  ],
  ["onStart", "() => void", "Called when the frame starts to appear."],
  [
    "onComplete",
    "() => void",
    "Called when the frame has left, or has settled when persistent.",
  ],
];

export function Api() {
  return (
    <Section id="api" title="API">
      <div className="divide-border border-border divide-y border-y">
        {PROPS.map(([name, type, description]) => (
          <div
            key={name}
            className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[150px_1fr]"
          >
            <dl className="contents">
              <dt className="text-foreground font-mono text-[13px]">{name}</dt>
              <dd>
                <p className="text-muted font-mono text-[12px]">{type}</p>
                <p className="mt-0.5 text-pretty text-[14px]">{description}</p>
              </dd>
            </dl>
          </div>
        ))}
      </div>
    </Section>
  );
}
