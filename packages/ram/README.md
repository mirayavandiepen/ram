# ram

**Ram** (Swedish for "frame", pronounced `/rɑːm/`, like _rahm_, rhyming with "calm") is a tiny React component for animated design-tool selection frames around text.

Wrap a word and it gets a hairline outline, four corner handles and a live `width × height` label, with a short letter-spacing pass that never moves the text around it.

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

Zero dependencies. Inherits the parent's typography. Respects `prefers-reduced-motion`.

## Props

| Prop            | Type                                        | Default      |
| --------------- | ------------------------------------------- | ------------ |
| `children`      | `ReactNode`                                 | required     |
| `delay`         | `number` (ms)                               | `0`          |
| `duration`      | `number` (ms)                               | `1400`       |
| `holdDuration`  | `number` (ms)                               | `1200`       |
| `label`         | `boolean \| (size) => string`               | `true`       |
| `labelPosition` | `"top" \| "bottom" \| "top-left" \| …`      | `"top"`      |
| `handles`       | `boolean`                                   | `true`       |
| `handleSize`    | `number` (px)                               | `6`          |
| `handleFill`    | `"hollow" \| "solid"`                       | `"hollow"`   |
| `lineWidth`     | `number` (px)                               | `1`          |
| `animation`     | `"tracking" \| "static"`                    | `"tracking"` |
| `trigger`       | `"mount" \| "hover" \| "click" \| "manual"` | `"mount"`    |
| `active`        | `boolean`                                   |              |
| `persistent`    | `boolean`                                   | `false`      |
| `color`         | `string`                                    | `"#0d99ff"`  |
| `onStart`       | `() => void`                                |              |
| `onComplete`    | `() => void`                                |              |

## CSS variables

```css
--ram-color             /* outline, handles and label; #0d99ff, selection blue */
--ram-line-width        /* 1px, outline and handle rings */
--ram-outline-opacity   /* 0.6 */
--ram-handle-size       /* 6px */
--ram-handle-fill       /* centre of a hollow handle; white on light, near-black on dark */
--ram-inset             /* 4px, how far the outline sits outside the text */
--ram-label-background  /* defaults to the frame colour */
--ram-label-color       /* white on light, near-black on dark */
--ram-label-font-size   /* 11px */
--ram-label-offset      /* 6px */
```

Full documentation and live examples: https://ram.dev

MIT
