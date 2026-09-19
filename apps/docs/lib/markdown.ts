import { CSS_VARIABLES, PROPS, type ReferenceRow } from "./reference";
import { site } from "./site";

/**
 * The page, as plain markdown.
 *
 * The docs are a set of React sections with live previews, which is the right
 * shape for a browser and the wrong shape for everything else: a terminal, a
 * diff, a model being asked a question about the library. This is the same
 * document with the interactivity flattened out, served at MARKDOWN_PATH and
 * copied by the page menu.
 */
export const MARKDOWN_PATH = "/llms.txt";

/** Written as an ordinary string so nothing below has to escape a backtick. */
const FENCE = "```";

const mono = (value: string) => "`" + value + "`";

/** A literal pipe would end the cell it sits in, and several types contain one. */
const cell = (value: string) => value.replaceAll("|", "\\|");

const table = (nameLabel: string, rows: ReferenceRow[]) => {
  const typed = rows.some((row) => row.type);
  const columns = typed
    ? [nameLabel, "Type", "Default", "Description"]
    : [nameLabel, "Default", "Description"];
  const line = (values: string[]) => `| ${values.join(" | ")} |`;

  return [
    line(columns),
    line(columns.map(() => "---")),
    ...rows.map((row) =>
      line(
        [
          mono(row.name),
          typed ? (row.type ? mono(cell(row.type)) : "") : null,
          row.default ? mono(cell(row.default)) : "",
          cell(row.description),
        ].filter((value) => value !== null),
      ),
    ),
  ].join("\n");
};

export const DOCS_MARKDOWN = `# ${site.name}

${site.tagline}

${site.name} (Swedish for "${site.meaning}", pronounced ${site.ipa}, like "${site.pronunciation}", rhyming with "${site.rhyme}") is a tiny React component for animated design-tool selection frames around text.

Wrap your text and ${site.name} handles the measurement, selection outline, corner handles and animation.

- Docs: ${site.url}/docs
- Source: ${site.github}

## Installation

${FENCE}bash
pnpm add ${site.pkg}
${FENCE}

Also on npm, yarn and bun: ${mono(`npm install ${site.pkg}`)}, ${mono(`yarn add ${site.pkg}`)}, ${mono(`bun add ${site.pkg}`)}.

## Usage

Wrap the text you want to frame.

${FENCE}tsx
import { ${site.name} } from "${site.pkg}";

export default function Example() {
  return (
    <h1>
      built to <${site.name}>delight</${site.name}>
    </h1>
  );
}
${FENCE}

## Appearance

Every part of the frame is optional. Drawn in selection blue by default, or in any colour you name.

${FENCE}tsx
<Ram>delight</Ram>
<Ram label={false}>delight</Ram>
<Ram handles={false}>delight</Ram>
<Ram label={false} handles={false}>delight</Ram>
<Ram color="#7c3aed">delight</Ram>
${FENCE}

## Measurement label

The label reports the rendered width and height of the text, in CSS pixels. It always corresponds to what is actually on the page, and re-measures if the text ever resizes.

${FENCE}tsx
<Ram label>delight</Ram>
<Ram label={false}>delight</Ram>
<Ram label={({ width }) => \`w \${Math.round(width)}\`}>delight</Ram>
${FENCE}

## Label position

Centred positions stay pinned to the resting centre of the frame while the text breathes, so the number never slides.

${FENCE}tsx
<Ram labelPosition="top">delight</Ram>
${FENCE}

One of ${mono("top")}, ${mono("bottom")}, ${mono("top-left")}, ${mono("top-right")}, ${mono("bottom-left")} or ${mono("bottom-right")}.

## Animation

Control how the frame enters, moves and leaves. The tracking pass loosens the letter-spacing, tightens past where it started, and settles back, without ever moving the text around it.

${FENCE}tsx
<Ram
  animation="static"
  delay={400}
  duration={2400}
  holdDuration={600}
>
  delight
</Ram>
${FENCE}

## Trigger

Decide when the sequence plays. On mount is the default; hover and click need nothing else wired up, and a controlled frame follows a boolean.

${FENCE}tsx
<Ram trigger="mount">delight</Ram>
<Ram trigger="hover">hover me</Ram>
<Ram trigger="click">click me</Ram>
${FENCE}

${FENCE}tsx
const [active, setActive] = useState(false);

<Ram active={active}>delight</Ram>
<button onClick={() => setActive((a) => !a)}>Toggle</button>
${FENCE}

## Styling

${site.name} inherits everything typographic from its parent. It sets no font size, family, weight or line height of its own, so it drops into any heading and follows it at every breakpoint.

${FENCE}tsx
<h1 className="text-5xl font-medium">
  built to <Ram>delight</Ram>
</h1>
${FENCE}

The chrome is tuned with CSS variables, set on the component or any ancestor.

${table("Variable", CSS_VARIABLES)}

${FENCE}tsx
<Ram
  style={{
    "--ram-color": "#7c3aed",
    "--ram-handle-size": "8px",
    "--ram-inset": "8px",
  }}
>
  delight
</Ram>
${FENCE}

## API

${table("Prop", PROPS)}

## Accessibility

- The outline, handles and label are decorative and hidden from assistive technology.
- The wrapped text stays ordinary text: selectable, searchable, and read exactly as written.
- ${mono("prefers-reduced-motion")} drops the tracking pass. The frame still fades in and out.
- ${site.name} adds no headings, landmarks or roles, so the semantics of the surrounding markup are unchanged.
`;
