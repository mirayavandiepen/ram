# ram

**A tiny React component for animated design-tool selection frames around text.**

Wrap a word and it gets a hairline outline, four corner handles and a live `width × height` label, with a short letter-spacing pass that never moves the text around it.

Swedish for "frame" — pronounced `/rɑːm/`, like _rahm_, rhyming with "calm".

```bash
pnpm add ram
```

```tsx
import { Ram } from "ram";

export default function Example() {
  return (
    <h1>
      built to <Ram>delight</Ram>
    </h1>
  );
}
```

Zero dependencies · inherits the parent's typography · respects `prefers-reduced-motion`.

## Props

### Content

| Prop       | Type        | Default  | Description                                                                 |
| ---------- | ----------- | -------- | --------------------------------------------------------------------------- |
| `children` | `ReactNode` | required | The text to frame. Plain strings track most accurately, but any node works. |

### Timing

| Prop           | Type          | Default | Description                                              |
| -------------- | ------------- | ------- | -------------------------------------------------------- |
| `delay`        | `number` (ms) | `0`     | Wait before the frame appears, on every trigger.         |
| `duration`     | `number` (ms) | `1400`  | Length of the tracking pass.                             |
| `holdDuration` | `number` (ms) | `1200`  | How long the frame holds its measurement before leaving. |

### Appearance

| Prop               | Type                                   | Default                 | Description                                                 |
| ------------------ | -------------------------------------- | ----------------------- | ----------------------------------------------------------- |
| `label`            | `boolean \| (size) => string`          | `true`                  | Show the `width × height` label, or format it yourself.     |
| `labelPosition`    | `"top" \| "bottom" \| "top-left" \| …` | `"top"`                 | Where the label sits relative to the outline.               |
| `labelColor`       | `string`                               | `light-dark(#fff,#111)` | Colour of the text inside the label.                        |
| `labelBackground`  | `string`                               | `currentColor`          | Background of the label chip. Follows the frame colour.     |
| `handles`          | `boolean`                              | `true`                  | Draw the four corner handles.                               |
| `handleSize`       | `number` (px)                          | `6`                     | Width and height of each handle.                            |
| `handleFill`       | `"hollow" \| "solid"`                  | `"hollow"`              | `hollow` rings each handle the way a design tool does.      |
| `handleBackground` | `string`                               | `light-dark(#fff,#111)` | What a hollow handle is filled with.                        |
| `lineWidth`        | `number` (px)                          | `1`                     | Thickness of the outline.                                   |
| `handleLineWidth`  | `number` (px)                          | `1`                     | Thickness of the handle rings, independent of `lineWidth`.  |
| `color`            | `string`                               | `"#0d99ff"`             | Outline, handles and label. Any CSS colour.                 |

### Behaviour

| Prop         | Type                                        | Default      | Description                                                  |
| ------------ | ------------------------------------------- | ------------ | ------------------------------------------------------------ |
| `animation`  | `"tracking" \| "static"`                    | `"tracking"` | `tracking` breathes the letter-spacing; `static` only fades. |
| `trigger`    | `"mount" \| "hover" \| "click" \| "manual"` | `"mount"`    | What starts the sequence.                                    |
| `active`     | `boolean`                                   | —            | Controlled visibility. Implies `trigger="manual"`.           |
| `persistent` | `boolean`                                   | `false`      | Keep the frame up instead of leaving after the hold.         |
| `onStart`    | `() => void`                                | —            | The frame has started to appear.                             |
| `onComplete` | `() => void`                                | —            | The frame has left, or, when persistent, settled.            |

## CSS variables

```css
--ram-color             /* outline, handles and label; #0d99ff, selection blue */
--ram-line-width        /* 1px, the outline */
--ram-outline-opacity   /* 0.6 */
--ram-handle-size       /* 6px */
--ram-handle-fill       /* centre of a hollow handle; white on light, near-black on dark */
--ram-handle-line-width /* 1px, the handle rings; set apart from the outline */
--ram-inset             /* 4px, how far the outline sits outside the text */
--ram-label-background  /* defaults to the frame colour */
--ram-label-color       /* white on light, near-black on dark */
--ram-label-font-size   /* 11px */
--ram-label-offset      /* 6px */
```

## Documentation

Full API reference and live examples: **[ram.dev](https://ram.dev)**

MIT © [Miraya van Diepen](https://github.com/mirayavandiepen)
