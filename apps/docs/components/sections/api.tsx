import { type ReferenceRow, Reference } from "../reference";
import { Section } from "../section";

const PROPS: ReferenceRow[] = [
  {
    name: "children",
    type: "ReactNode",
    description: "The text to frame. Required.",
  },
  {
    name: "delay",
    type: "number",
    default: "0",
    description: "Milliseconds to wait before the frame appears.",
  },
  {
    name: "duration",
    type: "number",
    default: "1400",
    description: "Length of the tracking pass, in milliseconds.",
  },
  {
    name: "holdDuration",
    type: "number",
    default: "1200",
    description: "How long the frame holds before leaving, in milliseconds.",
  },
  {
    name: "label",
    type: "boolean | (size) => string",
    default: "true",
    description: "Show the width × height label, or format it yourself.",
  },
  {
    name: "labelPosition",
    type: `"top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right"`,
    default: `"top"`,
    description: "Where the label sits.",
  },
  {
    name: "handles",
    type: "boolean",
    default: "true",
    description: "Draw the four corner handles.",
  },
  {
    name: "animation",
    type: `"tracking" | "static"`,
    default: `"tracking"`,
    description: "Whether the letter-spacing breathes while the frame is up.",
  },
  {
    name: "trigger",
    type: `"mount" | "hover" | "click" | "manual"`,
    default: `"mount"`,
    description: `What starts the sequence. Becomes "manual" when active is set.`,
  },
  {
    name: "active",
    type: "boolean",
    description: 'Controlled visibility. Implies trigger="manual".',
  },
  {
    name: "persistent",
    type: "boolean",
    default: "false",
    description:
      "Keep the frame on the page instead of leaving after the hold.",
  },
  {
    name: "color",
    type: "string",
    default: "currentColor",
    description: "Colour of the outline, handles and label. Any CSS colour.",
  },
  {
    name: "className",
    type: "string",
    description: "Applied to the wrapping span.",
  },
  {
    name: "style",
    type: "CSSProperties",
    description:
      "Applied to the wrapping span. A good place for CSS variables.",
  },
  {
    name: "onStart",
    type: "() => void",
    description: "Called when the frame starts to appear.",
  },
  {
    name: "onComplete",
    type: "() => void",
    description:
      "Called when the frame has left, or has settled when persistent.",
  },
];

export function Api() {
  return (
    <Section id="api" title="API">
      <Reference nameLabel="Prop" rows={PROPS} />
    </Section>
  );
}
