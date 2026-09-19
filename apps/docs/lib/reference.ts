/**
 * The two reference tables, as data.
 *
 * They live here rather than beside the sections that render them because the
 * page is not their only reader: the markdown mirror at `lib/markdown.ts`
 * prints the same rows for anyone reading the docs outside a browser. One
 * table that renders twice cannot drift from itself.
 */
export type ReferenceRow = {
  name: string;
  /** Omit on every row to drop the type column entirely. */
  type?: string;
  /** The value used when the prop is left out. Omit when there is none. */
  default?: string;
  description: string;
};

export const PROPS: ReferenceRow[] = [
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
    name: "handleSize",
    type: "number",
    default: "6",
    description: "Width and height of each corner handle, in px.",
  },
  {
    name: "handleFill",
    type: `"hollow" | "solid"`,
    default: `"hollow"`,
    description:
      "Ring each handle around the page colour, or fill it with the frame colour.",
  },
  {
    name: "handleBackground",
    type: "string",
    default: "light-dark(#fff, #111)",
    description:
      "What a hollow handle is filled with. Ignored when handles are solid.",
  },
  {
    name: "lineWidth",
    type: "number",
    default: "1",
    description: "Thickness of the outline, in px.",
  },
  {
    name: "handleLineWidth",
    type: "number",
    default: "1",
    description:
      "Thickness of the handle rings, in px. Independent of lineWidth, the way a design tool keeps a handle hairline however heavy the stroke is.",
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
    default: "#0d99ff",
    description:
      "Colour of the outline, handles and label. Any CSS colour; selection blue by default.",
  },
  {
    name: "labelColor",
    type: "string",
    default: "light-dark(#fff, #111)",
    description: "Colour of the text inside the label.",
  },
  {
    name: "labelBackground",
    type: "string",
    default: "currentColor",
    description: "Background of the label chip. Follows the frame colour.",
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

export const CSS_VARIABLES: ReferenceRow[] = [
  {
    name: "--ram-color",
    default: "#0d99ff",
    description: "Colour of the outline, handles and label.",
  },
  {
    name: "--ram-line-width",
    default: "1px",
    description: "Thickness of the outline.",
  },
  {
    name: "--ram-outline-opacity",
    default: "0.6",
    description:
      "How far the outline is held below full strength. The handles stay solid.",
  },
  {
    name: "--ram-handle-size",
    default: "6px",
    description: "Width and height of each corner handle.",
  },
  {
    name: "--ram-handle-fill",
    default: "light-dark(#fff, #111)",
    description: "Centre of a hollow handle. Ignored when handles are solid.",
  },
  {
    name: "--ram-handle-line-width",
    default: "1px",
    description:
      "Thickness of the handle rings, set apart from the outline so a heavy stroke never closes a hollow handle up.",
  },
  {
    name: "--ram-inset",
    default: "4px",
    description: "How far the outline sits outside the text.",
  },
  {
    name: "--ram-label-background",
    default: "currentColor",
    description: "Background of the label, which follows the frame colour.",
  },
  {
    name: "--ram-label-color",
    default: "light-dark(#fff, #111)",
    description: "Label text: white on light schemes, near-black on dark.",
  },
  {
    name: "--ram-label-font-size",
    default: "11px",
    description: "Label text size.",
  },
  {
    name: "--ram-label-offset",
    default: "6px",
    description: "Gap between the label and the outline.",
  },
];
